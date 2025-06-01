import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CajaService } from './caja.service';
import { CreateCajaDto } from './dto/create-caja.dto';
import { UpdateCajaDto } from './dto/update-caja.dto';
import { EgresoCajaDTO } from './dto/egreso-caja.dto';

@Controller('caja')
export class CajaController {
  constructor(private readonly cajaService: CajaService) {}

  @Post()
  create(@Body() createCajaDto: CreateCajaDto) {
    return this.cajaService.create(createCajaDto);
  }

  @Get()
  findAll() {
    return this.cajaService.findAll();
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
  findByVendedor(@Param('id') id: string) {
    return this.cajaService.findByVendedor(id);
  }

  @Get('/movimientos/:fecha')
  getMovimientosPorDia(@Param('fecha') fecha: string) {
    return this.cajaService.getMovimientosPorDia(fecha);
  }

  @Get('/con-subcategorias')
  getCategoriasConSubcategorias() {
    return this.cajaService.obtenerCategoriasConSubcategorias();
  }

  @Get('/resumen/:fecha')
  getResumenPorDia(@Param('fecha') fecha: string) {
    return this.cajaService.getResumenPorDia(fecha);
  }

  @Post('egreso/profesor')
  createEgresoProfesor(@Body() data: EgresoCajaDTO) {
    return this.cajaService.createEgresoProfesor(data);
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
