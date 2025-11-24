import { NestFactory } from '@nestjs/core';
import { AppModule } from '../Modules/app.module';
import { Repository } from 'typeorm';
import { Vendedor } from '../Modules/vendedor/entities/vendedor.entity';
import { SesionCaja } from '../Modules/caja/entities/sesion-caja.entity';
import { Caja } from '../Modules/caja/entities/caja.entity';
import { Inscripcion } from '../Modules/inscripcion/entities/inscripcion.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

async function runLimpiarVendedoresSinCajas() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const vendedorRepository = app.get<Repository<Vendedor>>(
    getRepositoryToken(Vendedor),
  );
  const sesionRepository = app.get<Repository<SesionCaja>>(
    getRepositoryToken(SesionCaja),
  );
  const cajaRepository = app.get<Repository<Caja>>(getRepositoryToken(Caja));
  const inscripcionRepository = app.get<Repository<Inscripcion>>(
    getRepositoryToken(Inscripcion),
  );

  try {
    console.log('🔍 Buscando vendedores sin cajas o sesiones...');

    const vendedores = await vendedorRepository.find();
    const vendedoresParaEliminar: Vendedor[] = [];

    for (const vendedor of vendedores) {
      // Verificar si tiene sesiones
      const sesiones = await sesionRepository.count({
        where: { vendedor: { id: vendedor.id } },
      });

      // Verificar si tiene movimientos de caja
      const movimientos = await cajaRepository.count({
        where: { vendedor: { id: vendedor.id } },
      });

      // Verificar si tiene inscripciones
      const inscripciones = await inscripcionRepository.count({
        where: { vendedor: { id: vendedor.id } },
      });

      if (sesiones === 0 && inscripciones === 0) {
        vendedoresParaEliminar.push(vendedor);
        console.log(
          `❌ ${vendedor.name} (${vendedor.email}) - Sin sesiones ni inscripciones (Movimientos: ${movimientos})`,
        );
      } else if (sesiones === 0 && inscripciones > 0) {
        console.log(
          `⚠️ ${vendedor.name} - Sin sesiones pero con ${inscripciones} inscripciones (NO SE ELIMINA)`,
        );
      } else {
        console.log(
          `✅ ${vendedor.name} - Sesiones: ${sesiones}, Movimientos: ${movimientos}, Inscripciones: ${inscripciones}`,
        );
      }
    }

    if (vendedoresParaEliminar.length === 0) {
      console.log('✅ No se encontraron vendedores para eliminar.');
      return;
    }

    console.log(
      `\n⚠️  Se encontraron ${vendedoresParaEliminar.length} vendedores sin actividad:`,
    );
    vendedoresParaEliminar.forEach((v) => {
      console.log(`   - ${v.name} (${v.email})`);
    });

    // Eliminar vendedores sin actividad
    for (const vendedor of vendedoresParaEliminar) {
      // Eliminar todas las cajas donde aparezca el vendedor
      await cajaRepository.delete({ vendedor: { id: vendedor.id } });
      await cajaRepository.delete({ vendedorPagos: { id: vendedor.id } });

      // Luego eliminar el vendedor
      await vendedorRepository.delete(vendedor.id);
      console.log(`🗑️  Eliminado: ${vendedor.name}`);
    }

    console.log(
      `✅ Proceso completado. ${vendedoresParaEliminar.length} vendedores eliminados.`,
    );
  } catch (error) {
    console.error('❌ Error ejecutando limpieza:', error);
  } finally {
    await app.close();
  }
}

runLimpiarVendedoresSinCajas();
