import { NestFactory } from '@nestjs/core';
import { AppModule } from '../Modules/app.module';
import { CajaService } from '../Modules/caja/caja.service';
import { Repository } from 'typeorm';
import { SesionCaja } from '../Modules/caja/entities/sesion-caja.entity';
import { Vendedor } from '../Modules/vendedor/entities/vendedor.entity';
import { Subcategoria } from '../Modules/caja/entities/subcategoria.entity';
import {
  Caja,
  MetodoPago,
  TipoMovimiento,
} from '../Modules/caja/entities/caja.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

async function runRetiroEfectivo() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const cajaService = app.get(CajaService);
  const sesionRepository = app.get<Repository<SesionCaja>>(
    getRepositoryToken(SesionCaja),
  );
  const vendedorRepository = app.get<Repository<Vendedor>>(
    getRepositoryToken(Vendedor),
  );
  const subcategoriaRepository = app.get<Repository<Subcategoria>>(
    getRepositoryToken(Subcategoria),
  );
  const cajaRepository = app.get<Repository<Caja>>(getRepositoryToken(Caja));

  try {
    console.log('🚀 Iniciando retiro de efectivo de últimas cajas cerradas...');

    // 1. Inicializar categoría RETIRO si no existe
    await cajaService.inicializarCategoriaRetiro();

    // 2. Obtener subcategoría de retiro
    const subcategoriaRetiro = await subcategoriaRepository.findOne({
      where: { nombre: 'Retiro' },
      relations: ['categoria'],
    });

    if (!subcategoriaRetiro) {
      throw new Error('No se encontró la subcategoría de Retiro');
    }

    // 3. Obtener todos los vendedores
    const vendedores = await vendedorRepository.find();

    for (const vendedor of vendedores) {
      console.log(`📋 Procesando vendedor: ${vendedor.name}`);

      // 4. Buscar todas las sesiones con efectivo > 0 (abiertas y cerradas)
      const sesionesConEfectivo = await sesionRepository
        .createQueryBuilder('sesion')
        .where('sesion.vendedorId = :vendedorId', { vendedorId: vendedor.id })
        .andWhere('sesion.totalEfectivo > 0')
        .orderBy('sesion.fechaApertura', 'DESC')
        .getMany();

      if (!sesionesConEfectivo.length) {
        console.log(
          `   ✅ ${vendedor.name} no tiene efectivo en ninguna sesión`,
        );
        continue;
      }

      for (const sesion of sesionesConEfectivo) {
        const efectivoDisponible = Number(sesion.totalEfectivo);
        const estado = sesion.fechaCierre ? 'cerrada' : 'abierta';

        console.log(`   💰 Sesión ${estado}: $${efectivoDisponible}`);

        // 5. Crear movimiento de retiro
        const retiro = cajaRepository.create({
          tipo: TipoMovimiento.EGRESO,
          metodoPago: MetodoPago.EFECTIVO,
          monto: efectivoDisponible,
          descripcion: `Retiro total de efectivo - Seed automático (${estado})`,
          vendedor: vendedor,
          subcategoria: subcategoriaRetiro,
          fecha: new Date(),
          sesionCaja: sesion,
        });

        await cajaRepository.save(retiro);

        // 6. Actualizar totales de la sesión
        sesion.totalEgresos = Number(sesion.totalEgresos) + efectivoDisponible;
        sesion.totalEfectivo = 0;

        await sesionRepository.save(sesion);

        console.log(
          `   ✅ Retiro de $${efectivoDisponible} realizado en sesión ${estado}`,
        );
      }
    }

    console.log('✅ Proceso de retiro completado exitosamente.');
  } catch (error) {
    console.error('❌ Error ejecutando retiro de efectivo:', error);
  } finally {
    await app.close();
  }
}

runRetiroEfectivo();
