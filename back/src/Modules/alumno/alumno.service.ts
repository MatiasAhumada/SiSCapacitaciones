import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const { sucursalId, dni } = createAlumnoDto;

    if (!sucursalId || !dni) {
      throw new BadRequestException(
        'Datos incompletos: sucursalId o dni faltante',
      );
    }
    const sucursal = await this.sucursalRepository.findOne({
      where: { id: createAlumnoDto.sucursalId },
    });

    if (!sucursal) {
      throw new NotFoundException('Sucursal no encontrada');
    }

    const existingAlumno = await this.alumnoRepository.findOne({
      where: { dni: createAlumnoDto.dni },
    });
    if (existingAlumno) {
      throw new ConflictException('Alumno ya existente');
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
  async createSimpleAlumno(dni: string, name: string): Promise<Alumno> {
    const existingAlumno = await this.alumnoRepository.findOne({
      where: { dni: dni },
    });
    if (existingAlumno) {
      throw new ConflictException('Alumno ya existente');
    }
    const alumno = this.alumnoRepository.create({
      dni,
      name,
    });

    await this.alumnoRepository.save(alumno);

    return alumno;
  }

  async findAll() {
    return this.alumnoRepository.find({
      relations: ['alumnoComisiones.pagos'],
      select: {
        alumnoComisiones: {
          id: true,
          state: true,
          pagos: {
            id: true,
            fecha: true,
            cuota: true,
          },
        },
      },
    });
  }
  async getAlumnosBySucursal(id: string) {
    return this.alumnoRepository.find({
      where: { sucursal: { id } },
      select: ['id', 'name', 'dni', 'tel'],
    });
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
  async findOne(dni: string): Promise<Alumno | null> {
    return this.alumnoRepository.findOne({
      where: { dni },
      relations: ['sucursal', 'alumnoComisiones', 'alumnoComisiones.pagos'],
      select: {
        sucursal: {
          id: true,
          name: true,
          numeroSucursal: true,
        },
        alumnoComisiones: {
          id: true,
          state: true,
          pagos: {
            id: true,
            fecha: true,
            cuota: true,
            metodoPago: true,
          },
        },
      },
    });
  }

  async update(id: string, updateAlumnoDto: UpdateAlumnoDto) {
    return `This action updates a #${id} alumno`;
  }

  async remove(id: string) {
    const alu = await this.alumnoRepository.findOneBy({ id });
    if (!alu) {
      return null;
    }
    await this.alumnoRepository.remove(alu);
    return `${alu.name} deleted`;
  }
}
