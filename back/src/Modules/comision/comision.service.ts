import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateComisionDto } from './dto/create-comision.dto';
import { UpdateComisionDto } from './dto/update-comision.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comision } from './entities/comision.entity';
import { Repository } from 'typeorm';
import { Sucursal } from '../sucursal/entities/sucursal.entity';
import { Curso } from '../curso/entities/curso.entity';
import { Profesor } from '../profesor/entities/profesor.entity';
import { AlumnoComision } from './entities/alumnocomision.entity';
import { Asistencia } from './entities/asistencia.entity';
import { CreateAsistenciaDto } from './dto/create-assistencia.dto';
import { ChangeStateDto } from './dto/changeState.dto';
import { Tracing } from 'trace_events';

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
    @InjectRepository(AlumnoComision)
    private readonly alumnoComisionRepository: Repository<AlumnoComision>,
    @InjectRepository(Asistencia)
    private readonly asistenciaRepository: Repository<Asistencia>,
  ) {}
  private cleanHour(hour: any): { start: string; end: string } {
    if (hour && hour.start && hour.end) {
      return {
        start: hour.start,
        end: hour.end,
      };
    }
    return { start: '', end: '' };
  }
  async create(createComisionDto: CreateComisionDto): Promise<Comision> {
    const cleanedHour = this.cleanHour(createComisionDto.hour);
    createComisionDto.hour = cleanedHour;
    const { sucursalId, cursoId, profesorId, name, day, hour } =
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
    return this.comisionRepository.find({
      relations: ['profesor', 'alumnoComisiones'],
      select: {
        alumnoComisiones: {
          id: true,
          state: true,
        },
      },
    });
  }
  
  async findOneAluCom(id: string) {
    return this.alumnoComisionRepository.findOne({
      where: { id },
      relations: ['comision', 'alumno', 'pagos.comprobante'],
      select: {
        comision: {
          id: true,
          name: true,
          day: true,
          hour: {
            start: true,
            end: true,
          },
        },
        alumno: {
          id: true,
          dni: true,
          name: true,
          tel: true,
        },
        pagos: {
          id: true,
          monto: true,
          metodoPago: true,
          fecha: true,
          cuota: true,
        },
      },
    });
  }

  async findOne(id: string) {
    return this.comisionRepository.findOne({
      where: { id },
      relations: [
        'sucursal',
        'alumnoComisiones.alumno',
        'alumnoComisiones.asistencias',
        "alumnoComisiones.pagos",
        'profesor',
        'curso',
      ],
      select: {
        sucursal: {
          id: true,
          name: true,
        },
        alumnoComisiones: {
          id: true,
          state: true,
          alumno: {
            id: true,
            dni: true,
            name: true,
            tel: true,
          },
          asistencias: {
            id: true,
            presente: true,
            fecha: true,
          },
          pagos:{
            id:true,
            fecha:true
          }
        },

        profesor: {
          id: true,
          name: true,
          apellido: true,
        },
        curso: {
          id: true,
          name: true,
        },
      },
    });
  }

  async update(id: string, updateComisionDto: UpdateComisionDto) {
    const { cursoId, profesorId, sucursalId, ...updateData } =
      updateComisionDto;

    const comision = await this.comisionRepository.findOne({
      where: { id },
      relations: ['curso', 'profesor', 'sucursal'],
    });

    if (!comision) {
      throw new NotFoundException(`Comisión con ID ${id} no encontrada`);
    }

    if (cursoId) {
      const curso = await this.cursoRepository.findOne({
        where: { id: cursoId },
      });
      if (!curso)
        throw new NotFoundException(`Curso con ID ${cursoId} no encontrado`);
      comision.curso = curso;
    }

    if (sucursalId) {
      const sucursal = await this.sucursalRepository.findOne({
        where: { id: sucursalId },
      });
      if (!sucursal)
        throw new NotFoundException(
          `Sucursal con ID ${sucursalId} no encontrada`,
        );
      comision.sucursal = sucursal;
    }

    if (profesorId) {
      const profesor = await this.profesorRepository.findOne({
        where: { id: profesorId },
      });
      if (!profesor)
        throw new NotFoundException(
          `Profesor con ID ${profesorId} no encontrado`,
        );
      comision.profesor = profesor;
    }

    Object.assign(comision, updateData);

    return this.comisionRepository.save(comision);
  }

  async remove(id: string) {
    const borrado = this.comisionRepository.delete(id);
    if ((await borrado).affected == 1) {
      return { message: 'Borrado exitoso' };
    } else {
      return { message: 'Error en el borrado no se hizo' };
    }
  }

  async findBySucursal(sucursalId: string): Promise<Comision[]> {
    return await this.comisionRepository.find({
      where: { sucursal: { id: sucursalId } },
      relations: ['curso', 'profesor', 'alumnoComisiones', 'sucursal'],
      select: {
        curso: {
          id: true,
          name: true,
        },
        sucursal: {
          id: true,
          name: true,
        },
        profesor: {
          id: true,
          name: true,
          apellido: true,
        },
      },
    });
  }

  async cambiarEstadoAlumnoComision(
    change: ChangeStateDto,
  ): Promise<AlumnoComision> {
    const { estado, alumnoCom } = change;
    const alumnoComision = await this.alumnoComisionRepository.findOne({
      where: { id: alumnoCom },
    });

    if (!alumnoComision) {
      throw new Error('La relación alumno-comisión no existe.');
    }

    alumnoComision.state = estado;

    return this.alumnoComisionRepository.save(alumnoComision);
  }

  async registrarAsistencia(
    dtoArray: CreateAsistenciaDto[],
  ): Promise<Asistencia[]> {
    const asistenciasAGuardar: Asistencia[] = [];

    for (const dto of dtoArray) {
      const { alumnoComisionId, presente, fecha } = dto;

      const alumnoComision = await this.alumnoComisionRepository.findOne({
        where: { id: alumnoComisionId },
      });

      if (!alumnoComision) {
        throw new NotFoundException(
          `Alumno con ID ${alumnoComisionId} no encontrado en la comisión`,
        );
      }

      const asistencia = this.asistenciaRepository.create({
        alumnoComision,
        presente,
        fecha: fecha,
      });

      asistenciasAGuardar.push(asistencia);
    }

    return await this.asistenciaRepository.save(asistenciasAGuardar);
  }

  async obtenerAsistenciasPorComision(
    comisionId: string,
  ): Promise<Asistencia[]> {
    return this.asistenciaRepository.find({
      where: { alumnoComision: { comision: { id: comisionId } } },
      relations: ['alumnoComision', 'alumnoComision.alumno'],
    });
  }
}
