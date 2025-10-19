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
interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginatedAlumnos {
  data: any[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}
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
            mesCuota: true,
          },
        },
      },
    });
  }

  async getAlumnosBySucursal(
    id: string,
    pagination?: PaginationOptions,
  ): Promise<PaginatedAlumnos> {
    const { page = 1, limit = 10 } = pagination || {};

    // Contar total de alumnos
    const totalItems = await this.alumnoRepository.count({
      where: { sucursal: { id } },
    });

    const alumnos = await this.alumnoRepository.find({
      where: { sucursal: { id } },
      relations: ['alumnoComisiones', 'certificados'],
      select: ['id', 'name', 'dni', 'tel'],
      skip: (page - 1) * limit,
      take: limit,
    });

    const data = alumnos.map((alumno) => ({
      id: alumno.id,
      name: alumno.name,
      dni: alumno.dni,
      tel: alumno.tel,
      idAluCom: alumno.alumnoComisiones?.map((ac) => ac.id) || [],
      cantidadComisiones: alumno.alumnoComisiones?.length || 0,
      cantidadCertificados: alumno.certificados?.length || 0,
    }));
  
    return {
      data,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    };
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

  async findByDniBasic(dni: string): Promise<Partial<Alumno> | null> {
    if (!dni) {
      throw new BadRequestException('Debe proporcionar un DNI');
    }
    const alumno = this.alumnoRepository.findOne({
      where: { dni },
      relations: ['sucursal'],
      select: {
        id: true,
        dni: true,
        name: true,
        fNac: true,
        tel: true,
        telex: true,
        ocupation: true,
        nationality: true,
        address: true,
        province: true,
        locality: true,
        email: true,
        age: true,
        gender: true,
        imgUrl: true,
        descuento: true,
        sucursal: {
          id: true,
          name: true,
        },
      },
    });
    if (!alumno) {
      throw new NotFoundException('Alumno no encontrado');
    }
    return alumno;
  }

  async findOne(dni: string): Promise<Alumno | null> {
    return this.alumnoRepository.findOne({
      where: { dni },
      relations: [
        'sucursal',
        'alumnoComisiones',
        'alumnoComisiones.pagos',
        'alumnoComisiones.comision',
      ],
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
            mesCuota: true,
            metodoPago: true,
          },
          comision: {
            name: true,
          },
        },
      },
    });
  }

  async update(id: string, updateAlumnoDto: UpdateAlumnoDto): Promise<Alumno> {
    const alumno = await this.alumnoRepository.findOne({
      where: { id },
      relations: ['sucursal'],
    });

    if (!alumno) {
      throw new NotFoundException(`Alumno con ID ${id} no encontrado`);
    }

    Object.assign(alumno, updateAlumnoDto);

    if (updateAlumnoDto.sucursalId) {
      const sucursal = await this.sucursalRepository.findOne({
        where: { id: updateAlumnoDto.sucursalId },
      });
      if (!sucursal) {
        throw new NotFoundException(
          `Sucursal con ID ${updateAlumnoDto.sucursalId} no encontrada`,
        );
      }

      alumno.sucursal = sucursal;
    }

    await this.alumnoRepository.save(alumno);
    return alumno;
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
