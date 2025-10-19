import { NestFactory } from '@nestjs/core';
import { AppModule } from '../Modules/app.module';
import { SeederService } from './seeders.service';

async function runVerificarTotalesSesiones() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seederService = app.get(SeederService);

  try {
    console.log('🚀 Ejecutando reparación de movimientos huérfanos...');
    await seederService.repararMovimientosHuerfanos();
    
    console.log('🚀 Ejecutando verificación de totales de sesiones...');
    await seederService.verificarYCorregirTotalesSesiones();
    
    console.log('✅ Proceso completado exitosamente.');
  } catch (error) {
    console.error('❌ Error ejecutando verificación:', error);
  } finally {
    await app.close();
  }
}

runVerificarTotalesSesiones();