import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCajaDto } from './dto/create-caja.dto';
import { UpdateCajaDto } from './dto/update-caja.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Caja, MetodoPago, TipoMovimiento } from './entities/caja.entity';
import { Between, Like, Repository } from 'typeorm';
import { Vendedor } from '../vendedor/entities/vendedor.entity';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Alumno } from '../alumno/entities/alumno.entity';
import { Comision } from '../comision/entities/comision.entity';
import { AlumnoComision } from '../comision/entities/alumnocomision.entity';
import { Comprobante } from '../comprobante/entities/comprobante.entity';
import { Categoria } from './entities/categoria.entity';
import { Subcategoria } from './entities/subcategoria.entity';
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

    if (tipo === TipoMovimiento.INGRESO) {
      const alumnoComision = await this.alumnoComisionRepository.findOne({
        where: { alumno: { id: alumnoComisionId } },
        relations: ['alumno'],
      });
      console.log(alumnoComision);
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

      await this.cajaRepository.save(newCaja);
      const alumnoConPagosActualizados =
        await this.alumnoComisionRepository.findOne({
          where: { id: alumnoComision.id },
          relations: ['pagos'],
        });
      console.log(alumnoConPagosActualizados);
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
    console.log('en devolucion de categorias');
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
}
