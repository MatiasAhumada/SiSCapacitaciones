import { Module } from '@nestjs/common';
import { SucursalService } from './sucursal.service';
import { SucursalController } from './sucursal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sucursal } from './entities/sucursal.entity';
import { Admins } from '../admin/entities/admin.entity';
import { Servicio } from '../servicio/entities/servicio.entity';
import { Alumno } from '../alumno/entities/alumno.entity';
import { Profesor } from '../profesor/entities/profesor.entity';
import { Comision } from '../comision/entities/comision.entity';
import { Vendedor } from '../vendedor/entities/vendedor.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Sucursal,
      Admins,
      Servicio,
      Alumno,
      Profesor,
      Comision,
      Vendedor,
      Inscripcion,
    ]),
  ],
  controllers: [SucursalController],
  providers: [SucursalService],
})
export class SucursalModule {}
