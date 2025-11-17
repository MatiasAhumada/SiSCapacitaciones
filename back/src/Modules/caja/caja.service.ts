import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCajaDto } from './dto/create-caja.dto';
import { UpdateCajaDto } from './dto/update-caja.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Caja, MetodoPago, TipoMovimiento } from './entities/caja.entity';
import { Between, IsNull, Like, Not, Repository } from 'typeorm';
import { Vendedor } from '../vendedor/entities/vendedor.entity';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AlumnoComision } from '../comision/entities/alumnocomision.entity';
import { Comprobante } from '../comprobante/entities/comprobante.entity';
import { Categoria } from './entities/categoria.entity';
import { Subcategoria } from './entities/subcategoria.entity';
import { EgresoCajaDTO } from './dto/egreso-caja.dto';
import { IngresoSimpleDto } from './dto/ingreso-simple.dto';
import { Profesor } from '../profesor/entities/profesor.entity';
import { CreateTransferenciaDto } from './dto/transferencia-caja.dto';
import { SesionCaja } from './entities/sesion-caja.entity';
import * as ExcelJS from 'exceljs';
import dayjs = require('dayjs');
import utc = require('dayjs/plugin/utc');
import timezone = require('dayjs/plugin/timezone');
import { formatNumber } from '@modules/common/utils/formatters.utils';
import { formatPostgresDate } from '@modules/common/utils/date.utils';
import { isNull } from 'lodash';
import { ComprobanteGeneratorService } from './comprobante-generator.service';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class CajaService {
  constructor(
    @InjectRepository(Caja)
    private readonly cajaRepository: Repository<Caja>,
    @InjectRepository(Vendedor)
    private readonly vendedorRepository: Repository<Vendedor>,
    @InjectRepository(Comprobante)
    private comprobanteRepository: Repository<Comprobante>,
    @InjectRepository(AlumnoComision)
    private readonly alumnoComisionRepository: Repository<AlumnoComision>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    @InjectRepository(Subcategoria)
    private readonly subcategoriaRepository: Repository<Subcategoria>,
    @InjectRepository(Profesor)
    private readonly profesorRepository: Repository<Profesor>,
    @InjectRepository(SesionCaja)
    private readonly sesionRepository: Repository<SesionCaja>,
    private readonly comprobanteGeneratorService: ComprobanteGeneratorService,
  ) {}
  get fechaLocal(): Date {
    return dayjs().tz('America/Argentina/Buenos_Aires').toDate();
  }
  async create(createCajaDto: CreateCajaDto) {
    const { comprobante, tipo, vendedorId, alumnoComisionId, ...restoCaja } =
      createCajaDto;
    const vendedor = await this.vendedorRepository.findOne({
      where: { id: vendedorId },
    });
    if (!vendedor) {
      throw new NotFoundException('Vendedor no encontrado');
    }
    const sesionCaja = await this.sesionRepository.findOne({
      where: {
        vendedor: { id: vendedorId },
        fechaCierre: IsNull(),
      },
    });
    if (!sesionCaja) {
      throw new BadRequestException(
        'No hay sesión de caja abierta para este vendedor',
      );
    }

    if (tipo === TipoMovimiento.INGRESO) {
      const alumnoComision = await this.alumnoComisionRepository.findOne({
        where: { id: alumnoComisionId },
        relations: ['alumno'],
      });

      if (!alumnoComision) {
        throw new NotFoundException('Alumno no encontrado');
      }
      if (!comprobante) {
        throw new NotFoundException('Comprobante no encontrado');
      }
      const ultimoComprobante = await this.comprobanteRepository.findOne({
        where: { numeroComprobante: Like(`X ${comprobante.numeroSucursal}-%`) }, // Filtrar por número de sucursal
        order: { numeroComprobante: 'DESC' }, // Ordenar para obtener el último
      });

      let numeroLargo = 0;
      if (ultimoComprobante) {
        const partes = ultimoComprobante.numeroComprobante.split('-');
        if (partes.length > 1) {
          numeroLargo = parseInt(partes[1], 10);
        }
      }
      numeroLargo += 1;
      const numeroLargoFormateado = numeroLargo.toString().padStart(8, '0');
      const numeroComprobante = `X ${comprobante.numeroSucursal}-${numeroLargoFormateado}`;

      const newComprobante = new Comprobante();
      newComprobante.apellidoNombre = alumnoComision.alumno.name; // Nombre del alumno
      newComprobante.dni = alumnoComision.alumno.dni; // DNI del alumno
      newComprobante.domicilioComercial = alumnoComision.alumno.address ?? '-'; // Domicilio del alumno
      newComprobante.iva = '-'; // Ajusta esto según sea necesario
      newComprobante.fecha = restoCaja.fecha; // Fecha actual
      newComprobante.formaPago = comprobante.formaPago; // Forma de pago recibida en el DTO
      newComprobante.observacion = comprobante.observacion; // Observación
      newComprobante.monto = restoCaja.monto; // Monto de la caja
      newComprobante.tipoComprobante = comprobante.tipoComprobante; // Tipo de comprobante
      newComprobante.numero = comprobante.numero; // Número de comprobante
      newComprobante.numeroComprobante = numeroComprobante; // Número del comprobante

      await this.comprobanteRepository.save(newComprobante);

      const newCaja = new Caja();
      newCaja.tipo = tipo;
      newCaja.metodoPago = restoCaja.metodoPago;
      newCaja.monto = restoCaja.monto;
      newCaja.descripcion = restoCaja.descripcion;
      newCaja.fecha = restoCaja.fecha;
      newCaja.cuota = restoCaja.cuota;
      newCaja.mesCuota = restoCaja.mesCuota;
      newCaja.vendedor = vendedor;
      newCaja.comprobante = newComprobante;
      newCaja.alumnoComision = alumnoComision;
      newCaja.sesionCaja = sesionCaja;

      const cajaGuardada = await this.cajaRepository.save(newCaja);

      // Actualizar totales de la sesión
      await this.actualizarConMovimiento(sesionCaja.id, cajaGuardada);

      // Si es pago digital o ferro, duplicar en caja perpetua correspondiente
      if (
        restoCaja.metodoPago === MetodoPago.DIGITAL_JAVIER ||
        restoCaja.metodoPago === MetodoPago.DIGITAL_TOBIAS ||
        restoCaja.metodoPago === MetodoPago.FERRO
      ) {
        await this.duplicarEnCajaPerpetua(cajaGuardada, restoCaja.metodoPago);
      }

      return cajaGuardada;
    }
  }

  async findAll(
    page = 1,
    limit = 10,
    vendedorId?: string,
    order: 'ASC' | 'DESC' = 'DESC',
  ) {
    const where: any = {};
    if (vendedorId) {
      where.vendedor = { id: vendedorId };
    }
    const [data, total] = await this.cajaRepository.findAndCount({
      relations: [
        'vendedor',
        'alumnoComision.alumno',
        'alumnoComision.comision',
      ],
      where,
      ...(page && limit
        ? {
            skip: (page - 1) * limit,
            take: limit,
          }
        : {}), // si no hay paginado, trae todo
      order: { fecha: order },
      select: {
        vendedor: {
          id: true,
          name: true,
        },
        alumnoComision: {
          id: true,
          alumno: {
            id: true,
            name: true,
          },
          comision: {
            id: true,
            name: true,
          },
        },
      },
    });
    return {
      data,
      totalPages: limit ? Math.ceil(total / limit) : 1,
      currentPage: page ?? 1,
    };
  }

  async findOne(id: string) {
    return `This action returns a #${id} caja`;
  }

  async update(id: string, updateCajaDto: UpdateCajaDto) {
    const { alumnoComisionId, vendedorId, ...updateData } = updateCajaDto;

    const caja = await this.cajaRepository.findOne({
      where: { id },
      relations: ['alumnoComision', 'vendedor', 'sesionCaja'],
    });
    if (!caja) {
      throw new NotFoundException(`Caja con ID ${id} no encontrada`);
    }
    if (alumnoComisionId) {
      const alumnoComision = await this.alumnoComisionRepository.findOne({
        where: { id: alumnoComisionId },
      });
      if (!alumnoComision) {
        throw new NotFoundException(
          `AlumnoComision con ID ${alumnoComisionId} no encontrado`,
        );
      }
      caja.alumnoComision = alumnoComision;
    }
    if (vendedorId) {
      const vendedor = await this.vendedorRepository.findOne({
        where: { id: vendedorId },
      });
      if (!vendedor)
        throw new NotFoundException(
          `Vendedor con ID ${vendedorId} no encontrado`,
        );
      caja.vendedor = vendedor;
    }

    Object.assign(caja, updateData);
    const cajaActualizada = await this.cajaRepository.save(caja);

    // Si tiene sesión asociada, recalcular totales
    if (caja.sesionCaja) {
      await this.recalcularTotalesSesion(caja.sesionCaja.id);
    }

    return cajaActualizada;
  }

  async remove(id: string) {
    const caja = await this.cajaRepository.findOne({
      where: { id },
      relations: ['sesionCaja'],
    });

    if (!caja) {
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado`);
    }

    const sesionId = caja.sesionCaja?.id;
    const resultado = await this.cajaRepository.delete(id);

    // Si tenía sesión asociada, recalcular totales
    if (sesionId) {
      await this.recalcularTotalesSesion(sesionId);
    }

    return resultado;
  }

  async findByVendedor(
    vendedorId: string,
    page?: number,
    limit?: number,
    useCustom = false,
    filterDate?: string,
  ) {
    if (useCustom) {
      return await this.getSesionesForUser(vendedorId, page, limit, filterDate);
    }
    // Si vienen page y limit -> paginamos
    if (page && limit) {
      const [movimientos, total] = await this.cajaRepository.findAndCount({
        where: { vendedor: { id: vendedorId } },
        relations: [
          'vendedor',
          'alumnoComision.alumno',
          'subcategoria',
          'subcategoria.categoria',
        ],
        select: {
          vendedor: {
            id: true,
            name: true,
          },
          alumnoComision: {
            id: true,
            alumno: {
              id: true,
              name: true,
            },
          },
          subcategoria: {
            id: true,
            nombre: true,
            categoria: {
              id: true,
              nombre: true,
            },
          },
        },
        order: { fecha: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });

      return {
        data: movimientos.map((mov) => ({
          ...mov,
          fecha: formatPostgresDate(mov.fecha),
        })),
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      };
    }

    // Si NO vienen -> devolver todo sin paginación
    const movimientos = await this.cajaRepository.find({
      where: { vendedor: { id: vendedorId } },
      relations: [
        'alumnoComision.alumno',
        'subcategoria',
        'subcategoria.categoria',
      ],
      select: {
        alumnoComision: {
          id: true,
          alumno: {
            id: true,
            name: true,
          },
        },
        subcategoria: {
          id: true,
          nombre: true,
          categoria: {
            id: true,
            nombre: true,
          },
        },
      },
      order: { fecha: 'DESC' },
    });

    return movimientos.map((mov) => ({
      ...mov,
      fecha: format(new Date(mov.fecha), 'dd/MM/yyyy HH:mm', { locale: es }),
    }));
  }

  async getMovimientosPorDia(fecha: string) {
    return this.cajaRepository.find({
      where: {
        fecha: Between(
          new Date(`${fecha}T00:00:00`),
          new Date(`${fecha}T23:59:59.999`),
        ),
      },
      relations: ['vendedor', 'alumnoComision.alumno'],
      select: {
        vendedor: {
          id: true,
          name: true,
        },
        alumnoComision: {
          id: true,
          alumno: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async getResumenPorDia(fecha: string) {
    const movimientos = await this.getMovimientosPorDia(fecha);
    const ingresos = movimientos
      .filter((m) => m.tipo === TipoMovimiento.INGRESO)
      .reduce((sum, m) => sum + Number(m.monto), 0);
    const egresos = movimientos
      .filter((m) => m.tipo === TipoMovimiento.EGRESO)
      .reduce((sum, m) => sum + Number(m.monto), 0);
    return { ingresos, egresos, total: ingresos - egresos };
  }

  async getResumenTotal() {
    const movimientos = await this.cajaRepository.find();
    const ingresos = movimientos
      .filter((m) => m.tipo === TipoMovimiento.INGRESO)
      .reduce((sum, m) => sum + Number(m.monto), 0);
    const egresos = movimientos
      .filter((m) => m.tipo === TipoMovimiento.EGRESO)
      .reduce((sum, m) => sum + Number(m.monto), 0);
    return { ingresos, egresos, total: ingresos - egresos };
  }

  //BUSCAR CAJAS POR ADMINS
  async findByTobias(): Promise<Caja[]> {
    return this.cajaRepository.find({
      where: { metodoPago: MetodoPago.DIGITAL_TOBIAS },
      relations: ['vendedor', 'alumnoComision.alumno', 'comprobante'],
      order: { fecha: 'DESC' },
    });
  }
  async findByJavier(): Promise<Caja[]> {
    return this.cajaRepository.find({
      where: { metodoPago: MetodoPago.DIGITAL_JAVIER },
      relations: ['vendedor', 'alumnoComision.alumno', 'comprobante'],
      order: { fecha: 'DESC' },
    });
  }
  //CATEGORIAS SEPARADAS
  async createCategoria(nombre: string): Promise<Categoria> {
    const categoria = this.categoriaRepository.create({ nombre });
    return this.categoriaRepository.save(categoria);
  }

  async createSubcategoria(
    nombre: string,
    categoriaId: string,
  ): Promise<Subcategoria> {
    const categoria = await this.categoriaRepository.findOneBy({
      id: categoriaId,
    });
    if (!categoria) throw new Error('Categoría no encontrada');

    const subcategoria = this.subcategoriaRepository.create({
      nombre,
      categoria,
    });
    return this.subcategoriaRepository.save(subcategoria);
  }
  //CATEGORIA Y SUBCATEGORIA JUNTAS
  async createCategoriaConSubcategorias(
    nombre: string,
    subcategorias: string[],
  ) {
    const categoria = this.categoriaRepository.create({ nombre });
    const savedCategoria = await this.categoriaRepository.save(categoria);

    const subcategoriasEntities = subcategorias.map((nombre) =>
      this.subcategoriaRepository.create({ nombre, categoria: savedCategoria }),
    );

    await this.subcategoriaRepository.save(subcategoriasEntities);
    return savedCategoria;
  }
  async obtenerCategoriasConSubcategorias() {
    return this.categoriaRepository.find({
      relations: ['subcategorias'],
      order: {
        nombre: 'ASC',
        subcategorias: {
          nombre: 'ASC',
        },
      },
    });
  }

  async inicializarCategoriaRetiro() {
    const categoriaExistente = await this.categoriaRepository.findOne({
      where: { nombre: 'RETIRO' },
      relations: ['subcategorias'],
    });

    if (!categoriaExistente) {
      const categoria = await this.createCategoria('RETIRO');
      await this.createSubcategoria('Retiro', categoria.id);
      return categoria;
    }

    return categoriaExistente;
  }

  //PAGO A PROFESORES

  async createEgresoProfesor(dto: EgresoCajaDTO) {
    const profesor = await this.profesorRepository.findOne({
      where: { id: dto.profesorId },
    });
    if (!profesor)
      throw new HttpException('Profesor no encontrado', HttpStatus.NOT_FOUND);

    const subcategoria = await this.subcategoriaRepository.findOne({
      where: { id: dto.subcategoriaId },
    });

    if (!subcategoria)
      throw new HttpException(
        'Categoría no encontrada',
        HttpStatus.BAD_REQUEST,
      );

    const vendedor = await this.vendedorRepository.findOne({
      where: { id: dto.vendedorId },
    });
    if (!vendedor) {
      throw new HttpException('Vendedor no encontrado', HttpStatus.NOT_FOUND);
    }

    const sesionAbierta = await this.sesionRepository.findOne({
      where: {
        vendedor: { id: dto.vendedorId },
        fechaCierre: IsNull(),
      },
    });
    if (!sesionAbierta) {
      throw new HttpException(
        'No hay sesión de caja abierta',
        HttpStatus.BAD_REQUEST,
      );
    }

    const caja = this.cajaRepository.create({
      tipo: TipoMovimiento.EGRESO,
      metodoPago: dto.metodoPago,
      monto: dto.monto,
      descripcion:
        dto.descripcion ||
        `Pago mensual al profesor ${profesor.name} ${profesor.apellido}`,
      profesor,
      subcategoria,
      vendedor,
      fecha: dto.fecha ? new Date(dto.fecha) : new Date(),
      sesionCaja: sesionAbierta,
    });

    const movimientoGuardado = await this.cajaRepository.save(caja);
    await this.actualizarConMovimiento(sesionAbierta.id, movimientoGuardado);
    return movimientoGuardado;
  }

  async createEgresoVendedor(dto: EgresoCajaDTO) {
    const vendedor = await this.vendedorRepository.findOne({
      where: { id: dto.pagoVendedorId },
    });
    if (!vendedor)
      throw new HttpException('Vendedor no encontrado', HttpStatus.NOT_FOUND);

    const subcategoria = await this.subcategoriaRepository.findOne({
      where: { id: dto.subcategoriaId },
    });

    if (!subcategoria)
      throw new HttpException(
        'Categoría no encontrada',
        HttpStatus.BAD_REQUEST,
      );

    // Buscar sesión abierta del vendedor que ejecuta el pago
    const sesionAbierta = await this.sesionRepository.findOne({
      where: {
        vendedor: { id: dto.vendedorId },
        fechaCierre: IsNull(),
      },
    });
    if (!sesionAbierta) {
      throw new HttpException(
        'No hay sesión de caja abierta',
        HttpStatus.BAD_REQUEST,
      );
    }

    const caja = this.cajaRepository.create({
      tipo: TipoMovimiento.EGRESO,
      metodoPago: dto.metodoPago,
      monto: dto.monto,
      descripcion:
        dto.descripcion ||
        `Pago de ${subcategoria.nombre} al vendedor ${vendedor.name}`,
      vendedorPagos: vendedor,
      subcategoria,
      fecha: dto.fecha ? new Date(dto.fecha) : new Date(),
      sesionCaja: sesionAbierta,
    });

    const movimientoGuardado = await this.cajaRepository.save(caja);
    await this.actualizarConMovimiento(sesionAbierta.id, movimientoGuardado);
    return movimientoGuardado;
  }
  async createEgresoSimple(dto: EgresoCajaDTO) {
    const vendedor = await this.vendedorRepository.findOne({
      where: { id: dto.vendedorId },
    });
    if (!vendedor) {
      throw new HttpException('Vendedor no encontrado', HttpStatus.NOT_FOUND);
    }

    const subcategoria = await this.subcategoriaRepository.findOne({
      where: { id: dto.subcategoriaId },
      relations: ['categoria'],
    });

    if (!subcategoria)
      throw new HttpException(
        'Subcategoría no encontrada',
        HttpStatus.BAD_REQUEST,
      );
    const sesionAbierta = await this.sesionRepository.findOne({
      where: {
        vendedor: { id: dto.vendedorId },
        fechaCierre: IsNull(), // la sesión no cerrada
      },
    });
    if (!sesionAbierta) {
      throw new HttpException(
        'No hay sesión de caja abierta',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validar saldo suficiente para retiros en efectivo
    if (subcategoria.categoria?.nombre?.toLowerCase() === 'retiro' && dto.metodoPago === MetodoPago.EFECTIVO) {
      const saldoEfectivo = Number(sesionAbierta.totalEfectivo);
      if (saldoEfectivo < dto.monto) {
        throw new HttpException(
          `Saldo insuficiente en efectivo. Disponible: $${saldoEfectivo}, Solicitado: $${dto.monto}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    const fechaLocal = dto.fecha
      ? dayjs(dto.fecha).tz('America/Argentina/Buenos_Aires').toDate()
      : dayjs().tz('America/Argentina/Buenos_Aires').toDate();

    const caja = this.cajaRepository.create({
      tipo: TipoMovimiento.EGRESO,
      metodoPago: dto.metodoPago,
      monto: dto.monto,
      descripcion: dto.descripcion || `Egreso por ${subcategoria.nombre}`,
      vendedor,
      subcategoria,
      fecha: fechaLocal,
      sesionCaja: sesionAbierta, // Asociamos la sesión abierta
    });

    const movimientoGuardado = await this.cajaRepository.save(caja);
    await this.actualizarConMovimiento(sesionAbierta.id, movimientoGuardado);
    return movimientoGuardado;
  }
  //transferencias
  async transferirCaja(dto: CreateTransferenciaDto) {
    const {
      fecha,
      metodoPago,
      monto,
      descripcion,
      vendedorOrigenId,
      vendedorDestinoId,
    } = dto;

    const vendedorOrigen = await this.vendedorRepository.findOneBy({
      id: vendedorOrigenId,
    });
    if (!vendedorOrigen)
      throw new NotFoundException('Vendedor origen no encontrado');

    const vendedorDestino = await this.vendedorRepository.findOneBy({
      id: vendedorDestinoId,
    });
    if (!vendedorDestino)
      throw new NotFoundException('Vendedor destino no encontrado');

    // Buscar sesiones abiertas
    const sesionOrigen = await this.sesionRepository.findOne({
      where: { vendedor: { id: vendedorOrigenId }, fechaCierre: IsNull() },
    });

    const sesionDestino = await this.sesionRepository.findOne({
      where: { vendedor: { id: vendedorDestinoId }, fechaCierre: IsNull() },
    });

    if (!sesionOrigen) {
      throw new BadRequestException('No hay sesión abierta para el vendedor origen');
    }

    if (!sesionDestino) {
      throw new BadRequestException('No hay sesión abierta para el vendedor destino');
    }

    const egreso = this.cajaRepository.create({
      tipo: TipoMovimiento.TRANSFERENCIA,
      metodoPago,
      monto,
      descripcion: descripcion || `Transferencia a ${vendedorDestino.name}`,
      fecha: fecha ? new Date(fecha) : new Date(),
      vendedor: vendedorOrigen,
      sesionCaja: sesionOrigen,
    });

    const ingreso = this.cajaRepository.create({
      tipo: TipoMovimiento.INGRESO,
      metodoPago,
      monto,
      descripcion: descripcion || `Transferencia desde ${vendedorOrigen.name}`,
      fecha: fecha ? new Date(fecha) : new Date(),
      vendedor: vendedorDestino,
      sesionCaja: sesionDestino,
    });

    const [egresoGuardado, ingresoGuardado] = await this.cajaRepository.save([
      egreso,
      ingreso,
    ]);

    // Actualizar totales de ambas sesiones
    await this.actualizarConMovimiento(sesionOrigen.id, egresoGuardado);
    await this.actualizarConMovimiento(sesionDestino.id, ingresoGuardado);

    return {
      message: 'Transferencia realizada con éxito',
      egreso: egresoGuardado,
      ingreso: ingresoGuardado,
    };
  }
  //apertura de caja
  async aperturaCaja(vendedorId: string): Promise<Caja> {
    const vendedor = await this.vendedorRepository.findOne({
      where: { id: vendedorId },
    });
    if (!vendedor) {
      throw new NotFoundException('Vendedor no encontrado');
    }

    const hoy = new Date();
    hoy.setHours(hoy.getHours() - 3);
    // Validar que no haya una sesión abierta
    const sesionAbierta = await this.sesionRepository.findOne({
      where: {
        vendedor: { id: vendedorId },
        fechaCierre: IsNull(),
      },
    });
    if (sesionAbierta) {
      throw new BadRequestException(
        'Ya hay una sesión de caja abierta sin cerrar.',
      );
    }

    let montoApertura = 0;
    // Buscar última sesión cerrada
    const ultimaSesion = await this.sesionRepository.findOne({
      where: {
        vendedor: { id: vendedorId },
        fechaCierre: Not(IsNull()),
      },
      order: {
        fechaCierre: 'DESC',
      },
    });
    if (ultimaSesion) {
      // El arrastre debe ser solo el efectivo que quedó de la sesión anterior
      montoApertura = Number(ultimaSesion.totalEfectivo) || 0;
    }

    const nuevaSesion = this.sesionRepository.create({
      fechaApertura: hoy,
      montoApertura: montoApertura,
      totalIngresos: 0,
      totalEgresos: 0,
      totalDigitalJavier: 0,
      totalDigitalTobias: 0,
      totalCredito: 0,
      totalEfectivo: montoApertura, // El efectivo inicial es el arrastre
      totalFerro: 0,
      vendedor,
    });
    await this.sesionRepository.save(nuevaSesion);

    // Solo crear movimiento de apertura si hay monto > 0
    if (montoApertura > 0) {
      const apertura = this.cajaRepository.create({
        fecha: new Date(),
        tipo: TipoMovimiento.APERTURA,
        metodoPago: MetodoPago.EFECTIVO,
        descripcion: 'Apertura de caja',
        monto: montoApertura,
        vendedor,
        sesionCaja: nuevaSesion,
      });

      const aperturaGuardada = await this.cajaRepository.save(apertura);
      // NO llamar actualizarConMovimiento porque ya establecimos el totalEfectivo
      return aperturaGuardada;
    }

    // Si no hay monto de apertura, crear movimiento simbólico
    const apertura = this.cajaRepository.create({
      fecha: new Date(),
      tipo: TipoMovimiento.APERTURA,
      metodoPago: MetodoPago.EFECTIVO,
      descripcion: 'Apertura de caja',
      monto: 0,
      vendedor,
      sesionCaja: nuevaSesion,
    });

    return await this.cajaRepository.save(apertura);
  }

  async cerrarSesionCaja(vendedorId: string): Promise<SesionCaja> {
    if (!vendedorId) {
      throw new BadRequestException('El id del vendedor es obligatorio');
    }
    const vendedor = await this.vendedorRepository.findOne({
      where: { id: vendedorId },
    });

    if (!vendedor) {
      throw new NotFoundException('Vendedor no encontrado');
    }
    // Buscamos la sesión abierta (sin fechaCierre)
    const sesionAbierta = await this.sesionRepository.findOne({
      where: {
        vendedor: { id: vendedorId },
        fechaCierre: IsNull(),
      },
      relations: ['movimientos'], // si necesitás cargar movimientos para actualizar totales
    });

    if (!sesionAbierta) {
      throw new BadRequestException('No hay sesión abierta para cerrar.');
    }

    // Opcional: validar que el vendedor tenga movimientos en esa sesión, si querés controlar por vendedor
    // const movimientosVendedor = sesionAbierta.movimientos.filter(mov => mov.vendedor?.id === vendedorId);
    // if (movimientosVendedor.length === 0) {
    //   throw new BadRequestException('El vendedor no tiene movimientos en la sesión abierta.');
    // }

    // Los totales ya están actualizados automáticamente, solo calcular montoCierre
    sesionAbierta.montoCierre =
      Number(sesionAbierta.totalIngresos) +
      Number(sesionAbierta.montoApertura) -
      Number(sesionAbierta.totalEgresos);
    sesionAbierta.fechaCierre = this.fechaLocal;
    await this.sesionRepository.save(sesionAbierta);
    const cierre = this.cajaRepository.create({
      fecha: this.fechaLocal,
      tipo: TipoMovimiento.CIERRE,
      metodoPago: MetodoPago.EFECTIVO,
      descripcion: 'Cierre de caja',
      monto: sesionAbierta.montoCierre,
      vendedor,
      sesionCaja: sesionAbierta,
    });

    await this.cajaRepository.save(cierre);
    return sesionAbierta;
  }

  async obtenerSesionPorFecha(userId: string, page = 1, limit = 10) {
    if (!userId) {
      throw new NotFoundException('ID de usuario no enviado');
    }

    // 1. Buscar sesión abierta sin importar la fecha (vendedor o admin)
    const sesionAbierta = await this.sesionRepository.findOne({
      where: [
        { vendedor: { id: userId }, fechaCierre: IsNull() },
        { admin: { id: userId }, fechaCierre: IsNull() }
      ],
      order: { fechaApertura: 'ASC' },
    });

    let sesiones: SesionCaja[] = [];

    if (sesionAbierta) {
      // si hay una sesión abierta, usar esa
      sesiones = [sesionAbierta];
    } else {
      // 2. Buscar sesiones del día (vendedor o admin)
      const fecha = new Date();
      const inicioDelDia = new Date(fecha);
      inicioDelDia.setHours(0, 0, 0, 0);
      const finDelDia = new Date(fecha);
      finDelDia.setHours(23, 59, 59, 999);

      sesiones = await this.sesionRepository.find({
        where: [
          {
            vendedor: { id: userId },
            fechaApertura: Between(inicioDelDia, finDelDia),
          },
          {
            admin: { id: userId },
            fechaApertura: Between(inicioDelDia, finDelDia),
          }
        ],
        order: { fechaApertura: 'ASC' },
      });

      if (!sesiones.length) {
        throw new NotFoundException(
          'No se encontraron sesiones abiertas ni sesiones del día.',
        );
      }
    }

    const sesionesConMovimientos = await Promise.all(
      sesiones.map(async (sesion) => {
        const [movimientos, total] = await this.cajaRepository.findAndCount({
          where: { sesionCaja: { id: sesion.id } },
          relations: ['alumnoComision.alumno'],
          select: {
            alumnoComision: {
              id: true,
              alumno: {
                id: true,
                name: true,
                dni: true,
              },
            },
          },
          order: { fecha: 'ASC' },
          skip: (page - 1) * limit,
          take: limit,
        });

        // Usar totales ya calculados automáticamente
        const montoCierre =
          Number(sesion.montoApertura) +
          Number(sesion.totalIngresos) -
          Number(sesion.totalEgresos);

        return {
          ...sesion,
          movimientos,
          montoCierre,
          totalMovimientos: total,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
        };
      }),
    );

    return sesionesConMovimientos;
  }

  private async duplicarEnCajaPerpetua(
    movimiento: Caja,
    metodoPago: MetodoPago,
  ) {
    try {
      const adminId =
        metodoPago === MetodoPago.DIGITAL_JAVIER || metodoPago === MetodoPago.FERRO
          ? '4ab59277-5a15-4841-acce-851b0f6dbe11' // Javier
          : 'f709ac35-d270-4941-83de-d45031d6c33e'; // Tobias

      const sesionPerpetua = await this.sesionRepository.findOne({
        where: {
          admin: { id: adminId },
          fechaCierre: IsNull(),
        },
      });

      if (!sesionPerpetua) {
        return;
      }

      // Crear copia del movimiento para la caja perpetua
      const movimientoCopia = this.cajaRepository.create({
        tipo: movimiento.tipo,
        metodoPago: movimiento.metodoPago,
        monto: movimiento.monto,
        descripcion: `${movimiento.descripcion} - Copia automática`,
        fecha: movimiento.fecha,
        cuota: movimiento.cuota,
        mesCuota: movimiento.mesCuota,
        sesionCaja: sesionPerpetua,
        // No incluir alumnoComision ni vendedor para evitar duplicación
      });

      const movimientoGuardado = await this.cajaRepository.save(movimientoCopia);

      // Actualizar totales de la sesión perpetua usando el método estándar
      await this.actualizarConMovimiento(sesionPerpetua.id, movimientoGuardado);
    } catch (error) {
      console.error('Error duplicando en caja perpetua:', error);
    }
  }

  async generarExcelCaja(sesionId: string): Promise<Buffer> {
    const sesion = await this.sesionRepository.findOne({
      where: { id: sesionId },
      relations: ['vendedor'],
    });
    if (!sesion) {
      throw new NotFoundException('Caja no encontrada');
    }

    const movimientos = await this.cajaRepository.find({
      where: { sesionCaja: { id: sesionId } },
      relations: ['alumnoComision.alumno', 'subcategoria.categoria'],
      order: { fecha: 'ASC' },
    });

    if (!movimientos || movimientos.length === 0) {
      throw new BadRequestException(
        'No hay movimientos en esta sesión para generar el reporte.',
      );
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Movimientos de Caja');

    // Información del vendedor y fecha
    worksheet.addRow(['REPORTE DE CAJA']);
    worksheet.addRow(['Vendedor:', sesion.vendedor?.name || '-']);
    worksheet.addRow(['Fecha de descarga:', formatPostgresDate(new Date())]);
    worksheet.addRow([]);

    // Encabezados
    const headers = [
      'Fecha',
      'Alumno',
      'Tipo',
      'Método de Pago',
      'Descripción',
      'Monto',
      'Cuota',
      'Mes Cuota',
      'Categoría',
      'Subcategoría',
    ];
    worksheet.addRow(headers);

    // Datos
    movimientos.forEach((mov) => {
      worksheet.addRow([
        formatPostgresDate(mov.fecha),
        mov.alumnoComision?.alumno?.name || '-',
        mov.tipo,
        mov.metodoPago,
        mov.descripcion || '-',
        mov.monto,
        mov.cuota || '-',
        mov.mesCuota || '-',
        mov.subcategoria?.categoria?.nombre || '-',
        mov.subcategoria?.nombre || '-',
      ]);
    });

    // Estilo para encabezados
    const headerRow = worksheet.getRow(5);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    // Ajustar ancho de columnas
    worksheet.columns.forEach((column) => {
      column.width = 30;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  // Método para obtener movimientos de caja perpetua
  async obtenerMovimientosCajaPerpetua(adminId: string) {
    const sesionPerpetua = await this.sesionRepository.findOne({
      where: {
        admin: { id: adminId },
        fechaCierre: IsNull(),
      },
      relations: [
        'movimientos',
        'movimientos.alumnoComision.alumno',
        'movimientos.vendedor',
      ],
      select: {
        vendedor: {
          name: true,
        },
      },
    });

    if (!sesionPerpetua) {
      throw new NotFoundException('Caja perpetua no encontrada');
    }

    return sesionPerpetua;
  }

  async generarExcelCajaPerpetua(adminId: string): Promise<Buffer> {
    const sesion = await this.obtenerMovimientosCajaPerpetua(adminId);
    const adminName =
      adminId === '4ab59277-5a15-4841-acce-851b0f6dbe11' ? 'Javier' : 'Tobias';

    if (!sesion.movimientos || sesion.movimientos.length === 0) {
      throw new BadRequestException(
        `No hay movimientos en la caja perpetua de ${adminName}.`,
      );
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Caja Perpetua ${adminName}`);

    // Información del admin y fecha
    worksheet.addRow([`REPORTE CAJA PERPETUA - ${adminName.toUpperCase()}`]);
    worksheet.addRow(['Fecha de descarga:', formatPostgresDate(new Date())]);
    worksheet.addRow(['Total movimientos:', sesion.movimientos.length]);
    worksheet.addRow([]);

    // Encabezados
    const headers = [
      'Fecha',
      'Alumno',
      'Tipo',
      'Método de Pago',
      'Descripción',
      'Monto',
      'Cuota',
      'Mes Cuota',
      'Vendedor',
    ];
    worksheet.addRow(headers);

    // Datos
    sesion.movimientos.forEach((mov) => {
      worksheet.addRow([
        formatPostgresDate(mov.fecha),
        mov.alumnoComision?.alumno?.name || '-',
        mov.tipo,
        mov.metodoPago,
        mov.descripcion || '-',
        mov.monto,
        mov.cuota || '-',
        mov.mesCuota || '-',
        mov.vendedor?.name,
      ]);
    });

    // Estilo para encabezados
    const headerRow = worksheet.getRow(5);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    // Ajustar ancho de columnas
    worksheet.columns.forEach((column) => {
      column.width = 30;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async getSesionesForUser(
    userId: string,
    page?: number,
    limit?: number,
    filterDate?: string,
  ) {
    if (!page || !limit) return;

    let whereCondition: any = [
      { vendedor: { id: userId } },
      { admin: { id: userId } },
    ];

    if (filterDate) {
      const startDate = new Date(`${filterDate}T00:00:00`);
      const endDate = new Date(`${filterDate}T23:59:59.999`);
      whereCondition = [
        {
          vendedor: { id: userId },
          fechaApertura: Between(startDate, endDate),
        },
        { admin: { id: userId }, fechaApertura: Between(startDate, endDate) },
      ];
    }

    const [sesiones, total] = await this.sesionRepository.findAndCount({
      where: whereCondition,
      relations: ['vendedor', 'admin', 'movimientos'],
      order: { fechaApertura: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const data = sesiones.map((sesion) => ({
      id: sesion.id,
      fecha_apertura: formatPostgresDate(sesion.fechaApertura),
      fecha_cierre: formatPostgresDate(sesion.fechaCierre || ''),
      monto_apertura: formatNumber(sesion.montoApertura),
      monto_cierre: sesion.montoCierre
        ? formatNumber(sesion.montoCierre)
        : null,
      total_ingresos: formatNumber(sesion.totalIngresos),
      total_egresos: formatNumber(sesion.totalEgresos),
      total_efectivo: formatNumber(sesion.totalEfectivo),
      total_credito: formatNumber(sesion.totalCredito),
      total_digital_javier: formatNumber(sesion.totalDigitalJavier),
      total_digital_tobias: formatNumber(sesion.totalDigitalTobias),
      total_ferro: formatNumber(sesion.totalFerro),
      vendedor: sesion.vendedor,
      admin: sesion.admin,
      movimientos: sesion.movimientos?.map((mov) => ({
        id: mov.id,
        tipo: mov.tipo,
        metodo_pago: mov.metodoPago,
        monto: formatNumber(mov.monto),
        descripcion: mov.descripcion,
        fecha: formatPostgresDate(mov.fecha),
        cuota: mov.cuota,
        mes_cuota: mov.mesCuota,
        vendedor: mov.vendedor?.name || '',
        alumno: mov.alumnoComision?.alumno?.name || '',
        id_comprobante: mov.comprobante?.id,
      })),
    }));
    return {
      data,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async getTotalesPorVendedor() {
    // Buscar todas las sesiones ordenadas por fecha de apertura descendente
    const todasLasSesiones = await this.sesionRepository.find({
      relations: ['vendedor', 'admin'],
      order: { fechaApertura: 'DESC' },
    });

    // Agrupar por vendedor y quedarnos con la última sesión (más reciente)
    const sesionesPorUsuario = new Map<string, SesionCaja>();

    for (const sesion of todasLasSesiones) {
      const usuarioId = sesion.vendedor?.id || sesion.admin?.id;
      if (!usuarioId) continue;

      // Solo agregar si no existe o si esta sesión es más reciente
      if (!sesionesPorUsuario.has(usuarioId)) {
        sesionesPorUsuario.set(usuarioId, sesion);
      }
    }

    // Formatear resultado
    return Array.from(sesionesPorUsuario.values()).map((sesion) => {
      const isAdmin = !!sesion.admin;
      const usuario = isAdmin ? sesion.admin : sesion.vendedor;
      return {
        id: usuario.id,
        name: usuario.name,
        tipo: isAdmin ? 'admin' : 'vendedor',
        totalEfectivo: Number(sesion.totalEfectivo) || 0,
        totalCredito: Number(sesion.totalCredito) || 0,
        totalDigitalJavier: Number(sesion.totalDigitalJavier) || 0,
        totalDigitalTobias: Number(sesion.totalDigitalTobias) || 0,
        totalFerro: Number(sesion.totalFerro) || 0,
        totalIngreso: Number(sesion.totalIngresos) || 0,
        totalEgreso: Number(sesion.totalEgresos) || 0,
      };
    });
  }

  async createIngresoSimple(dto: IngresoSimpleDto) {
    
    const vendedor = await this.vendedorRepository.findOne({
      where: { id: dto.vendedorId },
    });
    if (!vendedor) {
      throw new HttpException('Vendedor no encontrado', HttpStatus.NOT_FOUND);
    }

    const sesionAbierta = await this.sesionRepository.findOne({
      where: {
        vendedor: { id: dto.vendedorId },
        fechaCierre: IsNull(),
      },
    });
    if (!sesionAbierta) {
      throw new HttpException(
        'No hay sesión de caja abierta',
        HttpStatus.BAD_REQUEST,
      );
    }

    const fechaLocal = dto.fecha
      ? dayjs(dto.fecha).tz('America/Argentina/Buenos_Aires').toDate()
      : dayjs().tz('America/Argentina/Buenos_Aires').toDate();

    const caja = this.cajaRepository.create({
      tipo: dto.tipo,
      metodoPago: dto.metodoPago,
      monto: dto.monto,
      descripcion: dto.descripcion,
      vendedor,
      fecha: fechaLocal,
      sesionCaja: sesionAbierta,
    });

    const movimientoGuardado = await this.cajaRepository.save(caja);
    await this.actualizarConMovimiento(sesionAbierta.id, movimientoGuardado);
    return movimientoGuardado;
  }

  async generarComprobantePDF(movimientoId: string): Promise<Buffer> {
    const movimiento = await this.cajaRepository.findOne({
      where: { id: movimientoId },
      relations: ['comprobante', 'alumnoComision.alumno'],
    });

    if (!movimiento) {
      throw new NotFoundException('Movimiento no encontrado');
    }

    if (!movimiento.comprobante) {
      throw new NotFoundException('El movimiento no tiene comprobante asociado');
    }

    return this.comprobanteGeneratorService.generarComprobantePDF(movimiento);
  }

  private async actualizarConMovimiento(
    idSesion: string,
    movimiento: Caja,
  ): Promise<SesionCaja> {
    const sesion = await this.sesionRepository.findOne({
      where: { id: idSesion },
    });

    if (!sesion) {
      throw new NotFoundException(`Sesión de caja ${idSesion} no encontrada`);
    }

    // Inicializar totales
    sesion.totalIngresos = Number(sesion.totalIngresos);
    sesion.totalEgresos = Number(sesion.totalEgresos);
    sesion.totalEfectivo = Number(sesion.totalEfectivo);
    sesion.totalCredito = Number(sesion.totalCredito);
    sesion.totalDigitalJavier = Number(sesion.totalDigitalJavier);
    sesion.totalDigitalTobias = Number(sesion.totalDigitalTobias);
    sesion.totalFerro = Number(sesion.totalFerro);

    const montoMovimiento = Number(movimiento.monto);

    // Actualizar totales según el tipo de movimiento
    if (
      movimiento.tipo === TipoMovimiento.INGRESO ||
      movimiento.tipo === TipoMovimiento.APORTE ||
      movimiento.tipo === TipoMovimiento.COBRO_VARIOS ||
      movimiento.tipo === TipoMovimiento.CERTIFICACION_EXAMEN
    ) {
      sesion.totalIngresos += montoMovimiento;
    } else if (movimiento.tipo === TipoMovimiento.EGRESO || movimiento.tipo === TipoMovimiento.TRANSFERENCIA) {
      sesion.totalEgresos += montoMovimiento;
    }

    // Actualizar totales por método de pago
    switch (movimiento.metodoPago) {
      case MetodoPago.EFECTIVO:
        if (movimiento.tipo === TipoMovimiento.INGRESO) {
          sesion.totalEfectivo += montoMovimiento;
        } else if (movimiento.tipo === TipoMovimiento.EGRESO || movimiento.tipo === TipoMovimiento.TRANSFERENCIA) {
          sesion.totalEfectivo -= montoMovimiento;
        }
        break;
      case MetodoPago.CREDITO:
        sesion.totalCredito += (movimiento.tipo === TipoMovimiento.INGRESO ? montoMovimiento : -montoMovimiento);
        break;
      case MetodoPago.DIGITAL_JAVIER:
        sesion.totalDigitalJavier += (movimiento.tipo === TipoMovimiento.INGRESO ? montoMovimiento : -montoMovimiento);
        break;
      case MetodoPago.DIGITAL_TOBIAS:
        sesion.totalDigitalTobias += (movimiento.tipo === TipoMovimiento.INGRESO ? montoMovimiento : -montoMovimiento);
        break;
      case MetodoPago.FERRO:
        sesion.totalFerro += (movimiento.tipo === TipoMovimiento.INGRESO ? montoMovimiento : -montoMovimiento);
        break;
    }

    return await this.sesionRepository.save(sesion);
  }

  private async recalcularTotalesSesion(sesionId: string): Promise<void> {
    const sesion = await this.sesionRepository.findOne({
      where: { id: sesionId },
    });

    if (!sesion) return;

    const movimientos = await this.cajaRepository.find({
      where: { sesionCaja: { id: sesionId } },
    });

    // Resetear totales
    sesion.totalIngresos = 0;
    sesion.totalEgresos = 0;
    sesion.totalEfectivo = Number(sesion.montoApertura);
    sesion.totalCredito = 0;
    sesion.totalDigitalJavier = 0;
    sesion.totalDigitalTobias = 0;
    sesion.totalFerro = 0;

    // Recalcular con todos los movimientos
    for (const mov of movimientos) {
      if (mov.tipo === TipoMovimiento.APERTURA || mov.tipo === TipoMovimiento.CIERRE) continue;
      
      const monto = Number(mov.monto);
      
      if (
        mov.tipo === TipoMovimiento.INGRESO ||
        mov.tipo === TipoMovimiento.APORTE ||
        mov.tipo === TipoMovimiento.COBRO_VARIOS ||
        mov.tipo === TipoMovimiento.CERTIFICACION_EXAMEN
      ) {
        sesion.totalIngresos += monto;
      } else if (mov.tipo === TipoMovimiento.EGRESO || mov.tipo === TipoMovimiento.TRANSFERENCIA) {
        sesion.totalEgresos += monto;
      }

      switch (mov.metodoPago) {
        case MetodoPago.EFECTIVO:
          if (
            mov.tipo === TipoMovimiento.INGRESO ||
            mov.tipo === TipoMovimiento.APORTE ||
            mov.tipo === TipoMovimiento.COBRO_VARIOS ||
            mov.tipo === TipoMovimiento.CERTIFICACION_EXAMEN
          ) {
            sesion.totalEfectivo += monto;
          } else if (mov.tipo === TipoMovimiento.EGRESO || mov.tipo === TipoMovimiento.TRANSFERENCIA) {
            sesion.totalEfectivo -= monto;
          }
          break;
        case MetodoPago.CREDITO:
          sesion.totalCredito += (
            mov.tipo === TipoMovimiento.INGRESO ||
            mov.tipo === TipoMovimiento.APORTE ||
            mov.tipo === TipoMovimiento.COBRO_VARIOS ||
            mov.tipo === TipoMovimiento.CERTIFICACION_EXAMEN
              ? monto
              : -monto
          );
          break;
        case MetodoPago.DIGITAL_JAVIER:
          sesion.totalDigitalJavier += (
            mov.tipo === TipoMovimiento.INGRESO ||
            mov.tipo === TipoMovimiento.APORTE ||
            mov.tipo === TipoMovimiento.COBRO_VARIOS ||
            mov.tipo === TipoMovimiento.CERTIFICACION_EXAMEN
              ? monto
              : -monto
          );
          break;
        case MetodoPago.DIGITAL_TOBIAS:
          sesion.totalDigitalTobias += (
            mov.tipo === TipoMovimiento.INGRESO ||
            mov.tipo === TipoMovimiento.APORTE ||
            mov.tipo === TipoMovimiento.COBRO_VARIOS ||
            mov.tipo === TipoMovimiento.CERTIFICACION_EXAMEN
              ? monto
              : -monto
          );
          break;
        case MetodoPago.FERRO:
          sesion.totalFerro += (
            mov.tipo === TipoMovimiento.INGRESO ||
            mov.tipo === TipoMovimiento.APORTE ||
            mov.tipo === TipoMovimiento.COBRO_VARIOS ||
            mov.tipo === TipoMovimiento.CERTIFICACION_EXAMEN
              ? monto
              : -monto
          );
          break;
      }
    }

    await this.sesionRepository.save(sesion);
  }
}
