import { Injectable, NotFoundException } from '@nestjs/common';
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
  async actualizarImgUrl(
    id: string,
    update: UpdateAlumnoDto,
  ): Promise<Alumno | null> {
    const alumno = await this.alumnoRepository.findOne({ where: { id } });

    if (!alumno) {
      throw new NotFoundException(`Alumno con ID ${id} no encontrado`);
    }

    alumno.imgUrl = update.imgUrl;
    const imgUpdt = await this.alumnoRepository.save(alumno);

    if (!imgUpdt) {
      throw new Error('Error al actualizar la imagen');
    }

    return await this.findOne(imgUpdt.id);
  }
  async findOne(id: string): Promise<Alumno | null> {
    return this.alumnoRepository.findOne({
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
  async loginAlumno(dni: number, email: string) {
    const alumno = await this.alumnoRepository.findOne({
      where: { dni, email },
    });
    if (!alumno) {
      throw new NotFoundException('Alumno no encontrado');
    }
    return { id: alumno.id };
  }
  update(id: string, updateAlumnoDto: UpdateAlumnoDto) {
    return `This action updates a #${id} alumno`;
  }

  remove(id: string) {
    return `This action removes a #${id} alumno`;
  }
}
