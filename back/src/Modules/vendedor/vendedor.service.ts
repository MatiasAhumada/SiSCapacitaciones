import { Injectable } from '@nestjs/common';
import { CreateVendedorDto } from './dto/create-vendedor.dto';
import { UpdateVendedorDto } from './dto/update-vendedor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vendedor } from './entities/vendedor.entity';
import { In, Repository } from 'typeorm';
import { Sucursal } from '../sucursal/entities/sucursal.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';
import { VendedorResponseDto } from './dto/response.dto';

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
    const { sucursales, inscripciones, ...vendedorData } = createVendedorDto;

    const sucursalesEntities = await this.sucursalRepository.findOne({
      where: { id: sucursales },
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

    const newVendedor = this.vendedorRepository.create({
      ...vendedorData,
      sucursales: [sucursalesEntities],
      inscripciones: inscripcionesEntities,
    });

    return await this.vendedorRepository.save(newVendedor);
  }

  async findAll() {
    return this.vendedorRepository.find();
  }

  async findOne(id: string): Promise<VendedorResponseDto | undefined> {
    const vend = await this.vendedorRepository.findOne({
      where: { id },
      relations: ['inscripciones', 'sucursales'],
      select: {
        inscripciones: {
          id: true,
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
    return {
      id: vend.id,
      name: vend.name,
      isAdmin: vend.isAdmin,
      inscripciones: vend.inscripciones,
      sucursales: vend.sucursales,
    };
  }

  async update(id: string, updateVendedorDto: UpdateVendedorDto) {
    return `This action updates a #${id} vendedor`;
  }

  async remove(id: string) {
    return `This action removes a #${id} vendedor`;
  }
}
