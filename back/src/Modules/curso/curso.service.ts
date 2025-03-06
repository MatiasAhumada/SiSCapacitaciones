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

  ) {}

  async create(createCursoDto: CreateCursoDto): Promise<Curso> {
    const curso = this.cursoRepository.create(createCursoDto);

    return this.cursoRepository.save(curso);
  }

  async findAll() {
    return this.cursoRepository.find();
  }

  async findOne(id: string) {
    return this.cursoRepository.findOne({
      where: { id },
      relations: ['comisiones'],
      select: {
        comisiones: {
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
    const cur = await this.cursoRepository.findOneBy({ id });
    if (!cur) {
      return null;
    }
    await this.cursoRepository.remove(cur);
    return `${cur.name} deleted`;
  }
}
