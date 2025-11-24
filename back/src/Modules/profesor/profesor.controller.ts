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
import { ProfesorService } from './profesor.service';
import { CreateProfesorDto } from './dto/create-profesor.dto';
import { UpdateProfesorDto } from './dto/update-profesor.dto';

@Controller('profesor')
export class ProfesorController {
  constructor(private readonly profesorService: ProfesorService) {}

  @Post()
  create(@Body() createProfesorDto: CreateProfesorDto) {
    return this.profesorService.create(createProfesorDto);
  }

  @Get()
  findAll() {
    return this.profesorService.findAll();
  }
  @Get('sucursal/:id')
  getProfesoresBySucursal(
    @Param('id') sucursalId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.profesorService.getProfesoresBySucursal(
      sucursalId,
      +page,
      +limit,
    );
  }

  @Put('edit/:id')
  update(
    @Param('id') id: string,
    @Body() updateProfesorDto: UpdateProfesorDto,
  ) {
    return this.profesorService.update(id, updateProfesorDto);
  }

  @Delete('deleted/:id')
  remove(@Param('id') id: string) {
    return this.profesorService.remove(id);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profesorService.findOne(id);
  }
}
