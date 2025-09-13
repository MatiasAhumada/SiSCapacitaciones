import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Repository } from 'typeorm';
import { Admins } from '../Modules/admin/entities/admin.entity';
import { Sucursal } from '../Modules/sucursal/entities/sucursal.entity';
import * as bcrypt from 'bcrypt';
import { Curso } from 'src/Modules/curso/entities/curso.entity';
import { CajaService } from '@modules/Modules/caja/caja.service';
import { Vendedor } from '@modules/Modules/vendedor/entities/vendedor.entity';
import { SesionCaja } from '@modules/Modules/caja/entities/sesion-caja.entity';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @InjectRepository(Admins)
    private readonly adminRepository: Repository<Admins>,
    @InjectRepository(Sucursal)
    private readonly sucursalRepository: Repository<Sucursal>,
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
    @InjectRepository(Admins)
    private readonly adminsRepository: Repository<Admins>,
    @InjectRepository(Vendedor)
    private readonly vendedorRepository: Repository<Vendedor>,
    @InjectRepository(SesionCaja)
    private readonly sesionRepository: Repository<SesionCaja>,

    private readonly cajaService: CajaService,
  ) {}
  private readonly logger = new Logger(SeederService.name);
  async onModuleInit() {
    await this.seedCajasEspeciales();
  }
  //  async crearSesionesCaja() {
  //    this.logger.log('Iniciando creación de sesiones por día para movimientos de caja...');
  //    try {
  //      await this.cajaService.crearSesionesPorDia();
  //      this.logger.log('Sesiones creadas correctamente.');
  //    } catch (error) {
  //      this.logger.error('Error creando sesiones por día:', error);
  //    }
  //  }

  async seed() {
    console.log('Ejecutando seeder...');

    // Verificar si el admin ya existe
    let admin = await this.adminRepository.findOne({
      where: { name: 'javier' },
    });

    if (!admin) {
      //const hashedPassword = await bcrypt.hash('javieradmin', 10);
      admin = this.adminRepository.create({
        name: 'javier',
        password: 'javieradmin',
        isAdmin: true,
      });

      await this.adminRepository.save(admin);
      console.log(`Admin creado con ID: ${admin.id}`);
    } else {
      console.log(`Admin ${admin.name} ya existe.`);
    }

    // Datos de sucursales
    const sucursalesData = [
      {
        name: 'Sucursal Santiago',
        localidad: 'Santiago Del Estero',
        provincia: 'Santiago del Estero',
      },
      {
        name: 'Sucursal Centro',
        localidad: 'San Miguel de Tucumán',
        provincia: 'Tucumán',
      },
      { name: 'Sucursal Tafi', localidad: 'Tafi Viejo', provincia: 'Tucumán' },
    ];

    for (const sucursalData of sucursalesData) {
      const exists = await this.sucursalRepository.findOne({
        where: { name: sucursalData.name },
      });

      if (!exists) {
        const sucursal = this.sucursalRepository.create({
          ...sucursalData,
          admin,
        });
        await this.sucursalRepository.save(sucursal);
        console.log(`Sucursal ${sucursal.name} creada.`);
      } else {
        console.log(`Sucursal ${sucursalData.name} ya existe.`);
      }
    }
    const cursosDigitales = [
      // Área Digital (Distancia)
      {
        name: 'Programación',
        area: 'Digital',
        duration: 10,
        price: 25000,
        tipo: 'Distancia',
      },
      {
        name: 'Diseño Gráfico',
        area: 'Digital',
        duration: 10,
        price: 25000,
        tipo: 'Distancia',
      },
      {
        name: 'Excel Avanzado',
        area: 'Digital',
        duration: 10,
        price: 25000,
        tipo: 'Distancia',
      },
      {
        name: 'Marketing Digital',
        area: 'Digital',
        duration: 10,
        price: 25000,
        tipo: 'Distancia',
      },
      {
        name: 'Inteligencia Artificial',
        area: 'Digital',
        duration: 10,
        price: 25000,
        tipo: 'Distancia',
      },
      {
        name: 'Trading',
        area: 'Digital',
        duration: 10,
        price: 25000,
        tipo: 'Distancia',
      },

      // Área Idiomas (Distancia)
      {
        name: 'Inglés',
        area: 'Idiomas',
        duration: 10,
        price: 25000,
        tipo: 'Distancia',
      },
      {
        name: 'Portugués',
        area: 'Idiomas',
        duration: 10,
        price: 25000,
        tipo: 'Distancia',
      },
      {
        name: 'Italiano',
        area: 'Idiomas',
        duration: 10,
        price: 25000,
        tipo: 'Distancia',
      },

      // Área Administrativa (Presencial)
      {
        name: 'Cajero Comercial y Atención al Cliente',
        area: 'Administrativa',
        duration: 10,
        price: 25000,
        tipo: 'Presencial',
      },
      {
        name: 'Secretariado Administrativo, Jurídico y Médico',
        area: 'Administrativa',
        duration: 10,
        price: 25000,
        tipo: 'Presencial',
      },
      {
        name: 'Vendedor Profesional',
        area: 'Administrativa',
        duration: 10,
        price: 25000,
        tipo: 'Presencial',
      },
      {
        name: 'Auxiliar Impositivo Contable',
        area: 'Administrativa',
        duration: 10,
        price: 25000,
        tipo: 'Presencial',
      },

      // Área Belleza (Presencial)
      {
        name: 'Peluquería Profesional',
        area: 'Belleza',
        duration: 10,
        price: 25000,
        tipo: 'Presencial',
      },
      {
        name: 'Estética Integral',
        area: 'Belleza',
        duration: 10,
        price: 25000,
        tipo: 'Presencial',
      },
      {
        name: 'Barbería y Corte Masculino',
        area: 'Belleza',
        duration: 10,
        price: 25000,
        tipo: 'Presencial',
      },
      {
        name: 'Cosmetología',
        area: 'Belleza',
        duration: 10,
        price: 25000,
        tipo: 'Presencial',
      },
      {
        name: 'Diseño de Modas',
        area: 'Belleza',
        duration: 10,
        price: 25000,
        tipo: 'Presencial',
      },
      {
        name: 'Peluquería y Cuidado de Mascotas',
        area: 'Belleza',
        duration: 10,
        price: 25000,
        tipo: 'Presencial',
      },

      // Área Técnica (Presencial)
      {
        name: 'Técnico en Refrigeración',
        area: 'Técnica',
        duration: 10,
        price: 25000,
        tipo: 'Presencial',
      },
      {
        name: 'Electricidad Domiciliaria y Comercial',
        area: 'Técnica',
        duration: 10,
        price: 25000,
        tipo: 'Presencial',
      },
      {
        name: 'Técnico de Celulares',
        area: 'Técnica',
        duration: 10,
        price: 25000,
        tipo: 'Presencial',
      },
      {
        name: 'Reparador de PC',
        area: 'Técnica',
        duration: 10,
        price: 25000,
        tipo: 'Presencial',
      },
      {
        name: 'Mecánica de Motos',
        area: 'Técnica',
        duration: 10,
        price: 25000,
        tipo: 'Presencial',
      },

      // Área Salud (Presencial)
      {
        name: 'Auxiliar de Farmacia',
        area: 'Salud',
        duration: 10,
        price: 25000,
        tipo: 'Presencial',
      },
      {
        name: 'Técnicas en Enfermería',
        area: 'Salud',
        duration: 10,
        price: 25000,
        tipo: 'Presencial',
      },
      {
        name: 'Auxiliar Veterinario',
        area: 'Salud',
        duration: 10,
        price: 25000,
        tipo: 'Presencial',
      },
      {
        name: 'Asistente en Estimulación Temprana',
        area: 'Salud',
        duration: 10,
        price: 25000,
        tipo: 'Presencial',
      },
      {
        name: 'Asistente en Rehabilitación Motriz',
        area: 'Salud',
        duration: 10,
        price: 25000,
        tipo: 'Presencial',
      },
      {
        name: 'Acompañante Terapéutico',
        area: 'Salud',
        duration: 10,
        price: 25000,
        tipo: 'Presencial',
      },
      {
        name: 'Auxiliar Materno Infantil',
        area: 'Salud',
        duration: 10,
        price: 25000,
        tipo: 'Presencial',
      },
      {
        name: 'Auxiliar en Rehabilitación Deportiva',
        area: 'Salud',
        duration: 10,
        price: 25000,
        tipo: 'Presencial',
      },
      {
        name: 'Asistente de Laboratorio',
        area: 'Salud',
        duration: 10,
        price: 25000,
        tipo: 'Presencial',
      },
      {
        name: 'Agente Sanitario',
        area: 'Salud',
        duration: 10,
        price: 25000,
        tipo: 'Presencial',
      },
      {
        name: 'Auxiliar en Higiene y Seguridad',
        area: 'Salud',
        duration: 10,
        price: 25000,
        tipo: 'Presencial',
      },
      {
        name: 'Auxiliar en Nutrición',
        area: 'Salud',
        duration: 10,
        price: 25000,
        tipo: 'Presencial',
      },
    ];

    for (const cursoData of cursosDigitales) {
      const exists = await this.cursoRepository.findOne({
        where: { name: cursoData.name },
      });

      if (!exists) {
        const curso = this.cursoRepository.create({
          ...cursoData,
        });
        await this.cursoRepository.save(curso);
        console.log(`Curso ${curso.name} creado.`);
      } else {
        console.log(`Curso ${cursoData.name} ya existe.`);
      }
    }
    console.log('Seeder ejecutado correctamente.');
  }
  async categorias() {
    const data: Record<string, string[]> = {
      ALQUILER: ['ALQUILER'],
      SUELDOS: ['SUELDOS'],
      COMISIONES: ['COMISIONES'],
      PROFESORES: ['PROFESORES'],
      SERVICIOS: [
        'electricidad',
        'gas',
        'agua',
        'internet',
        'celulares',
        'sistemas',
        'plataformas_digitales',
        'dispenser_agua',
        'honorarios_abogados',
        'honorarios_contadores',
        'capacitaciones_y_formaciones',
        'cuotas_y_adhesiones',
      ],
      MARKETING_Y_PUBLICIDAD: [
        'honorarios_marketing',
        'publicidad_digital',
        'television',
        'radio',
        'diario',
        'imprenta',
        'carteleria',
      ],
      IMPUESTOS: [
        'municipal',
        'rentas',
        'ingresos_brutos',
        'afip_iva',
        'afip_ganancias',
        'aportes_patronales',
        'multas',
        'otros',
      ],
      REFACCIONES_Y_MANTENIMIENTOS: [
        'mano_de_obra',
        'materiales',
        'bienes_muebles',
      ],
      INSUMOS: ['limpieza_e_higiene', 'libreria_y_oficina', 'almacen'],
      CAPACITACIONES: ['insumos_y_materiales', 'herramientas_y_maquinarias'],
      VIATICOS: ['pasaje/combustible', 'alojamiento', 'comida'],
      GASTOS_VARIOS: ['GASTOS_VARIOS'],
    };

    for (const [categoriaNombre, subcategorias] of Object.entries(data)) {
      const categoria = await this.cajaService.createCategoria(categoriaNombre);
      for (const subNombre of subcategorias) {
        await this.cajaService.createSubcategoria(subNombre, categoria.id);
      }
    }

    console.log('✅ Categorías y subcategorías creadas correctamente.');
  }
  async hashAdmins() {
    const admins = await this.adminsRepository.find();

    for (const admin of admins) {
      if (
        !admin.password.startsWith('$2a$') &&
        !admin.password.startsWith('$2b$')
      ) {
        // No está hasheada, la actualizamos
        const hashed = await bcrypt.hash(admin.password, 10);
        admin.password = hashed;
        await this.adminsRepository.save(admin);
        this.logger.log(`Password admin ${admin.name} hasheada correctamente.`);
      } else {
        this.logger.log(`Password admin ${admin.name} ya estaba hasheada.`);
      }
    }

    this.logger.log('Seeder finalizado.');
  }
  async hashVendedores() {
    const vendedores = await this.vendedorRepository.find();

    for (const vendedor of vendedores) {
      if (
        !vendedor.password.startsWith('$2a$') &&
        !vendedor.password.startsWith('$2b$')
      ) {
        const hashed = await bcrypt.hash(vendedor.password, 10);
        vendedor.password = hashed;
        await this.vendedorRepository.save(vendedor);
        this.logger.log(
          `Password vendedor ${vendedor.email} hasheada correctamente.`,
        );
      } else {
        this.logger.log(
          `Password vendedor ${vendedor.email} ya estaba hasheada.`,
        );
      }
    }

    this.logger.log('Seeder vendedores finalizado.');
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
        totalEgresos: 0,
        totalIngresos: 0,
      });

      await this.sesionRepository.save(nuevaSesion);
      this.logger.log(`✅ Caja perpetua creada para ${adminInfo.nombre}.`);
    }

    // Migrar movimientos digitales existentes
    await this.migrarMovimientosDigitales();
  }

  async migrarMovimientosDigitales() {
    this.logger.log('🔄 Migrando movimientos digitales a cajas perpetuas...');
    
    const dataSource = this.sesionRepository.manager.connection;
    
    // Obtener sesiones perpetuas
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

    if (!sesionJavier || !sesionTobias) {
      this.logger.error('❌ No se encontraron las sesiones perpetuas.');
      return;
    }

    // Migrar movimientos Digital Javier
    const movimientosJavier = await dataSource.query(`
      SELECT * FROM cajas 
      WHERE "metodoPago" = 'Digital Javier' 
      AND "sesionCajaId" IS NULL
    `);

    for (const mov of movimientosJavier) {
      await dataSource.query(`
        UPDATE cajas 
        SET "sesionCajaId" = $1 
        WHERE id = $2
      `, [sesionJavier.id, mov.id]);
    }

    // Migrar movimientos Digital Tobias
    const movimientosTobias = await dataSource.query(`
      SELECT * FROM cajas 
      WHERE "metodoPago" = 'Digital Tobias' 
      AND "sesionCajaId" IS NULL
    `);

    for (const mov of movimientosTobias) {
      await dataSource.query(`
        UPDATE cajas 
        SET "sesionCajaId" = $1 
        WHERE id = $2
      `, [sesionTobias.id, mov.id]);
    }

    this.logger.log(`✅ Migrados ${movimientosJavier.length} movimientos a caja Javier`);
    this.logger.log(`✅ Migrados ${movimientosTobias.length} movimientos a caja Tobias`);
  }
}
