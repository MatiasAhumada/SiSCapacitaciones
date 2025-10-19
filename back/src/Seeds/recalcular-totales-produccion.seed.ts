import { NestFactory } from '@nestjs/core';
import { AppModule } from '../Modules/app.module';
import { SeederService } from './seeders.service';

async function recalcularTotalesProduccion() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seederService = app.get(SeederService);

  try {
    console.log('🚀 Recalculando totales de sesiones para producción...');
    await seederService.recalcularTotalesProduccion();
    console.log('✅ Recálculo completado exitosamente.');
  } catch (error) {
    console.error('❌ Error en recálculo:', error);
  } finally {
    await app.close();
  }
}

recalcularTotalesProduccion();