import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';

import { Repository } from 'typeorm';
import { Sucursal } from './entities/sucursal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Admins } from '../admin/entities/admin.entity';

@Injectable()
export class SucursalService {
  constructor(
    @InjectRepository(Sucursal)
    private readonly sucRepository: Repository<Sucursal>,
    @InjectRepository(Admins)
    private readonly adminRepository: Repository<Admins>,
  ) {}

  async getSucursales() {
    const sucursales = await this.sucRepository.find({
      select: {
        id: true,
        name: true,
      },
      relations: ['alumnos', 'profesores', 'comisiones', 'vendedores'],
    });

    const result = sucursales.map((sucursal) => ({
      id: sucursal.id,
      name: sucursal.name,
      alumnos: sucursal.alumnos.length,
      profesores: sucursal.profesores.length,
      comisiones: sucursal.comisiones.length,
      vendedores: sucursal.vendedores.length,
    }));

    return result;
  }

  async getByIdSucursal(id: string): Promise<Sucursal | null> {
    return this.sucRepository.findOne({
      where: { id },
      relations: [
        'alumnos',
        'profesores',
        'comisiones',
        'vendedores',
        'vendedores.inscripciones',
        'admin',
        'inscripciones',
        'servicios',
      ],
      select: {
        alumnos: {
          id: true,
          name: true,
        },
        profesores: {
          id: true,
          name: true,
        },
        comisiones: {
          id: true,
          name: true,
        },
        vendedores: {
          id: true,
          name: true,
          email: true,
          tel: true,
          inscripciones: {
            id: true
          },
        },
        admin: {
          id: true,
          name: true,
        },
        inscripciones: {
          id: true,
          vendedor: {
            id: true,
            name: true,
          },
        },
        servicios: {
          id: true,
          name: true,
        },
      },
    });
  }

  async createSuc(createSucursalDto: CreateSucursalDto) {
    const {
      adminId,
      vendedores,
      alumnos,
      profesores,
      comisiones,
      inscripciones,
      servicios,
      ...sucursalData
    } = createSucursalDto;

    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
    });
    if (!admin) {
      throw new NotFoundException('Admin no encontrado');
    }

    const newSucursal = this.sucRepository.create({
      ...sucursalData,
      admin: { id: adminId },
      vendedores: vendedores ? vendedores.map((id) => ({ id })) : [],
      alumnos: alumnos ? alumnos.map((id) => ({ id })) : [],
      profesores: profesores ? profesores.map((id) => ({ id })) : [],
      comisiones: comisiones ? comisiones.map((id) => ({ id })) : [],
      inscripciones: inscripciones ? inscripciones.map((id) => ({ id })) : [],
      servicios: servicios ? servicios.map((id) => ({ id })) : [],
    });

    return await this.sucRepository.save(newSucursal);
  }

  async removeSuc(id: string) {
    const suc = await this.sucRepository.findOneBy({ id });
    if (!suc) {
      return null;
    }
    await this.sucRepository.remove(suc);
    return `${suc.name} deleted`;
  }
}
