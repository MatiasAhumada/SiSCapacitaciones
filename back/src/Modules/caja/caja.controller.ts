import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { CajaService } from './caja.service';
import { CreateCajaDto } from './dto/create-caja.dto';
import { UpdateCajaDto } from './dto/update-caja.dto';
import { EgresoCajaDTO } from './dto/egreso-caja.dto';
import { CreateTransferenciaDto } from './dto/transferencia-caja.dto';
import { format } from 'date-fns';
@Controller('caja')
export class CajaController {
  constructor(private readonly cajaService: CajaService) {}

  @Post()
  create(@Body() createCajaDto: CreateCajaDto) {
    return this.cajaService.create(createCajaDto);
  }

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.cajaService.findAll(Number(page), Number(limit));
  }

  @Get('/digita-tobias')
  findDigitalTobias() {
    return this.cajaService.findByTobias();
  }
  @Get('/digita-javier')
  findDigitalJavier() {
    return this.cajaService.findByJavier();
  }

  @Get('/resumen-total')
  getResumenTotal() {
    return this.cajaService.getResumenTotal();
  }

  @Get('/vendedor/:id')
  findByVendedor(
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.cajaService.findByVendedor(id, Number(page), Number(limit));
  }

  @Get('movDiario')
  async getMovimientosDiarios() {
    const hoy = format(new Date(), 'yyyy-MM-dd');
    return this.cajaService.getMovimientosPorDia(hoy);
  }

  @Get('/movimientos/:fecha')
  getMovimientosPorDia(@Param('fecha') fecha: string) {
    return this.cajaService.getMovimientosPorDia(fecha);
  }

  @Get('con-subcategorias')
  getCategoriasConSubcategorias() {
    return this.cajaService.obtenerCategoriasConSubcategorias();
  }

  @Get('/resumen/:fecha')
  getResumenPorDia(@Param('fecha') fecha: string) {
    return this.cajaService.getResumenPorDia(fecha);
  }
  @Post('/aperturaCaja/:vendedorId')
  async aperturaCaja(@Param('vendedorId') vendedorId: string) {
    return this.cajaService.aperturaCaja(vendedorId);
  }
  @Get('/sesionDiariaVendedor/:vendedorId')
  findBySesionesVendedor(@Param('vendedorId') id: string) {
    return this.cajaService.obtenerSesionPorFecha(id);
  }
  @Patch('cerrarCaja/:vendedorId')
  async cerrarSesion(@Param('vendedorId') vendedorId: string) {
    return this.cajaService.cerrarSesionCaja(vendedorId);
  }

  @Post('transferencia')
  createTransferencia(@Body() data: CreateTransferenciaDto) {
    return this.cajaService.transferirCaja(data);
  }

  @Post('egreso')
  createEgreso(@Body() data: EgresoCajaDTO) {
    return this.cajaService.createEgresoSimple(data);
  }
  @Post('egreso/profesor')
  createEgresoProfesor(@Body() data: EgresoCajaDTO) {
    return this.cajaService.createEgresoProfesor(data);
  }
  @Post('egreso/vendedor')
  createEgresoVendedor(@Body() data: EgresoCajaDTO) {
    return this.cajaService.createEgresoVendedor(data);
  }

  @Post('/crear-categoria')
  createCategoria(@Body('nombre') nombre: string) {
    return this.cajaService.createCategoria(nombre);
  }

  @Post('/crear-subcategoria/:categoriaId')
  createSubcategoria(
    @Param('categoriaId') categoriaId: string,
    @Body('nombre') nombre: string,
  ) {
    return this.cajaService.createSubcategoria(nombre, categoriaId);
  }

  @Post('/crear-con-subcategorias')
  createCategoriaConSubcategorias(
    @Body() body: { nombre: string; subcategorias: string[] },
  ) {
    return this.cajaService.createCategoriaConSubcategorias(
      body.nombre,
      body.subcategorias,
    );
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cajaService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCajaDto: UpdateCajaDto) {
    return this.cajaService.update(id, updateCajaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cajaService.remove(id);
  }
}
