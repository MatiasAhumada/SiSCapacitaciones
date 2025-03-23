import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vendedor } from '../vendedor/entities/vendedor.entity';
import { Alumno } from '../alumno/entities/alumno.entity';
import { Comision } from '../comision/entities/comision.entity';
import { Sucursal } from '../sucursal/entities/sucursal.entity';
import { In, Repository } from 'typeorm';
import { Inscripcion } from './entities/inscripcion.entity';
import { AlumnoComision } from '../comision/entities/alumnocomision.entity';

@Injectable()
export class InscripcionService {
  constructor(
    @InjectRepository(Vendedor)
    private readonly vendedorRepository: Repository<Vendedor>,
    @InjectRepository(Alumno)
    private readonly alumnoRepository: Repository<Alumno>,
    @InjectRepository(Comision)
    private readonly comisionRepository: Repository<Comision>,
    @InjectRepository(Sucursal)
    private readonly sucursalRepository: Repository<Sucursal>,
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
    @InjectRepository(AlumnoComision)
    private readonly alumnoComisionRepository: Repository<AlumnoComision>,
  ) {}
  async create(createInscripcionDto: CreateInscripcionDto) {
    const {
      vendedorId,
      alumnoId,
      comisionId,
      sucursalId,
      fechaRegistro,
      formaPago,
      cuotaIngreso,
      state,
    } = createInscripcionDto;

    const vendedor = await this.vendedorRepository.findOne({
      where: { id: vendedorId },
    });
    const alumno = await this.alumnoRepository.findOne({
      where: { id: alumnoId },
    });
    const comision = await this.comisionRepository.findOne({
      where: { id: comisionId },
      relations: ['alumnoComisiones'],
    });

    const sucursal = await this.sucursalRepository.findOne({
      where: { id: sucursalId },
    });

    if (!vendedor || !alumno || !comision || !sucursal) {
      throw new NotFoundException('Uno o más IDs proporcionados no existen');
    }
    const alumnoComisionExistente = await this.alumnoComisionRepository.findOne(
      {
        where: { alumno: { id: alumnoId }, comision: { id: comisionId } },
      },
    );
    if (!alumnoComisionExistente) {
      // Si no existe, se crea una nueva relación entre el alumno y la comisión con el estado
      const alumnoComision = this.alumnoComisionRepository.create({
        alumno,
        comision,
        state: state || true, // Si no se pasa el estado, se considera activo por defecto
      });
      await this.alumnoComisionRepository.save(alumnoComision);
    }

    

    const inscripcion = this.inscripcionRepository.create({
      fechaRegistro,
      formaPago,
      cuotaIngreso,
      vendedor,
      alumno,
      comision,
      sucursal,
    });
    const insc = await this.inscripcionRepository.save(inscripcion);
    return await this.findOne(insc.id);
  }

  async findAll() {
    return this.inscripcionRepository.find();
  }

  async findOne(id: string) {
    return this.inscripcionRepository.findOne({
      where: { id },
      relations: ['vendedor', 'alumno', 'comision', 'sucursal'],
      select: {
        vendedor: {
          id: true,
          name: true,
        },
        alumno: {
          id: true,
          name: true,
        },
        comision: {
          id: true,
          name: true,
        },
        sucursal: {
          id: true,
          name: true,
        },
      },
    });
  }

  async update(id: string, updateInscripcionDto: UpdateInscripcionDto) {
    return `This action updates a #${id} inscripcion`;
  }

  async remove(id: string) {
    const deleted = await this.inscripcionRepository.delete(id);
    if (deleted.affected === 0) {
      throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
    }
    return `Inscripción con ID ${id} eliminada`;
  }
}
