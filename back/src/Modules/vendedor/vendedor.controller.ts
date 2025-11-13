import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { VendedorService } from './vendedor.service';
import { CreateVendedorDto } from './dto/create-vendedor.dto';
import { UpdateVendedorDto } from './dto/update-vendedor.dto';

@Controller('vendedor')
export class VendedorController {
  constructor(private readonly vendedorService: VendedorService) {}

  @Post()
  create(@Body() createVendedorDto: CreateVendedorDto) {
    return this.vendedorService.create(createVendedorDto);
  }

  @Get()
  findAll() {
    return this.vendedorService.findAll();
  }

  @Get('sucursal/:id')
  getVendedoresBySucursal(
    @Param('id') sucursalId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.vendedorService.getVendedoresBySucursal(sucursalId, +page, +limit);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
  ) {
    return this.vendedorService.findOne(id, fechaDesde, fechaHasta);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVendedorDto: UpdateVendedorDto,
  ) {
    return this.vendedorService.update(id, updateVendedorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendedorService.remove(id);
  }
}
