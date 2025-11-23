import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlumnoModule } from './alumno/alumno.module';
import { AdminModule } from './admin/admin.module';
import { CursoModule } from './curso/curso.module';
import { ProfesorModule } from './profesor/profesor.module';
import { ServicioModule } from './servicio/servicio.module';
import { VendedorModule } from './vendedor/vendedor.module';
import { SucursalModule } from './sucursal/sucursal.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComisionModule } from './comision/comision.module';
import { InscripcionModule } from './inscripcion/inscripcion.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeOrmConfig from '../config/configOrm';
import { LoggerMiddleware } from 'src/Middleware/Peticiones.middleware';
import { AuthModule } from './auth/auth.module';
import { CajaModule } from './caja/caja.module';
import { CertificadoModule } from './certificado/certificado.module';
import { ComprobanteModule } from './comprobante/comprobante.module';
import { SeederModule } from '@modules/Seeds/seeders.module';
import { MetricsModule } from './metrics/metrics.module';
import { MailModule } from './mail/mail.module';
import { PdfModule } from './pdf/pdf.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('typeorm'),
      }),
    }),

    AlumnoModule,
    AdminModule,
    CursoModule,
    ProfesorModule,
    ServicioModule,
    VendedorModule,
    SucursalModule,
    ComisionModule,
    InscripcionModule,
    AuthModule,
    //SeederModule,
    CajaModule,
    CertificadoModule,
    ComprobanteModule,
    MetricsModule,
    MailModule,
    PdfModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
