// src/modules/metrics/metrics.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Caja, MetodoPago } from '../caja/entities/caja.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';

@Injectable()
export class MetricsService {
  constructor(
    @InjectRepository(Caja)
    private readonly cajaRepository: Repository<Caja>,
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
  ) {}

  async getSalesByMonth(year?: string): Promise<{ name: string; sales: number }[]> {
    const query = this.cajaRepository
      .createQueryBuilder('caja')
      .leftJoin('caja.sesionCaja', 'sesionCaja') 
      .select("TO_CHAR(caja.fecha, 'YYYY-MM') AS month")
      .addSelect('SUM(caja.monto)', 'totalSales')
      .where('caja.tipo = :tipo', { tipo: 'Ingreso' });

    if (year) {
      query.andWhere("TO_CHAR(caja.fecha, 'YYYY') = :year", { year });
    }

    const rawData = await query
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    const formattedData = rawData.map(item => ({
      name: item.month,
      sales: parseFloat(item.totalSales),
    }));

    return formattedData;
  }

  async getAvailableYears(): Promise<string[]> {
    const rawData = await this.cajaRepository
      .createQueryBuilder('caja')
      .select("DISTINCT TO_CHAR(caja.fecha, 'YYYY') AS year")
      .where('caja.tipo = :tipo', { tipo: 'Ingreso' })
      .orderBy('year', 'DESC')
      .getRawMany();

    return rawData.map(item => item.year);
  }

  async getEnrollmentsByMonth(vendedorIds?: string[], months?: string[]): Promise<{ name: string; inscripciones: number; week?: string; month?: string }[]> {
    const query = this.inscripcionRepository
      .createQueryBuilder('inscripcion')
      .leftJoin('inscripcion.vendedor', 'vendedor');

    const currentYear = new Date().getFullYear().toString();

    if (months && months.length > 0) {
      // Agrupar por semana cuando se filtran meses
      query.select("TO_CHAR(inscripcion.fechaRegistro, 'YYYY-MM') AS month")
        .addSelect("'Semana ' || EXTRACT(WEEK FROM inscripcion.fechaRegistro) - EXTRACT(WEEK FROM DATE_TRUNC('month', inscripcion.fechaRegistro)) + 1 AS week")
        .addSelect('COUNT(*)', 'totalInscripciones')
        .where("TO_CHAR(inscripcion.fechaRegistro, 'MM') IN (:...months)", { months })
        .andWhere("TO_CHAR(inscripcion.fechaRegistro, 'YYYY') = :year", { year: currentYear });

      if (vendedorIds && vendedorIds.length > 0) {
        query.addSelect('vendedor.name', 'vendedorName')
          .andWhere('vendedor.id IN (:...vendedorIds)', { vendedorIds })
          .groupBy('month')
          .addGroupBy('week')
          .addGroupBy('vendedor.name');
      } else {
        query.groupBy('month').addGroupBy('week');
      }
    } else {
      // Agrupar por mes cuando no hay filtro de meses
      query.select("TO_CHAR(inscripcion.fechaRegistro, 'YYYY-MM') AS month")
        .addSelect('COUNT(*)', 'totalInscripciones')
        .where("TO_CHAR(inscripcion.fechaRegistro, 'YYYY') = :year", { year: currentYear });

      if (vendedorIds && vendedorIds.length > 0) {
        query.addSelect('vendedor.name', 'vendedorName')
          .andWhere('vendedor.id IN (:...vendedorIds)', { vendedorIds })
          .groupBy('month')
          .addGroupBy('vendedor.name');
      } else {
        query.groupBy('month');
      }
    }

    const rawData = await query.orderBy('month', 'ASC').getRawMany();

    const formattedData = rawData.map(item => ({
      name: item.vendedorName || 'Total',
      month: item.month,
      week: item.week,
      inscripciones: parseInt(item.totalInscripciones, 10),
    }));

    return formattedData;
  }

  async getPaymentMethodsDistribution(): Promise<{ name: string; value: number }[]> {
    const rawData = await this.cajaRepository
      .createQueryBuilder('caja')
      .leftJoin('caja.sesionCaja', 'sesionCaja')
      // Filtramos para obtener solo los ingresos
      .where('caja.tipo = :tipo', { tipo: 'Ingreso' })
      .select('caja.metodoPago', 'metodo')
      .addSelect('SUM(caja.monto)', 'totalMonto')
      .groupBy('metodo')
      .getRawMany();

    const formattedData = rawData.map(item => ({
      name: item.metodo,
      value: parseFloat(item.totalMonto),
    }));

    return formattedData;
  }

  // --- NUEVAS MÉTRICAS BASADAS EN LA SESIÓN DE CAJA ---
  async getSalesBySeller(): Promise<{ name: string; sales: number }[]> {
    const rawData = await this.cajaRepository
      .createQueryBuilder('caja')
      .leftJoin('caja.sesionCaja', 'sesionCaja')
      .leftJoin('sesionCaja.vendedor', 'vendedor')
      .select('vendedor.name', 'vendedorName')
      .addSelect('SUM(caja.monto)', 'totalSales')
      .where('caja.tipo = :tipo', { tipo: 'Ingreso' })
      .groupBy('vendedor.name')
      .orderBy('"totalSales"', 'DESC')
      .getRawMany();
  
    const formattedData = rawData.map(item => ({
      name: item.vendedorName,
      sales: parseFloat(item.totalSales),
    }));
  
    return formattedData;
  }

  async getAvailableSellers(): Promise<{ id: string; name: string }[]> {
    const rawData = await this.inscripcionRepository
      .createQueryBuilder('inscripcion')
      .leftJoin('inscripcion.vendedor', 'vendedor')
      .select('vendedor.id', 'id')
      .addSelect('vendedor.name', 'name')
      .where('vendedor.id IS NOT NULL')
      .groupBy('vendedor.id')
      .addGroupBy('vendedor.name')
      .orderBy('vendedor.name', 'ASC')
      .getRawMany();

    return rawData;
  }
}