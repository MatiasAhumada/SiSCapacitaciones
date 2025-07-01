import { NestFactory } from '@nestjs/core';
import { AppModule } from './Modules/app.module';
import cors from 'cors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
//prueba
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Cambia esto en producción
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });
  const config = new DocumentBuilder()
    .setTitle('API SiSCapacitaciones')
    .setDescription(
      `Sistema de gestión para la organización SiSCapacitaciones.
  
  Este sistema fue desarrollado para administrar de forma centralizada todas las sucursales actuales y futuras, permitiendo a los vendedores:
  - Registrar asistencias de alumnos en las comisiones.
  - Registrar nuevos alumnos.
  - Inscribir alumnos en comisiones.
  - Realizar cobros de cuotas anteriores y actuales.
  - Realizar transferencias entre cajas de vendedores.
  - Registrar egresos o gastos de la organizacion en su totalidad.
  - Gestionar la apertura y cierre de cajas.
  - Emitir comprobantes de pagos a los alumnos.
  - Obtener planillas de asistencia por comisiones.
  
  El administrador cuenta con funcionalidades avanzadas para:
  - Gestionar todas las sucursales en conjunto o por separado.
  - Controlar ventas e inscripciones realizadas por los vendedores.
  - Gestionar todas las comisiones, profesores, cursos y vendedores.
  
  Este sistema nace de la necesidad de unificar y automatizar estos procesos administrativos, con la posibilidad de escalar e integrar futuras funcionalidades, como el sistema ARCA para emisión de facturas electronicas.
  
  <b>Desarrollado por Matías Ahumada</b>
<a href="https://www.linkedin.com/in/matias-ahumada-dev/" target="_blank">LinkedIn</a>
<a href="https://github.com/MatiasAhumada" target="_blank">GitHub</a><br>
Teléfono: +54 9 381 352-8658`,
    )
    .setVersion('1.0')
    .build();
  // .addBearerAuth()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(4040);
}
bootstrap();
