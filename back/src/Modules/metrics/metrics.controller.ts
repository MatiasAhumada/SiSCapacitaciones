// src/modules/metrics/metrics.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('sales-by-month')
  getSalesByMonth(
    @Query('year') year?: string,
    @Query('vendedorIds') vendedorIds?: string,
  ) {
    const ids = vendedorIds ? vendedorIds.split(',') : undefined;
    return this.metricsService.getSalesByMonth(year, ids);
  }

  @Get('enrollments-by-month')
  getEnrollmentsByMonth(
    @Query('vendedorIds') vendedorIds?: string,
    @Query('months') months?: string,
    @Query('year') year?: string,
    @Query('cursoId') cursoId?: string,
  ) {
    const ids = vendedorIds ? vendedorIds.split(',') : undefined;
    const monthsList = months ? months.split(',') : undefined;
    return this.metricsService.getEnrollmentsByMonth(ids, monthsList, year, cursoId);
  }

  @Get('payment-methods')
  getPaymentMethodsDistribution(
    @Query('month') month?: string,
    @Query('vendedorIds') vendedorIds?: string,
  ) {
    const ids = vendedorIds ? vendedorIds.split(',') : undefined;
    return this.metricsService.getPaymentMethodsDistribution(month, ids);
  }

  @Get('sales-by-seller')
  getSalesBySeller(@Query('month') month?: string) {
    return this.metricsService.getSalesBySeller(month);
  }

  @Get('available-years')
  getAvailableYears() {
    return this.metricsService.getAvailableYears();
  }

  @Get('available-sellers')
  getAvailableSellers() {
    return this.metricsService.getAvailableSellers();
  }

  @Get('available-courses')
  getAvailableCourses() {
    return this.metricsService.getAvailableCourses();
  }
}