import { Module } from '@nestjs/common';
import { CajaService } from './caja.service';
import { CajaController } from './caja.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Caja } from './entities/caja.entity';
import { Vendedor } from '../vendedor/entities/vendedor.entity';
import { Alumno } from '../alumno/entities/alumno.entity';
import { AlumnoComision } from '../comision/entities/alumnocomision.entity';
import { Comprobante } from '../comprobante/entities/comprobante.entity';
import { Categoria } from './entities/categoria.entity';
import { Subcategoria } from './entities/subcategoria.entity';
import { Profesor } from '../profesor/entities/profesor.entity';
import { SesionCaja } from './entities/sesion-caja.entity';
import { ComprobanteGeneratorService } from './comprobante-generator.service';
import { MailModule } from '../mail/mail.module';
import { ExcelModule } from '../excel/excel.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Caja,
      Vendedor,
      Alumno,
      AlumnoComision,
      Comprobante,
      Categoria,
      Subcategoria,
      Profesor,
      SesionCaja,
    ]),
    MailModule,
    ExcelModule,
  ],
  controllers: [CajaController],
  providers: [CajaService, ComprobanteGeneratorService],
  exports: [CajaService],
})
export class CajaModule {}
