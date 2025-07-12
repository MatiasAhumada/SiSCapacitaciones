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
import { Between, DataSource, IsNull, Like, Not, Repository } from 'typeorm';
import { Vendedor } from '../vendedor/entities/vendedor.entity';
import { format, startOfDay, endOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Alumno } from '../alumno/entities/alumno.entity';
import { Comision } from '../comision/entities/comision.entity';
import { AlumnoComision } from '../comision/entities/alumnocomision.entity';
import { Comprobante } from '../comprobante/entities/comprobante.entity';
import { Categoria } from './entities/categoria.entity';
import { Subcategoria } from './entities/subcategoria.entity';
import { EgresoCajaDTO } from './dto/egreso-caja.dto';
import { Profesor } from '../profesor/entities/profesor.entity';
import { CreateTransferenciaDto } from './dto/transferencia-caja.dto';
import { SesionCaja } from './entities/sesion-caja.entity';

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
  ) {}

  async create(createCajaDto: CreateCajaDto) {
    const { comprobante, tipo, vendedorId, alumnoComisionId, ...restoCaja } =
      createCajaDto;
    // console.log(createCajaDto)
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
      newCaja.vendedor = vendedor;
      newCaja.comprobante = newComprobante;
      newCaja.alumnoComision = alumnoComision;
      newCaja.sesionCaja = sesionCaja;

      await this.cajaRepository.save(newCaja);

      return newCaja;
    }
  }

  async findAll() {
    return this.cajaRepository.find({
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

  async findOne(id: string) {
    return `This action returns a #${id} caja`;
  }

  async update(id: string, updateCajaDto: UpdateCajaDto) {
    const { alumnoComisionId, vendedorId, ...updateData } = updateCajaDto;
    console.log('Fecha recibida:', updateCajaDto.fecha);

    const caja = await this.cajaRepository.findOne({
      where: { id },
      relations: ['alumnoComision', 'vendedor'],
    });
    if (!caja) {
      throw new NotFoundException(`Caja con ID ${id} no encontrada`);
    }
    if (alumnoComisionId) {
      const alumnoComision = await this.alumnoComisionRepository.findOne({
        where: { alumno: { id: alumnoComisionId } },
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
          `Alumno con ID ${vendedorId} no encontrado`,
        );
      caja.vendedor = vendedor;
    }

    Object.assign(caja, updateData);

    return this.cajaRepository.save(caja);
  }

  async remove(id: string) {
    return this.cajaRepository.delete(id);
  }

  async findByVendedor(vendedorId: string) {
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
    });

    return await this.cajaRepository.save(caja);
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
    });

    return await this.cajaRepository.save(caja);
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
    });

    if (!subcategoria)
      throw new HttpException(
        'Subcategoría no encontrada',
        HttpStatus.BAD_REQUEST,
      );

    const caja = this.cajaRepository.create({
      tipo: TipoMovimiento.EGRESO,
      metodoPago: dto.metodoPago,
      monto: dto.monto,
      descripcion: dto.descripcion || `Egreso por ${subcategoria.nombre}`,
      vendedor,
      subcategoria,
      fecha: dto.fecha ? new Date(dto.fecha) : new Date(),
    });

    return await this.cajaRepository.save(caja);
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

    const egreso = this.cajaRepository.create({
      tipo: TipoMovimiento.EGRESO,
      metodoPago,
      monto,
      descripcion: descripcion || `Transferencia a ${vendedorDestino.name}`,
      fecha: fecha ? new Date(fecha) : new Date(),
      vendedor: vendedorOrigen,
    });

    const ingreso = this.cajaRepository.create({
      tipo: TipoMovimiento.INGRESO,
      metodoPago,
      monto,
      descripcion: descripcion || `Transferencia desde ${vendedorOrigen.name}`,
      fecha: fecha ? new Date(fecha) : new Date(),
      vendedor: vendedorDestino,
    });

    await this.cajaRepository.save([egreso, ingreso]);

    return {
      message: 'Transferencia realizada con éxito',
      egreso,
      ingreso,
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

    const sesionAbierta = await this.sesionRepository.findOne({
      where: {
        vendedor: { id: vendedorId },
        fechaCierre: IsNull(),
      },
    });

    let montoApertura = 0;
    const ultimaSesion = await this.sesionRepository.findOne({
      where: {
        vendedor: { id: vendedorId },
        fechaCierre: Not(IsNull()),
      },
      order: {
        fechaCierre: 'DESC',
      },
    });
    if (
      ultimaSesion &&
      ultimaSesion.totalIngresos > ultimaSesion.totalEgresos
    ) {
      montoApertura = ultimaSesion.totalIngresos - ultimaSesion.totalEgresos;
    }

    if (sesionAbierta) {
      throw new BadRequestException(
        'Ya hay una sesión de caja abierta sin cerrar.',
      );
    }

    const nuevaSesion = this.sesionRepository.create({
      fechaApertura: hoy,
      montoApertura: montoApertura,
      totalIngresos: 0,
      totalEgresos: 0,
      vendedor,
    });
    await this.sesionRepository.save(nuevaSesion);

    const apertura = this.cajaRepository.create({
      fecha: new Date(),
      tipo: TipoMovimiento.APERTURA,
      metodoPago: MetodoPago.EFECTIVO,
      descripcion: 'Apertura de caja',
      monto: montoApertura,
      vendedor,
      sesionCaja: nuevaSesion,
    });

    return this.cajaRepository.save(apertura);
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

    // Calcular totales (si no los estás actualizando en tiempo real)
    const ingresos = sesionAbierta.movimientos
      .filter((mov) => mov.tipo === TipoMovimiento.INGRESO || mov.tipo === TipoMovimiento.APERTURA)
      .reduce((sum, mov) => sum + Number(mov.monto), 0);

    const egresos = sesionAbierta.movimientos
      .filter((mov) => mov.tipo === TipoMovimiento.EGRESO)
      .reduce((sum, mov) => sum + Number(mov.monto), 0);

    // Actualizar totales y fecha de cierre
    sesionAbierta.totalIngresos = ingresos;
    sesionAbierta.totalEgresos = egresos;
    sesionAbierta.montoCierre = ingresos - egresos;
    sesionAbierta.fechaCierre = new Date();
    await this.sesionRepository.save(sesionAbierta);
    const cierre = this.cajaRepository.create({
      fecha: new Date(),
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
  async obtenerSesionPorFecha(vendedorId: string) {
    if (!vendedorId) {
      throw new NotFoundException('ID Vendedor no enviado');
    }
    const vendedor = await this.vendedorRepository.findOne({
      where: { id: vendedorId },
    });

    if (!vendedor) {
      throw new NotFoundException('Vendedor no encontrado');
    }

    const fecha = new Date();
    const inicioDelDia = new Date(fecha.setHours(0, 0, 0, 0));
    const finDelDia = new Date(fecha.setHours(23, 59, 59, 999));

    const sesion = await this.sesionRepository.findOne({
      where: {
        vendedor: { id: vendedorId },
        fechaApertura: Between(inicioDelDia, finDelDia),
      },
      order: { fechaApertura: 'DESC' },
      // relations: ['vendedor'],
    });

    if (!sesion) {
      throw new NotFoundException(
        'No se encontró sesión para la fecha indicada.',
      );
    }

    const movimientos = await this.cajaRepository.find({
      where: {
        sesionCaja: { id: sesion.id },
        fecha: Between(inicioDelDia, finDelDia),
      },
      relations: ['alumnoComision.alumno'],
      select: {
        alumnoComision: {
          id: true,
          alumno: {
            id: true,
            name: true,
          },
        },
      },
      order: { fecha: 'ASC' },
    });

    if (!movimientos.length) {
      throw new NotFoundException(
        'No hay movimientos para la sesión en esa fecha.',
      );
    }

    // Adjuntar los movimientos a la sesión
    sesion['movimientos'] = movimientos;

    return { ...sesion, movimientos };
  }
}
