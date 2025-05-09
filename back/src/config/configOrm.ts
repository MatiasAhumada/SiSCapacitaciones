import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { registerAs } from '@nestjs/config';
import { Admins } from 'src/Modules/admin/entities/admin.entity';
import { Alumno } from 'src/Modules/alumno/entities/alumno.entity';
import { Comision } from 'src/Modules/comision/entities/comision.entity';
import { Curso } from 'src/Modules/curso/entities/curso.entity';
import { Inscripcion } from 'src/Modules/inscripcion/entities/inscripcion.entity';
import { Profesor } from 'src/Modules/profesor/entities/profesor.entity';
import { Servicio } from 'src/Modules/servicio/entities/servicio.entity';
import { Sucursal } from 'src/Modules/sucursal/entities/sucursal.entity';
import { Vendedor } from 'src/Modules/vendedor/entities/vendedor.entity';
import { Caja } from 'src/Modules/caja/entities/caja.entity';
import { AlumnoComision } from 'src/Modules/comision/entities/alumnocomision.entity';
import { Asistencia } from 'src/Modules/comision/entities/asistencia.entity';
import { Certificado } from 'src/Modules/certificado/entities/certificado.entity';
import { Comprobante } from '@modules/Modules/comprobante/entities/comprobante.entity';

dotenvConfig({ path: '.env' });

const db_config = {
  type: 'postgres',
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  autoLoadEntities: true,
  synchronize: true ,
  dropSchema: false,
  logging: false,
  entities: [Admins,Alumno,Caja,Comision,Curso,Inscripcion,Profesor,Servicio,Sucursal,Vendedor,Caja,AlumnoComision,Asistencia,Certificado,Comprobante],
  migrationsRun: true,
  // entities: [Abono,Admins,Alumno,Comision,Curso,Inscripcion,Profesor,Servicio,Sucursal,Vendedor],
  migrations: ['dist/migrations/*.{js,ts}'],
};

export default registerAs('typeorm', () => db_config);
export const connectionSource = new DataSource(db_config as DataSourceOptions);
