import { Injectable } from '@nestjs/common';
import { CreateProfesorDto } from './dto/create-profesor.dto';
import { UpdateProfesorDto } from './dto/update-profesor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profesor } from './entities/profesor.entity';
import { In, Repository } from 'typeorm';

import { Sucursal } from '../sucursal/entities/sucursal.entity';

@Injectable()
export class ProfesorService {
  constructor(
    @InjectRepository(Profesor)
    private readonly profesorRepository: Repository<Profesor>,

    @InjectRepository(Sucursal)
    private readonly sucursalRepository: Repository<Sucursal>,
  ) {}
  async create(createProfesorDto: CreateProfesorDto): Promise<Profesor> {
    const sucursal = await this.sucursalRepository.findOne({
      where: { id: createProfesorDto.sucursalId },
    });
    if (!sucursal) {
      throw new Error('Sucursal no encontrada');
    }
    const profesor = this.profesorRepository.create({
      ...createProfesorDto,
      sucursal: { id: sucursal.id },
    });

    return this.profesorRepository.save(profesor);
  }

  async findAll() {
    return this.profesorRepository.find();
  }
  async getProfesoresBySucursal(id: string) {
    return this.profesorRepository.find({
      where: { sucursal: { id } },
      select: ['id', 'name', 'apellido'],
    });
  }
  async findOne(id: string) {
    return this.profesorRepository.findOne({
      where: { id },
      relations: ['sucursal', 'comisiones'],
      select: {
        sucursal: {
          id: true,
          name: true,
        },

        comisiones: {
          id: true,
          name: true,
        },
      },
    });
  }

  async update(id: string, updateProfesorDto: UpdateProfesorDto) {
    return `This action updates a #${id} profesor`;
  }

  async remove(id: string) {
    const result = await this.profesorRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('Profesor no encontrado');
    }
    return { message: 'Profesor eliminado correctamente' };
  }
}
