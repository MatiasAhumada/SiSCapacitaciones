import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { SucursalService } from './sucursal.service';
import { CreateSucursalDto } from './dto/create-sucursal.dto';

@Controller('suc')
export class SucursalController {
  constructor(private readonly sucursalService: SucursalService) {}

  @Get('/:id')
  findOneSuc(@Param('id') id: string) {
    return this.sucursalService.getByIdSucursal(id);
  }
  @Get()
  findAllSuc() {
    return this.sucursalService.getSucursales();
  }


  @Post()
  createSuc(@Body() createSucursalDto: CreateSucursalDto) {
    return this.sucursalService.createSuc(createSucursalDto);
  }

  @Delete(':id')
  removeSuc(@Param('id') id: string) {
    return this.sucursalService.removeSuc(id);
  }
}
