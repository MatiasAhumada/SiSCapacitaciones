// src/modules/metrics/metrics.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('sales-by-month')
  getSalesByMonth(@Query('year') year?: string) {
    return this.metricsService.getSalesByMonth(year);
  }

  @Get('enrollments-by-month')
  getEnrollmentsByMonth(
    @Query('vendedorIds') vendedorIds?: string,
    @Query('months') months?: string,
  ) {
    const ids = vendedorIds ? vendedorIds.split(',') : undefined;
    const monthsList = months ? months.split(',') : undefined;
    return this.metricsService.getEnrollmentsByMonth(ids, monthsList);
  }

  @Get('payment-methods')
  getPaymentMethodsDistribution() {
    return this.metricsService.getPaymentMethodsDistribution();
  }

  @Get('sales-by-seller')
  getSalesBySeller() {
    return this.metricsService.getSalesBySeller();
  }

  @Get('available-years')
  getAvailableYears() {
    return this.metricsService.getAvailableYears();
  }

  @Get('available-sellers')
  getAvailableSellers() {
    return this.metricsService.getAvailableSellers();
  }
}