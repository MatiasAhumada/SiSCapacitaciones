import { Injectable } from '@nestjs/common';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Curso } from './entities/curso.entity';
import { Repository } from 'typeorm';

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

  async findAll(page = 1, limit = 10, area?: string, all = false) {
    const whereConditions: any = {};

    if (area) {
      whereConditions.area = area;
    }

    if (all) {
      const cursos = await this.cursoRepository.find({
        where: whereConditions,
        order: { name: 'ASC' },
      });
      return cursos;
    }

    const totalItems = await this.cursoRepository.count({
      where: whereConditions,
    });

    const cursos = await this.cursoRepository.find({
      where: whereConditions,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: cursos,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    };
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
