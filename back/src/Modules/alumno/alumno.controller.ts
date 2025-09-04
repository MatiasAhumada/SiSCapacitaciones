import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { AlumnoService } from './alumno.service';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';

@Controller('alumno')
export class AlumnoController {
  constructor(private readonly alumnoService: AlumnoService) {}

  @Post()
  create(@Body() createAlumnoDto: CreateAlumnoDto) {
    return this.alumnoService.create(createAlumnoDto);
  }
  @Post('simple')
  createSimpleAlumno(@Body() alumnoSimple: { dni: string; name: string }) {
    return this.alumnoService.createSimpleAlumno(
      alumnoSimple.dni,
      alumnoSimple.name,
    );
  }

  @Get()
  findAll() {
    return this.alumnoService.findAll();
  }
  @Get('sucursal/:id')
  getAlumnosBySucursal(
    @Param('id') sucursalId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.alumnoService.getAlumnosBySucursal(sucursalId, {
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Put('/img/:id')
  update(@Param('id') id: string, @Body() update: UpdateAlumnoDto) {
    return this.alumnoService.actualizarImgUrl(id, update);
  }
  // @Put(':id/estado/:nuevoEstado')
  // async cambiarEstado(
  //   @Param('id') id: string,
  //   @Param('nuevoEstado') nuevoEstado: string,
  // ) {
  //   const estadoBooleano = nuevoEstado === 'true';
  //   return this.alumnoService.cambiarEstado(id, estadoBooleano);
  // }
  @Get('buscar')
  async buscarPorDni(@Query('dni') dni: string) {
    return this.alumnoService.findByDniBasic(dni);
  }

  @Get('search/:dni')
  findOne(@Param('dni') dni: string) {
    return this.alumnoService.findOne(dni);
  }

  @Put('edit/:id')
  updateImgUrl(
    @Param('id') id: string,
    @Body() updateAlumnoDto: UpdateAlumnoDto,
  ) {
    return this.alumnoService.update(id, updateAlumnoDto);
  }
  @Delete('remove/:id')
  remove(@Param('id') id: string) {
    return this.alumnoService.remove(id);
  }
}
