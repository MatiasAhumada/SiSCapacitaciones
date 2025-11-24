// src/modules/metrics/metrics.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Caja } from '../caja/entities/caja.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';

@Module({
  imports: [TypeOrmModule.forFeature([Caja, Inscripcion])],
  controllers: [MetricsController],
  providers: [MetricsService],
})
export class MetricsModule {}
