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

  @Get('/resumen-total')
   getResumenTotal() {
    return this.cajaService.getResumenTotal();
  }

  @Get('/vendedor/:id')
  findByVendedor(@Param('id') id: string) {
    return this.cajaService.findByVendedor(id);
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

  @Get("/movimientos/:fecha")
  getMovimientosPorDia(@Param('fecha') fecha: string) {
    return this.cajaService.getMovimientosPorDia(fecha);
  }

  @Get('/resumen/:fecha')
   getResumenPorDia(@Param('fecha') fecha: string) {
    return this.cajaService.getResumenPorDia(fecha);
  }

 
}
