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
  Res,
} from '@nestjs/common';
import { Response } from 'express';
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
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('vendedorId') vendedorId?: string,
    @Query('order') order: 'ASC' | 'DESC' = 'DESC',
  ) {
    return this.cajaService.findAll(
      Number(page),
      Number(limit),
      vendedorId,
      order.toUpperCase() as 'ASC' | 'DESC',
    );
  }

  @Get('/digita-tobias')
  findDigitalTobias() {
    return this.cajaService.findByTobias();
  }
  @Get('/digita-javier')
  findDigitalJavier() {
    return this.cajaService.findByJavier();
  }

  @Get('/caja-perpetua-javier')
  getCajaPerpetuaJavier() {
    return this.cajaService.obtenerMovimientosCajaPerpetua(
      '4ab59277-5a15-4841-acce-851b0f6dbe11',
    );
  }

  @Get('/caja-perpetua-tobias')
  getCajaPerpetuaTobias() {
    return this.cajaService.obtenerMovimientosCajaPerpetua(
      'f709ac35-d270-4941-83de-d45031d6c33e',
    );
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
    @Query('useCustom') useCustom?: boolean,
    @Query('filterDate') filterDate?: string,
  ) {
    return this.cajaService.findByVendedor(
      id,
      Number(page),
      Number(limit),
      useCustom,
      filterDate,
    );
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

  @Get('totales-vendedores')
  async getTotalesVendedores() {
    return this.cajaService.getTotalesPorVendedor();
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

  @Get('/export-excel/:vendedorId')
  async exportarCajaExcel(
    @Param('vendedorId') vendedorId: string,
    @Res() res: Response,
  ) {
    const buffer = await this.cajaService.generarExcelCaja(vendedorId);

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="caja-${new Date().toISOString().split('T')[0]}.xlsx"`,
    });

    res.send(buffer);
  }

  @Get('/export-excel-perpetua/:adminId')
  async exportarCajaPerpetuaExcel(
    @Param('adminId') adminId: string,
    @Res() res: Response,
  ) {
    const sesion =
      await this.cajaService.obtenerMovimientosCajaPerpetua(adminId);
    const adminName =
      adminId === '4ab59277-5a15-4841-acce-851b0f6dbe11' ? 'Javier' : 'Tobias';

    // Usar el mismo método de Excel pero adaptado para caja perpetua
    const buffer = await this.cajaService.generarExcelCajaPerpetua(adminId);

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="caja-perpetua-${adminName}-${new Date().toISOString().split('T')[0]}.xlsx"`,
    });

    res.send(buffer);
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

  @Post('/inicializar-retiro')
  inicializarCategoriaRetiro() {
    return this.cajaService.inicializarCategoriaRetiro();
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
