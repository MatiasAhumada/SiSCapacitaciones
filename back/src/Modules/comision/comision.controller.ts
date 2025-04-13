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
import { ComisionService } from './comision.service';
import { CreateComisionDto } from './dto/create-comision.dto';
import { UpdateComisionDto } from './dto/update-comision.dto';
import { CreateAsistenciaDto } from './dto/create-assistencia.dto';
import { ChangeStateDto } from './dto/changeState.dto';

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
  @Get("/aluCom/:idAluCom")
  findAluCom(@Param('idAluCom') id: string) {
    return this.comisionService.findOneAluCom(id);
  }

  @Get('/suc/:id')
  findOneBySucursal(@Param('id') id: string) {
    return this.comisionService.findBySucursal(id);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comisionService.findOne(id);
  }
  @Put('/estado')
  cambiarEstado(@Body() change: ChangeStateDto) {
    console.log(change)
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

  @Post('/asistencia')
  registrarAsistencia(@Body() dto: CreateAsistenciaDto[]) {
    return this.comisionService.registrarAsistencia(dto);
  }

 
}
