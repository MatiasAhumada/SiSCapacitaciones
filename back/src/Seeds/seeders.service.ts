import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Admins } from '../Modules/admin/entities/admin.entity';
import { SesionCaja } from '@modules/Modules/caja/entities/sesion-caja.entity';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @InjectRepository(Admins)
    private readonly adminRepository: Repository<Admins>,
    @InjectRepository(SesionCaja)
    private readonly sesionRepository: Repository<SesionCaja>,
  ) {}
  private readonly logger = new Logger(SeederService.name);
  async onModuleInit() {
    await this.seedCajasEspeciales();
  }


  async seedCajasEspeciales() {
    this.logger.log('🚀 Iniciando creación de cajas perpetuas...');
    
    const adminsInfo = [
      {
        id: '4ab59277-5a15-4841-acce-851b0f6dbe11', // Javier
        nombre: 'Javier',
      },
      {
        id: 'f709ac35-d270-4941-83de-d45031d6c33e', // Tobias
        nombre: 'Tobias',
      },
    ];

    for (const adminInfo of adminsInfo) {
      const admin = await this.adminRepository.findOneBy({ id: adminInfo.id });

      if (!admin) {
        this.logger.warn(`❌ Admin ${adminInfo.nombre} no encontrado.`);
        continue;
      }

      const sesionExistente = await this.sesionRepository.findOne({
        where: {
          admin: { id: admin.id },
          fechaCierre: IsNull(),
        },
      });

      if (sesionExistente) {
        this.logger.log(`ℹ️ Sesión perpetua ya existe para ${adminInfo.nombre}.`);
        continue;
      }

      const nuevaSesion = this.sesionRepository.create({
        admin,
        fechaApertura: new Date(),
        montoApertura: 0,
        totalDigitalJavier: 0,
        totalDigitalTobias: 0,
        totalEfectivo: 0,
        totalCredito: 0,
        totalFerro: 0,
        totalEgresos: 0,
        totalIngresos: 0,
      });

      await this.sesionRepository.save(nuevaSesion);
      this.logger.log(`✅ Caja perpetua creada para ${adminInfo.nombre}.`);
    }

    // Migrar movimientos digitales existentes
    await this.migrarMovimientosDigitales();
  }



  async recalcularTotalesProduccion() {
    this.logger.log('🔄 Iniciando recálculo de totales para producción...');
    
    const dataSource = this.sesionRepository.manager.connection;
    
    // 1. Reparar movimientos de apertura y cierre huérfanos
    await this.repararAperturaCierreHuerfanos();
    
    // 2. Recalcular totales de todas las sesiones
    const sesiones = await this.sesionRepository.find({
      relations: ['vendedor', 'admin']
    });

    let sesionesActualizadas = 0;

    for (const sesion of sesiones) {
      // Calcular totales reales desde los movimientos
      const totalesReales = await dataSource.query(`
        SELECT 
          COALESCE(SUM(CASE WHEN tipo = 'Ingreso' THEN monto ELSE 0 END), 0) as total_ingresos,
          COALESCE(SUM(CASE WHEN tipo = 'Egreso' THEN monto ELSE 0 END), 0) as total_egresos,
          COALESCE(SUM(CASE WHEN "metodoPago" = 'Efectivo' AND tipo = 'Ingreso' THEN monto 
                           WHEN "metodoPago" = 'Efectivo' AND tipo = 'Egreso' THEN -monto ELSE 0 END), 0) as ingresos_egresos_efectivo,
          COALESCE(SUM(CASE WHEN "metodoPago" = 'Credito' AND tipo = 'Ingreso' THEN monto 
                           WHEN "metodoPago" = 'Credito' AND tipo = 'Egreso' THEN -monto ELSE 0 END), 0) as ingresos_egresos_credito,
          COALESCE(SUM(CASE WHEN "metodoPago" = 'Digital Javier' AND tipo = 'Ingreso' THEN monto 
                           WHEN "metodoPago" = 'Digital Javier' AND tipo = 'Egreso' THEN -monto ELSE 0 END), 0) as ingresos_egresos_digital_javier,
          COALESCE(SUM(CASE WHEN "metodoPago" = 'Digital Tobias' AND tipo = 'Ingreso' THEN monto 
                           WHEN "metodoPago" = 'Digital Tobias' AND tipo = 'Egreso' THEN -monto ELSE 0 END), 0) as ingresos_egresos_digital_tobias,
          COALESCE(SUM(CASE WHEN "metodoPago" = 'Ferro' AND tipo = 'Ingreso' THEN monto 
                           WHEN "metodoPago" = 'Ferro' AND tipo = 'Egreso' THEN -monto ELSE 0 END), 0) as ingresos_egresos_ferro,
          COALESCE(SUM(CASE WHEN tipo = 'Apertura' THEN monto ELSE 0 END), 0) as monto_apertura
        FROM cajas 
        WHERE "sesionCajaId" = $1
      `, [sesion.id]);

      const totales = totalesReales[0];
      
      // Calcular totales finales incluyendo apertura
      const totalEfectivo = Number(totales.monto_apertura) + Number(totales.ingresos_egresos_efectivo);
      const totalCredito = Number(totales.ingresos_egresos_credito);
      const totalDigitalJavier = Number(totales.ingresos_egresos_digital_javier);
      const totalDigitalTobias = Number(totales.ingresos_egresos_digital_tobias);
      const totalFerro = Number(totales.ingresos_egresos_ferro);

      
      const usuario = sesion.vendedor?.name || sesion.admin?.name || 'Desconocido';
      
      // Calcular monto de cierre
      const montoCierre = Number(totales.monto_apertura) + Number(totales.total_ingresos) - Number(totales.total_egresos);
      
      this.logger.log(`🔧 Actualizando sesión ${sesion.id} - Usuario: ${usuario}`);
      this.logger.log(`   Totales: I:${totales.total_ingresos} E:${totales.total_egresos} Ef:${totalEfectivo} Cr:${totalCredito} DJ:${totalDigitalJavier} DT:${totalDigitalTobias} F:${totalFerro}`);
      this.logger.log(`   Apertura: ${totales.monto_apertura} | Cierre: ${montoCierre}`);

      // Actualizar la sesión
      await dataSource.query(`
        UPDATE sesiones_caja 
        SET 
          "montoApertura" = $1,
          "totalIngresos" = $2,
          "totalEgresos" = $3,
          "totalEfectivo" = $4,
          "totalCredito" = $5,
          "totalDigitalJavier" = $6,
          "totalDigitalTobias" = $7,
          "totalFerro" = $8,
          "montoCierre" = CASE 
            WHEN "fechaCierre" IS NOT NULL THEN $9
            ELSE "montoCierre"
          END
        WHERE id = $10
      `, [
        totales.monto_apertura,
        totales.total_ingresos,
        totales.total_egresos, 
        totalEfectivo,
        totalCredito,
        totalDigitalJavier,
        totalDigitalTobias,
        totalFerro,
        montoCierre,
        sesion.id
      ]);

      sesionesActualizadas++;
    }

    this.logger.log(`✅ Recálculo completado. ${sesionesActualizadas} sesiones actualizadas.`);
  }

  async repararAperturaCierreHuerfanos() {
    this.logger.log('🔧 Reparando movimientos de apertura y cierre huérfanos...');
    
    const dataSource = this.sesionRepository.manager.connection;
    
    // Buscar movimientos de apertura y cierre sin sesión
    const movimientosHuerfanos = await dataSource.query(`
      SELECT c.*, v.name as vendedor_name
      FROM cajas c
      LEFT JOIN vendedores v ON c."vendedorId" = v.id
      WHERE c."sesionCajaId" IS NULL
      AND c.tipo IN ('Apertura', 'Cierre')
      ORDER BY c.fecha
    `);
    
    let movimientosReparados = 0;
    
    for (const movimiento of movimientosHuerfanos) {
      // Buscar sesión apropiada por usuario y fecha
      const sesionApropiada = await dataSource.query(`
        SELECT s.id, s."fechaApertura", s."fechaCierre"
        FROM sesiones_caja s
        WHERE (
          (s."vendedorId" = $1 AND $1 IS NOT NULL) OR
          (s."adminId" IS NOT NULL AND $1 IS NULL)
        )
        AND s."fechaApertura" <= $2
        AND (s."fechaCierre" IS NULL OR s."fechaCierre" >= $2)
        ORDER BY ABS(EXTRACT(EPOCH FROM (s."fechaApertura" - $2)))
        LIMIT 1
      `, [movimiento.vendedorId, movimiento.fecha]);
      
      if (sesionApropiada.length > 0) {
        const sesion = sesionApropiada[0];
        
        await dataSource.query(`
          UPDATE cajas SET "sesionCajaId" = $1 WHERE id = $2
        `, [sesion.id, movimiento.id]);
        
        this.logger.log(`📎 Movimiento ${movimiento.tipo} asociado a sesión ${sesion.id}`);
        movimientosReparados++;
      }
    }
    
    this.logger.log(`✅ ${movimientosReparados} movimientos de apertura/cierre reparados.`);
  }

  async migrarMovimientosDigitales() {
    const dataSource = this.sesionRepository.manager.connection;
    
    const sesionJavier = await this.sesionRepository.findOne({
      where: {
        admin: { id: '4ab59277-5a15-4841-acce-851b0f6dbe11' },
        fechaCierre: IsNull(),
      },
    });
    
    const sesionTobias = await this.sesionRepository.findOne({
      where: {
        admin: { id: 'f709ac35-d270-4941-83de-d45031d6c33e' },
        fechaCierre: IsNull(),
      },
    });

    if (!sesionJavier || !sesionTobias) return;

    const movimientosJavier = await dataSource.query(`
      SELECT * FROM cajas WHERE "metodoPago" = 'Digital Javier' AND "sesionCajaId" IS NULL
    `);

    for (const mov of movimientosJavier) {
      await dataSource.query(`UPDATE cajas SET "sesionCajaId" = $1 WHERE id = $2`, [sesionJavier.id, mov.id]);
    }

    const movimientosTobias = await dataSource.query(`
      SELECT * FROM cajas WHERE "metodoPago" = 'Digital Tobias' AND "sesionCajaId" IS NULL
    `);

    for (const mov of movimientosTobias) {
      await dataSource.query(`UPDATE cajas SET "sesionCajaId" = $1 WHERE id = $2`, [sesionTobias.id, mov.id]);
    }
  }
}
