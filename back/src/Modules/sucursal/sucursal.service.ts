import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';

import { Repository } from 'typeorm';
import { Sucursal } from './entities/sucursal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Admins } from '../admin/entities/admin.entity';
import { Alumno } from '../alumno/entities/alumno.entity';
import { Profesor } from '../profesor/entities/profesor.entity';
import { Comision } from '../comision/entities/comision.entity';
import { Vendedor } from '../vendedor/entities/vendedor.entity';

@Injectable()
export class SucursalService {
  constructor(
    @InjectRepository(Sucursal)
    private readonly sucRepository: Repository<Sucursal>,
    @InjectRepository(Admins)
    private readonly adminRepository: Repository<Admins>,
    @InjectRepository(Alumno)
    private readonly alumnoRepository: Repository<Alumno>,
    @InjectRepository(Profesor)
    private readonly profesorRepository: Repository<Profesor>,
    @InjectRepository(Comision)
    private readonly comisionRepository: Repository<Comision>,
    @InjectRepository(Vendedor)
    private readonly vendedorRepository: Repository<Vendedor>,
  ) {}

  async getSucursales() {
    const sucursales = await this.sucRepository.find({
      select: {
        id: true,
        name: true,
      },
    });

    const result = await Promise.all(
      sucursales.map(async (sucursal) => {
        const [
          alumnosCount,
          profesoresCount,
          comisionesCount,
          vendedoresCount,
        ] = await Promise.all([
          this.alumnoRepository.count({
            where: { sucursal: { id: sucursal.id } },
          }),
          this.profesorRepository.count({
            where: { sucursal: { id: sucursal.id } },
          }),
          this.comisionRepository.count({
            where: { sucursal: { id: sucursal.id } },
          }),
          this.vendedorRepository.count({
            where: { sucursales: { id: sucursal.id } },
          }),
        ]);

        return {
          id: sucursal.id,
          name: sucursal.name,
          alumnos: alumnosCount,
          profesores: profesoresCount,
          comisiones: comisionesCount,
          vendedores: vendedoresCount,
        };
      }),
    );

    return result;
  }

  // async getByIdSucursal(id: string): Promise<Sucursal | null> {
  //   return this.sucRepository.findOne({
  //     where: { id },
  //     relations: [
  //       'alumnos',
  //       'alumnos.alumnoComisiones',
  //       'alumnos.certificados',
  //       'profesores',
  //       'profesores.comisiones',
  //       'comisiones',
  //       'vendedores',
  //       'vendedores.inscripciones',
  //       'admin',
  //       'inscripciones',
  //       'servicios',
  //     ],
  //     select: {
  //       alumnos: {
  //         id: true,
  //         name: true,
  //         dni: true,
  //         tel: true,
  //       },
  //       profesores: {
  //         id: true,
  //         name: true,
  //         apellido: true,
  //       },
  //       comisiones: {
  //         id: true,
  //         name: true,
  //       },
  //       vendedores: {
  //         id: true,
  //         name: true,
  //         email: true,
  //         tel: true,
  //         inscripciones: {
  //           id: true,
  //         },
  //       },
  //       admin: {
  //         id: true,
  //         name: true,
  //       },
  //       inscripciones: {
  //         id: true,
  //         vendedor: {
  //           id: true,
  //           name: true,
  //         },
  //       },
  //       servicios: {
  //         id: true,
  //         name: true,
  //       },
  //     },
  //   });
  // }
  async getByIdSucursal(id: string) {
   
    const sucursal = await this.sucRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });
  
    if (!sucursal) return null;
  
 
    const [
      alumnosCount,
      certificadosCount,
      alumnoComisionesCount,
      profesoresCount,
      profesorComisionesCount,
      comisionesCount,
      vendedoresCount,
      //serviciosCount,
      //inscripcionesCount,
    ] = await Promise.all([
      this.alumnoRepository.count({ where: { sucursal: { id } } }),
      this.alumnoRepository
        .createQueryBuilder('alumno')
        .leftJoin('alumno.certificados', 'cert')
        .where('alumno.sucursalId = :id', { id })
        .select('COUNT(cert.numero)', 'count')
        .getRawOne()
        .then((res) => Number(res.count) || 0),
      this.alumnoRepository
        .createQueryBuilder('alumno')
        .leftJoin('alumno.alumnoComisiones', 'ac')
        .where('alumno.sucursalId = :id', { id })
        .select('COUNT(ac.id)', 'count')
        .getRawOne()
        .then((res) => Number(res.count) || 0),
      this.profesorRepository.count({ where: { sucursal: { id } } }),
      this.profesorRepository
        .createQueryBuilder('profesor')
        .leftJoin('profesor.comisiones', 'c')
        .where('profesor.sucursalId = :id', { id })
        .select('COUNT(c.id)', 'count')
        .getRawOne()
        .then((res) => Number(res.count) || 0),
      this.comisionRepository.count({ where: { sucursal: { id } } }),
      this.vendedorRepository
        .createQueryBuilder('v')
        .leftJoin('v.sucursales', 's')
        .where('s.id = :id', { id })
        .getCount(),
      
      //this.inscripcionRepository.count({ where: { sucursal: { id } } }),
    ]);
  
    return {
      id: sucursal.id,
      name: sucursal.name,
      alumnos: alumnosCount,
      certificados: certificadosCount,
      alumnoComisiones: alumnoComisionesCount,
      profesores: profesoresCount,
      profesorComisiones: profesorComisionesCount,
      comisiones: comisionesCount,
      vendedores: vendedoresCount,
      //servicios: serviciosCount,
      //inscripciones: inscripcionesCount,
    };
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
