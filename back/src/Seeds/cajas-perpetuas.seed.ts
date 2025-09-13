import { NestFactory } from '@nestjs/core';
import { AppModule } from '../Modules/app.module';
import { SeederService } from './seeders.service';

async function runCajasPerpetuasSeed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seederService = app.get(SeederService);

  try {
    console.log('🚀 Ejecutando seed de cajas perpetuas...');
    await seederService.seedCajasEspeciales();
    console.log('✅ Seed de cajas perpetuas completado exitosamente.');
  } catch (error) {
    console.error('❌ Error ejecutando seed:', error);
  } finally {
    await app.close();
  }
}

runCajasPerpetuasSeed();