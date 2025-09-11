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
import { ComisionService } from './comision.service';
import { CreateComisionDto } from './dto/create-comision.dto';
import { ChangeStateDto } from './dto/changeState.dto';
import { UpdateComisionDto } from './dto/update-comision.dto';
import { CreateAsistenciaDto } from './dto/create-assistencia.dto';

@Controller('comision')
export class ComisionController {
  constructor(private readonly comisionService: ComisionService) {}

  @Post()
  create(@Body() createComisionDto: CreateComisionDto) {
    return this.comisionService.create(createComisionDto);
  }

  @Post('asistencia')
  registrarAsistencia(
    @Body()
    data: CreateAsistenciaDto,
  ) {
    return this.comisionService.registrarAsistencia(data);
  }
  @Get('asistencia/:comisionId')
  obtenerAsistenciasPorComision(@Param('comisionId') comisionId: string) {
    return this.comisionService.obtenerAsistenciasPorComision(comisionId);
  }

  @Get()
  findAll() {
    return this.comisionService.findAll();
  }
  @Get('/aluCom/:idAluCom')
  findAluCom(@Param('idAluCom') id: string) {
    return this.comisionService.findOneAluCom(id);
  }
  @Get('sucursal/:id')
  getComisionesBySucursal(@Param('id') sucursalId: string) {
    return this.comisionService.getComisionesBySucursal(sucursalId);
  }

  @Get('/suc/:id')
  findOneBySucursal(@Param('id') id: string) {
    return this.comisionService.findBySucursal(id);
  }
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('dni') dni?: string,
  ) {
    return this.comisionService.findOne(id, Number(page), Number(limit), dni);
  }
  @Put('/estado')
  cambiarEstado(@Body() change: ChangeStateDto) {
    console.log(change);
    return this.comisionService.cambiarEstadoAlumnoComision(change);
  }
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateComisionDto: UpdateComisionDto,
  ) {
    return this.comisionService.update(id, updateComisionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comisionService.remove(id);
  }
}
