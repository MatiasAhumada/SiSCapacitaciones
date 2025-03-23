import { Module } from '@nestjs/common';
import { AlumnoService } from './alumno.service';
import { AlumnoController } from './alumno.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sucursal } from '../sucursal/entities/sucursal.entity';
import { Alumno } from './entities/alumno.entity';
import { Caja } from '../caja/entities/caja.entity';
import { AlumnoComision } from '../comision/entities/alumnocomision.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Sucursal,Alumno,Caja,AlumnoComision])],

  controllers: [AlumnoController],
  providers: [AlumnoService],
})
export class AlumnoModule {}
