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

  @Get()
  findAll() {
    return this.alumnoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alumnoService.findOne(id);
  }
  @Post('login')
  loginAlumno(@Body() body: { dni: number; password: string }) {
    return this.alumnoService.loginAlumno(body.dni, body.password);
  }

  // @Put(':id')
  // updateImgUrl(@Param('id') id: string, @Body() updateAlumnoDto: UpdateAlumnoDto) {
  //   return this.alumnoService.update(id, updateAlumnoDto);
  // }
  @Put(':id')
  update(@Param('id') id: string, @Body() update: UpdateAlumnoDto) {
    return this.alumnoService.actualizarImgUrl(id, update);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alumnoService.remove(id);
  }
}
