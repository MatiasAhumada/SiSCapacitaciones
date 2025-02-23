import { Injectable } from '@nestjs/common';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Curso } from './entities/curso.entity';
import { In, Repository } from 'typeorm';
import { Profesor } from '../profesor/entities/profesor.entity';

@Injectable()
export class CursoService {
  constructor(
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
    @InjectRepository(Profesor)
    private readonly profesorRepository: Repository<Profesor>,
  ) {}

  async create(createCursoDto: CreateCursoDto): Promise<Curso> {
    const { profesoresIds, ...cursoData } = createCursoDto;

    const profesores = await this.profesorRepository.findBy({
      id: In(profesoresIds),
    });

    if (profesores.length !== profesoresIds.length) {
      throw new Error('Uno o más profesores no existen');
    }

    const curso = this.cursoRepository.create({
      ...cursoData,
      profesores,
    });

    return this.cursoRepository.save(curso);
  }

  async findAll() {
    return this.cursoRepository.find();
  }

  async findOne(id: string) {
    return this.cursoRepository.findOne({
      where: { id },
      relations: ['profesores'],
      select: {
        profesores: {
          id: true,
          name: true,
        },
      },
    });
  }

  async update(id: string, updateCursoDto: UpdateCursoDto) {
    return `This action updates a #${id} curso`;
  }

  async remove(id: string) {
    return this.cursoRepository.delete(id);
  }
}
