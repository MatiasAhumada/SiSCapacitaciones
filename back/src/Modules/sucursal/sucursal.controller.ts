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
import { SucursalService } from './sucursal.service';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';

@Controller('suc')
export class SucursalController {
  constructor(private readonly sucursalService: SucursalService) {}

  @Get()
  findAllSuc() {
    return this.sucursalService.getSucursales();
  }

  @Get(':id')
  findOneSuc(@Param('id') id: string) {
    return this.sucursalService.getByIdSucursal(id);
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
