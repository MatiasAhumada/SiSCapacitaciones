import { NestFactory } from '@nestjs/core';
import { AppModule } from '../Modules/app.module';
import { SeederService } from './seeders.service';

async function runRecalcularProduccion() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seederService = app.get(SeederService);

  try {
    console.log('🚀 Ejecutando recálculo de totales para producción...');
    await seederService.recalcularTotalesProduccion();
    console.log('✅ Proceso completado exitosamente.');
  } catch (error) {
    console.error('❌ Error ejecutando recálculo:', error);
  } finally {
    await app.close();
  }
}

runRecalcularProduccion();
