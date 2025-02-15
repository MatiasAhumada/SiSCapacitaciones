import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlumnoModule } from './alumno/alumno.module';
import { AdminModule } from './admin/admin.module';
import { AbonoModule } from './abono/abono.module';
import { CursoModule } from './curso/curso.module';
import { ProfesorModule } from './profesor/profesor.module';
import { ServicioModule } from './servicio/servicio.module';
import { VendedorModule } from './vendedor/vendedor.module';
import { SucursalModule } from './sucursal/sucursal.module';
import { FacturaModule } from './factura/factura.module';
import { ComisionModule } from './comision/comision.module';
@Module({
  imports: [
    AlumnoModule,
    AdminModule,
    AbonoModule,
    CursoModule,
    ProfesorModule,
    ServicioModule,
    VendedorModule,
    SucursalModule,
    FacturaModule,
    ComisionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
