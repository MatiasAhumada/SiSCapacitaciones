import { NestFactory } from '@nestjs/core';
import { AppModule } from './Modules/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  const config = new DocumentBuilder()
    .setTitle('API SiSCapacitaciones')
    .setDescription(
      `Sistema de gestión para **SiSCapacitaciones**.

Este sistema fue desarrollado para administrar de forma centralizada las operaciones de capacitación, brindando herramientas para:

- Gestionar cursos, comisiones y horarios.
- Administrar inscripciones de alumnos.
- Controlar pagos, cuotas y métodos de pago.
- Gestionar vendedores y sus comisiones.
- Administrar profesores y asignaciones.
- Control de caja y movimientos financieros.
- Emitir certificados y reportes.
- Visualizar métricas y análisis del negocio.

<b>Desarrollado por Matías Ahumada</b>
<a href="https://www.linkedin.com/in/matias-ahumada-dev/" target="_blank">LinkedIn</a>
<a href="https://github.com/MatiasAhumada" target="_blank">GitHub</a><br>
Teléfono: +54 9 381 352-8658`,
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'API SiSCapacitaciones',
    swaggerOptions: {
      url: '/backend/api/swagger-json',
    },
  });

  await app.listen(4040);
}
bootstrap();
