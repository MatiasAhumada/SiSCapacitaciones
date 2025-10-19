import { NestFactory } from '@nestjs/core';
import { AppModule } from '../Modules/app.module';
import { CajaService } from '../Modules/caja/caja.service';
import { Repository } from 'typeorm';
import { SesionCaja } from '../Modules/caja/entities/sesion-caja.entity';
import { Vendedor } from '../Modules/vendedor/entities/vendedor.entity';
import { Subcategoria } from '../Modules/caja/entities/subcategoria.entity';
import { Caja, MetodoPago, TipoMovimiento } from '../Modules/caja/entities/caja.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

async function runRetiroEfectivo() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const cajaService = app.get(CajaService);
  const sesionRepository = app.get<Repository<SesionCaja>>(getRepositoryToken(SesionCaja));
  const vendedorRepository = app.get<Repository<Vendedor>>(getRepositoryToken(Vendedor));
  const subcategoriaRepository = app.get<Repository<Subcategoria>>(getRepositoryToken(Subcategoria));
  const cajaRepository = app.get<Repository<Caja>>(getRepositoryToken(Caja));

  try {
    console.log('🚀 Iniciando retiro de efectivo de últimas cajas cerradas...');

    // 1. Inicializar categoría RETIRO si no existe
    await cajaService.inicializarCategoriaRetiro();
    
    // 2. Obtener subcategoría de retiro
    const subcategoriaRetiro = await subcategoriaRepository.findOne({
      where: { nombre: 'Retiro' },
      relations: ['categoria']
    });

    if (!subcategoriaRetiro) {
      throw new Error('No se encontró la subcategoría de Retiro');
    }

    // 3. Obtener todos los vendedores
    const vendedores = await vendedorRepository.find();

    for (const vendedor of vendedores) {
      console.log(`📋 Procesando vendedor: ${vendedor.name}`);

      // 4. Buscar la última sesión cerrada del vendedor
      const ultimaSesionCerrada = await sesionRepository
        .createQueryBuilder('sesion')
        .where('sesion.vendedorId = :vendedorId', { vendedorId: vendedor.id })
        .andWhere('sesion.fechaCierre IS NOT NULL')
        .orderBy('sesion.fechaCierre', 'DESC')
        .getOne();

      if (!ultimaSesionCerrada) {
        console.log(`   ⚠️  No se encontró sesión cerrada para ${vendedor.name}`);
        continue;
      }

      const efectivoDisponible = Number(ultimaSesionCerrada.totalEfectivo);

      if (efectivoDisponible <= 0) {
        console.log(`   ✅ ${vendedor.name} ya tiene efectivo en 0`);
        continue;
      }

      console.log(`   💰 Efectivo disponible: $${efectivoDisponible}`);

      // 5. Crear movimiento de retiro
      const retiro = cajaRepository.create({
        tipo: TipoMovimiento.EGRESO,
        metodoPago: MetodoPago.EFECTIVO,
        monto: efectivoDisponible,
        descripcion: 'Retiro total de efectivo - Seed automático',
        vendedor: vendedor,
        subcategoria: subcategoriaRetiro,
        fecha: new Date(),
        sesionCaja: ultimaSesionCerrada
      });

      await cajaRepository.save(retiro);

      // 6. Actualizar totales de la sesión
      ultimaSesionCerrada.totalEgresos = Number(ultimaSesionCerrada.totalEgresos) + efectivoDisponible;
      ultimaSesionCerrada.totalIngresos = Number(ultimaSesionCerrada.totalIngresos) - efectivoDisponible;
      ultimaSesionCerrada.totalEfectivo = 0;

      await sesionRepository.save(ultimaSesionCerrada);

      console.log(`   ✅ Retiro de $${efectivoDisponible} realizado para ${vendedor.name}`);
    }

    console.log('✅ Proceso de retiro completado exitosamente.');
  } catch (error) {
    console.error('❌ Error ejecutando retiro de efectivo:', error);
  } finally {
    await app.close();
  }
}

runRetiroEfectivo();