import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlumnoModule } from './Alumno/alumno.module';
import { AdminModule } from './Admin/admin.module';
import { AbonoModule } from './abono/abono.module';
import { CursoModule } from './curso/curso.module';
import { ProfesorModule } from './profesor/profesor.module';
import { ServicioModule } from './servicio/servicio.module';
import { VendedorModule } from './vendedor/vendedor.module';

@Module({
  imports: [AlumnoModule, AdminModule, AbonoModule, CursoModule, ProfesorModule, ServicioModule, VendedorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
