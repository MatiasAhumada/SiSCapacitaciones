import { Module } from '@nestjs/common';
import { AlumnoService } from './alumno.service';
import { AlumnoController } from './alumno.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sucursal } from '../sucursal/entities/sucursal.entity';
import { Alumno } from './entities/alumno.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Sucursal,Alumno])],

  controllers: [AlumnoController],
  providers: [AlumnoService],
})
export class AlumnoModule {}
