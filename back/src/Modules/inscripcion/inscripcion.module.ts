import { Module } from '@nestjs/common';
import { InscripcionService } from './inscripcion.service';
import { InscripcionController } from './inscripcion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inscripcion } from './entities/inscripcion.entity';
import { Vendedor } from '../vendedor/entities/vendedor.entity';
import { Alumno } from '../alumno/entities/alumno.entity';
import { Comision } from '../comision/entities/comision.entity';
import { Sucursal } from '../sucursal/entities/sucursal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Inscripcion,
      Vendedor,
      Alumno,
      Comision,
      Sucursal,
    ]),
  ],
  controllers: [InscripcionController],
  providers: [InscripcionService],
})
export class InscripcionModule {}
