import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ComisionService } from './comision.service';
import { CreateComisionDto } from './dto/create-comision.dto';
import { UpdateComisionDto } from './dto/update-comision.dto';

@Controller('comision')
export class ComisionController {
  constructor(private readonly comisionService: ComisionService) {}

  @Post()
  create(@Body() createComisionDto: CreateComisionDto) {
    return this.comisionService.create(createComisionDto);
  }

  @Get()
  findAll() {
    return this.comisionService.findAll();
  }

  @Get('/suc/:id')
  findOneBySucursal(@Param('id') id: string) {
    return this.comisionService.findBySucursal(id);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comisionService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateComisionDto: UpdateComisionDto) {
    return this.comisionService.update(id, updateComisionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comisionService.remove(id);
  }
  // @Put(':idComision/alumnos/:idAlumno/estado/:estado')
  // async cambiarEstadoAlumno(
  //   @Param('idComision') idComision: string,
  //   @Param('idAlumno') idAlumno: string,
  //   @Param('estado') estado: string,
  // ) {
  //   const estadoBool = estado === 'true';  // Convertir el parámetro de estado a booleano
  //   return this.comisionService.cambiarEstadoAlumno(idComision, idAlumno, estadoBool);
  // }
}
