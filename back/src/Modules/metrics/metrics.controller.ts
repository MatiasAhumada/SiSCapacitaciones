// src/modules/metrics/metrics.controller.ts
import { Controller, Get } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('sales-by-month')
  getSalesByMonth() {
    return this.metricsService.getSalesByMonth();
  }

  @Get('enrollments-by-month')
  getEnrollmentsByMonth() {
    return this.metricsService.getEnrollmentsByMonth();
  }

  @Get('payment-methods')
  getPaymentMethodsDistribution() {
    return this.metricsService.getPaymentMethodsDistribution();
  }

  @Get('sales-by-seller')
  getSalesBySeller() {
    return this.metricsService.getSalesBySeller();
  }
}