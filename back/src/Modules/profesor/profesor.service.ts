import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfesorDto } from './dto/create-profesor.dto';
import { UpdateProfesorDto } from './dto/update-profesor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profesor } from './entities/profesor.entity';
import { Repository } from 'typeorm';

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
    const profesores = await this.profesorRepository.find({
      where: { sucursal: { id } },
      relations: ['comisiones'],
      select: ['id', 'name', 'apellido'],
    });

    return profesores.map((prof) => ({
      id: prof.id,
      name: prof.name,
      apellido: prof.apellido,
      cantidadComisiones: prof.comisiones.length,
    }));
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
    const profesor = await this.profesorRepository.findOne({ where: { id } });

    if (!profesor) {
      throw new NotFoundException(`Profesor con id ${id} no encontrado`);
    }

    Object.assign(profesor, updateProfesorDto);

    return await this.profesorRepository.save(profesor);
  }

  async remove(id: string) {
    const result = await this.profesorRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('Profesor no encontrado');
    }
    return { message: 'Profesor eliminado correctamente' };
  }
}
