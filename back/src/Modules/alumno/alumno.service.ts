import { Injectable } from '@nestjs/common';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Alumno } from './entities/alumno.entity';
import { Repository } from 'typeorm';
import { Sucursal } from '../sucursal/entities/sucursal.entity';

@Injectable()
export class AlumnoService {
  constructor(
    @InjectRepository(Alumno)
    private readonly alumnoRepository: Repository<Alumno>,
    @InjectRepository(Sucursal)
    private readonly sucursalRepository: Repository<Sucursal>,
  ) {}
  async create(createAlumnoDto: CreateAlumnoDto): Promise<Alumno | null> {
    const sucursal = await this.sucursalRepository.findOne({
      where: { id: createAlumnoDto.sucursalId },
    });

    if (!sucursal) {
      throw new Error('Sucursal no encontrada');
    }

    const alumno = this.alumnoRepository.create({
      ...createAlumnoDto,
      sucursal: { id: sucursal.id },
    });

    await this.alumnoRepository.save(alumno);

    return this.alumnoRepository.findOne({
      where: { id: alumno.id },
      relations: ['sucursal'],
      select: {
        sucursal: {
          id: true,
          name: true,
        },
      },
    });
  }
  findAll() {
    return this.alumnoRepository.find();
  }

  findOne(id: string) {
    return this.alumnoRepository.findOne({ where: { id } });
  }

  update(id: number, updateAlumnoDto: UpdateAlumnoDto) {
    return `This action updates a #${id} alumno`;
  }

  remove(id: number) {
    return `This action removes a #${id} alumno`;
  }
}
