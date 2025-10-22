import { Injectable } from '@nestjs/common';
import { CreateVendedorDto } from './dto/create-vendedor.dto';
import { UpdateVendedorDto } from './dto/update-vendedor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vendedor } from './entities/vendedor.entity';
import { In, Repository, MoreThanOrEqual, LessThanOrEqual, Between } from 'typeorm';
import { Sucursal } from '../sucursal/entities/sucursal.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';
import { VendedorResponseDto } from './dto/response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class VendedorService {
  constructor(
    @InjectRepository(Vendedor)
    private readonly vendedorRepository: Repository<Vendedor>,
    @InjectRepository(Sucursal)
    private readonly sucursalRepository: Repository<Sucursal>,
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
  ) {}
  async create(createVendedorDto: CreateVendedorDto) {
    const { sucursal, inscripciones, password, ...vendedorData } =
      createVendedorDto;

    const sucursalesEntities = await this.sucursalRepository.findOne({
      where: { id: In(sucursal) },
    });

    if (!sucursalesEntities) {
      throw new Error('Sucursal no encontrada');
    }

    let inscripcionesEntities: Inscripcion[] = [];
    if (inscripciones && inscripciones.length > 0) {
      inscripcionesEntities = await this.inscripcionRepository.find({
        where: { id: In(inscripciones) },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newVendedor = this.vendedorRepository.create({
      ...vendedorData,
      password: hashedPassword,
      sucursales: [sucursalesEntities],
      inscripciones: inscripcionesEntities,
    });

    return await this.vendedorRepository.save(newVendedor);
  }

  async findAll() {
    return this.vendedorRepository.find();
  }

  async getVendedoresBySucursal(id: string) {
    return this.vendedorRepository.find({
      where: { sucursales: { id } },
      select: ['id', 'name', 'email', 'tel'],
    });
  }

  async findOne(id: string, fechaDesde?: string, fechaHasta?: string): Promise<VendedorResponseDto | undefined> {
    let inscripcionWhere = {};
    
    if (fechaDesde && fechaHasta) {
      inscripcionWhere = { fechaRegistro: Between(new Date(fechaDesde), new Date(fechaHasta)) };
    } else if (fechaDesde) {
      inscripcionWhere = { fechaRegistro: MoreThanOrEqual(new Date(fechaDesde)) };
    } else if (fechaHasta) {
      inscripcionWhere = { fechaRegistro: LessThanOrEqual(new Date(fechaHasta)) };
    }

    const vend = await this.vendedorRepository.findOne({
      where: { id },
      relations: [
        'inscripciones.alumno',
        'inscripciones.comision.curso',
        'sucursales',
      ],
      select: {
        inscripciones: {
          id: true,
          fechaRegistro: true,
          alumno: {
            name: true,
            dni: true,
            tel: true,
          },
          comision: {
            name: true,
            curso: {
              name: true,
            },
          },
        },
        sucursales: {
          id: true,
          name: true,
        },
      },
    });
    if (!vend) {
      return undefined;
    }

    let inscripcionesFiltradas = vend.inscripciones;
    if (fechaDesde || fechaHasta) {
      inscripcionesFiltradas = vend.inscripciones.filter(inscripcion => {
        const fecha = new Date(inscripcion.fechaRegistro);
        if (fechaDesde && fecha < new Date(fechaDesde)) return false;
        if (fechaHasta && fecha > new Date(fechaHasta)) return false;
        return true;
      });
    }

    return {
      id: vend.id,
      name: vend.name,
      isAdmin: vend.isAdmin,
      inscripciones: inscripcionesFiltradas,
      sucursales: vend.sucursales,
      totalInscripciones: inscripcionesFiltradas.length,
    };
  }

  async update(id: string, updateVendedorDto: UpdateVendedorDto) {
    return `This action updates a #${id} vendedor`;
  }

  async remove(id: string) {
    const deleted = await this.vendedorRepository.delete(id);
    if (deleted.affected === 0) {
      throw new Error(`Vendedor con ID ${id} no encontrado`);
    }
  }
}
