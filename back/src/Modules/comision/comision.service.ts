import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateComisionDto } from './dto/create-comision.dto';
import { UpdateComisionDto } from './dto/update-comision.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comision } from './entities/comision.entity';
import { Repository } from 'typeorm';
import { Sucursal } from '../sucursal/entities/sucursal.entity';
import { Curso } from '../curso/entities/curso.entity';
import { Profesor } from '../profesor/entities/profesor.entity';

@Injectable()
export class ComisionService {
  constructor(
    @InjectRepository(Comision)
    private readonly comisionRepository: Repository<Comision>,
    @InjectRepository(Sucursal)
    private readonly sucursalRepository: Repository<Sucursal>,
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
    @InjectRepository(Profesor)
    private readonly profesorRepository: Repository<Profesor>,
  ) {}

  async create(createComisionDto: CreateComisionDto): Promise<Comision> {
    const { sucursalId, cursoId, profesorId, name, day,hour } =
      createComisionDto;

    const profesor = await this.profesorRepository.findOne({
      where: { id: profesorId },
    });

    if (!profesor) throw new NotFoundException('Profesor no encontrado');

    const sucursal = await this.sucursalRepository.findOne({
      where: { id: sucursalId },
    });
    if (!sucursal) {
      throw new NotFoundException('Sucursal no encontrada');
    }

    const curso = await this.cursoRepository.findOne({
      where: { id: cursoId },
    });
    if (!curso) {
      throw new NotFoundException('Curso no encontrado');
    }

    const nuevaComision = this.comisionRepository.create({
      name,
      day,
      hour,
      sucursal,
      profesor,
      curso,
    });

    return this.comisionRepository.save(nuevaComision);
  }

  async findAll() {
    return this.comisionRepository.find();
  }

  async findOne(id: string) {
    return this.comisionRepository.findOne({
      where: { id },
      relations: ['sucursal', 'alumnos', 'profesor', 'curso'],
      select: {
        sucursal: {
          id: true,
          name: true,
        },
        alumnos: {
          id: true,
          name: true,
        },
        profesor: {
          id: true,
          name: true,
        },
        curso: {
          id: true,
          name: true,
        },
      },
    });
  }

  async update(id: string, updateComisionDto: UpdateComisionDto) {
    return `This action updates a #${id} comision`;
  }

  async remove(id: string) {
    const borrado = this.comisionRepository.delete(id);
    if ((await borrado).affected == 1) {
      return { message: 'Borrado exitoso' };
    } else {
      return { message: 'Error en el borrado no se hizo' };
    }
  }
}
