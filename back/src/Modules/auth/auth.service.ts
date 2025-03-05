import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Admins } from '../admin/entities/admin.entity';
import { In, Repository } from 'typeorm';
import { Vendedor } from '../vendedor/entities/vendedor.entity';
import { Alumno } from '../alumno/entities/alumno.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admins)
    private adminsRepository: Repository<Admins>,
    @InjectRepository(Vendedor)
    private vendedorRepository: Repository<Vendedor>,
    @InjectRepository(Alumno)
    private alumnoRepository: Repository<Alumno>,
  ) {}

  async validateUser(name: string, password: string) {
    const admin = await this.adminsRepository.findOne({ where: { name } });
    if (admin && password === admin.password) {
      return { id: admin.id, isAdmin: admin.isAdmin };
    }else{
      console.log(admin)
    }

    const vendedor = await this.vendedorRepository.findOne({
      where: { email: name },
    });
    if (vendedor && password === vendedor.password) {
      return { id: vendedor.id, isAdmin: vendedor.isAdmin };
    }

   
    const alumno = await this.alumnoRepository.findOne({
      where: {  name },
    });
    if (alumno && alumno.dni === Number(password)) {
      return { id: alumno.id};
    }

    return null;
  }
}
