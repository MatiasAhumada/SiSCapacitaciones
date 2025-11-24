import { Injectable } from '@nestjs/common';
import { CreateVendedorDto } from './dto/create-vendedor.dto';
import { UpdateVendedorDto } from './dto/update-vendedor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vendedor } from './entities/vendedor.entity';
import {
  In,
  Repository,
  MoreThanOrEqual,
  LessThanOrEqual,
  Between,
} from 'typeorm';
import { Sucursal } from '../sucursal/entities/sucursal.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';
import { VendedorResponseDto } from './dto/response.dto';
import * as bcrypt from 'bcrypt';
import { ExcelService } from '../excel/excel.service';

@Injectable()
export class VendedorService {
  constructor(
    @InjectRepository(Vendedor)
    private readonly vendedorRepository: Repository<Vendedor>,
    @InjectRepository(Sucursal)
    private readonly sucursalRepository: Repository<Sucursal>,
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
    private readonly excelService: ExcelService,
  ) {}
  async create(createVendedorDto: CreateVendedorDto) {
    const { sucursal, inscripciones, password, ...vendedorData } =
      createVendedorDto;

    const sucursalesEntities = await this.sucursalRepository.find({
      where: { id: In(sucursal) },
    });

    if (!sucursalesEntities || sucursalesEntities.length === 0) {
      throw new Error('Sucursal no encontrada');
    }

    let inscripcionesEntities: Inscripcion[] = [];
    if (inscripciones && inscripciones.length > 0) {
      inscripcionesEntities = await this.inscripcionRepository.find({
        where: { id: In(inscripciones) },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newVendedor = this.vendedorRepository.create({
      ...vendedorData,
      password: hashedPassword,
      sucursales: sucursalesEntities,
      inscripciones: inscripcionesEntities,
    });

    return await this.vendedorRepository.save(newVendedor);
  }

  async findAll() {
    return this.vendedorRepository.find({
      relations: ['inscripciones', 'sucursales'],
      select: {
        id: true,
        name: true,
        email: true,
        tel: true,
        isAdmin: true,
        inscripciones: {
          id: true,
        },
        sucursales: {
          id: true,
          name: true,
        },
      },
    });
  }

  async getVendedoresBySucursal(
    id: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.vendedorRepository.findAndCount({
      where: { sucursales: { id } },
      relations: ['inscripciones'],
      select: {
        id: true,
        name: true,
        email: true,
        tel: true,
        inscripciones: {
          id: true,
        },
      },
      skip,
      take: limit,
    });

    return {
      data,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async findOne(
    id: string,
    fechaDesde?: string,
    fechaHasta?: string,
  ): Promise<VendedorResponseDto | undefined> {
    let inscripcionWhere = {};

    if (fechaDesde && fechaHasta) {
      inscripcionWhere = {
        fechaRegistro: Between(new Date(fechaDesde), new Date(fechaHasta)),
      };
    } else if (fechaDesde) {
      inscripcionWhere = {
        fechaRegistro: MoreThanOrEqual(new Date(fechaDesde)),
      };
    } else if (fechaHasta) {
      inscripcionWhere = {
        fechaRegistro: LessThanOrEqual(new Date(fechaHasta)),
      };
    }

    const vend = await this.vendedorRepository.findOne({
      where: { id },
      relations: [
        'inscripciones.alumno',
        'inscripciones.comision.curso',
        'sucursales',
      ],
      select: {
        inscripciones: {
          id: true,
          fechaRegistro: true,
          alumno: {
            name: true,
            dni: true,
            tel: true,
          },
          comision: {
            name: true,
            curso: {
              name: true,
            },
          },
        },
        sucursales: {
          id: true,
          name: true,
        },
      },
    });
    if (!vend) {
      return undefined;
    }

    let inscripcionesFiltradas = vend.inscripciones;
    if (fechaDesde || fechaHasta) {
      inscripcionesFiltradas = vend.inscripciones.filter((inscripcion) => {
        const fecha = new Date(inscripcion.fechaRegistro);
        if (fechaDesde && fecha < new Date(fechaDesde)) return false;
        if (fechaHasta && fecha > new Date(fechaHasta)) return false;
        return true;
      });
    }

    return {
      id: vend.id,
      name: vend.name,
      isAdmin: vend.isAdmin,
      inscripciones: inscripcionesFiltradas,
      sucursales: vend.sucursales,
      totalInscripciones: inscripcionesFiltradas.length,
    };
  }

  async update(id: string, updateVendedorDto: UpdateVendedorDto) {
    const { sucursal, inscripciones, password, ...vendedorData } =
      updateVendedorDto;

    const vendedor = await this.vendedorRepository.findOne({
      where: { id },
      relations: ['sucursales', 'inscripciones'],
    });

    if (!vendedor) {
      throw new Error(`Vendedor con ID ${id} no encontrado`);
    }

    // Actualizar datos básicos
    Object.assign(vendedor, vendedorData);

    // Actualizar contraseña si se proporciona
    if (password) {
      vendedor.password = await bcrypt.hash(password, 10);
    }

    // Actualizar sucursales si se proporcionan
    if (sucursal && sucursal.length > 0) {
      const sucursalesEntities = await this.sucursalRepository.find({
        where: { id: In(sucursal) },
      });
      vendedor.sucursales = sucursalesEntities;
    }

    // Actualizar inscripciones si se proporcionan
    if (inscripciones && inscripciones.length > 0) {
      const inscripcionesEntities = await this.inscripcionRepository.find({
        where: { id: In(inscripciones) },
      });
      vendedor.inscripciones = inscripcionesEntities;
    }

    return await this.vendedorRepository.save(vendedor);
  }

  async remove(id: string) {
    const deleted = await this.vendedorRepository.delete(id);
    if (deleted.affected === 0) {
      throw new Error(`Vendedor con ID ${id} no encontrado`);
    }
    return { message: 'Vendedor eliminado exitosamente' };
  }

  async generateInscripcionesExcel(
    id: string,
    fechaDesde?: string,
    fechaHasta?: string,
  ): Promise<Buffer> {
    const inscripcionWhere: any = { vendedor: { id } };

    if (fechaDesde && fechaHasta) {
      inscripcionWhere.fechaRegistro = Between(
        new Date(fechaDesde),
        new Date(fechaHasta),
      );
    } else if (fechaDesde) {
      inscripcionWhere.fechaRegistro = MoreThanOrEqual(new Date(fechaDesde));
    } else if (fechaHasta) {
      inscripcionWhere.fechaRegistro = LessThanOrEqual(new Date(fechaHasta));
    }

    const inscripciones = await this.inscripcionRepository.find({
      where: inscripcionWhere,
      relations: ['alumno', 'comision', 'comision.curso', 'vendedor'],
      order: { fechaRegistro: 'DESC' },
    });

    const data = inscripciones.map((insc) => ({
      fecha: new Date(insc.fechaRegistro).toLocaleDateString('es-ES'),
      alumno: insc.alumno.name,
      dni: insc.alumno.dni,
      telefono: insc.alumno.tel,
      curso: insc.comision.curso.name,
      comision: insc.comision.name,
      vendedor: insc.vendedor.name,
    }));

    const columns = [
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'Alumno', key: 'alumno', width: 30 },
      { header: 'DNI', key: 'dni', width: 15 },
      { header: 'Teléfono', key: 'telefono', width: 15 },
      { header: 'Curso', key: 'curso', width: 30 },
      { header: 'Comisión', key: 'comision', width: 20 },
      { header: 'Vendedor', key: 'vendedor', width: 25 },
    ];

    return await this.excelService.generateExcel(
      data,
      columns,
      'Inscripciones',
    );
  }
}
