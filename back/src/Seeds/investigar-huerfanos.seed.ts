import { NestFactory } from '@nestjs/core';
import { AppModule } from '../Modules/app.module';
import { SeederService } from './seeders.service';

async function investigarMovimientosHuerfanos() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seederService = app.get(SeederService);

  try {
    console.log('🔍 Investigando movimientos huérfanos...');
    await seederService.investigarMovimientosHuerfanos();
    console.log('✅ Investigación completada.');
  } catch (error) {
    console.error('❌ Error en investigación:', error);
  } finally {
    await app.close();
  }
}

investigarMovimientosHuerfanos();