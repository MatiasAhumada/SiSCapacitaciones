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

  async getSalesByMonth(): Promise<{ name: string; sales: number }[]> {
    const rawData = await this.cajaRepository
      .createQueryBuilder('caja')
      // Realizamos un LEFT JOIN para asegurar que se incluyan los movimientos sin sesionCaja
      .leftJoin('caja.sesionCaja', 'sesionCaja') 
      .select("TO_CHAR(caja.fecha, 'YYYY-MM') AS month")
      .addSelect('SUM(caja.monto)', 'totalSales')
      // Filtramos para obtener solo los ingresos (opcional, pero buena práctica)
      .where('caja.tipo = :tipo', { tipo: 'Ingreso' })
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    const formattedData = rawData.map(item => ({
      name: item.month, // Ejemplo: "2025-08"
      sales: parseFloat(item.totalSales),
    }));

    return formattedData;
  }

  async getEnrollmentsByMonth(): Promise<{ name: string; inscripciones: number }[]> {
    // La entidad Inscripcion no está relacionada con Caja, así que no necesita cambios.
    // La consulta original funciona perfectamente.
    const rawData = await this.inscripcionRepository
      .createQueryBuilder('inscripcion')
      .select("TO_CHAR(inscripcion.fechaRegistro, 'YYYY-MM') AS month")
      .addSelect('COUNT(*)', 'totalInscripciones')
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    const formattedData = rawData.map(item => ({
      name: item.month,
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
      .orderBy('"totalSales"', 'DESC') // <-- ¡Aquí está el cambio!
      .getRawMany();
  
    const formattedData = rawData.map(item => ({
      name: item.vendedorName,
      sales: parseFloat(item.totalSales),
    }));
  
    return formattedData;
  }
}