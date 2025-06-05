import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Admins } from '../admin/entities/admin.entity';
import { In, Repository } from 'typeorm';
import { Vendedor } from '../vendedor/entities/vendedor.entity';
import { Alumno } from '../alumno/entities/alumno.entity';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';
import { id } from 'date-fns/locale';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admins)
    private adminsRepository: Repository<Admins>,
    @InjectRepository(Vendedor)
    private vendedorRepository: Repository<Vendedor>,
    @InjectRepository(Alumno)
    private alumnoRepository: Repository<Alumno>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(name: string, password: string) {
    const admin = await this.adminsRepository.findOne({ where: { name } });
    if (admin) {
      if (password === admin.password) {
        return { id: admin.id, isAdmin: true };
      } else {
        throw new BadRequestException('Contraseña incorrecta');
      }
    }

    const vendedor = await this.vendedorRepository.findOne({
      where: { email: name },
    });
    if (vendedor) {
      if (password === vendedor.password) {
        return { id: vendedor.id, isAdmin: false };
      } else {
        throw new BadRequestException('Contraseña incorrecta');
      }
    }

    const alumno = await this.alumnoRepository.findOne({
      where: { name },
    });
    if (alumno) {
      if (alumno.dni === password) {
        return { id: alumno.id };
      } else {
        throw new BadRequestException('DNI incorrecto');
      }
    }
    throw new NotFoundException('Usuario no encontrado');
  }
  async login(name: string, password: string) {
    const user = await this.validateUser(name, password);
    const payload = {
      sub: user.id,
      isAdmin: user.isAdmin ?? false,
    };
    return {
      access_token: this.jwtService.sign(payload),
      id: user.id,
      isAdmin: user.isAdmin,
    };
  }
}
