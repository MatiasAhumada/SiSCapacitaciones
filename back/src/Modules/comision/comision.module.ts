import { Module } from '@nestjs/common';
import { ComisionService } from './comision.service';
import { ComisionController } from './comision.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comision } from './entities/comision.entity';
import { Sucursal } from '../sucursal/entities/sucursal.entity';
import { Curso } from '../curso/entities/curso.entity';
import { Profesor } from '../profesor/entities/profesor.entity';
import { Asistencia } from './entities/asistencia.entity';
import { AlumnoComision } from './entities/alumnocomision.entity';
import { Caja } from '../caja/entities/caja.entity';
import { AsistenciaProfesor } from './entities/asistencia-profesor.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Comision,
      Sucursal,
      Curso,
      Profesor,
      Asistencia,
      AlumnoComision,
      Asistencia,
      Caja,
      AsistenciaProfesor,
      Inscripcion
    ]),
  ],
  controllers: [ComisionController],
  providers: [ComisionService],
})
export class ComisionModule {}
