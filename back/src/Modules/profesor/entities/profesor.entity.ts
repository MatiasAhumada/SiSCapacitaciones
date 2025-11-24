import { Caja } from '@modules/Modules/caja/entities/caja.entity';
import { AsistenciaProfesor } from '@modules/Modules/comision/entities/asistencia-profesor.entity';
import { Comision } from 'src/Modules/comision/entities/comision.entity';
import { Sucursal } from 'src/Modules/sucursal/entities/sucursal.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
@Entity({ name: 'profesores' })
export class Profesor {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column()
  name: string;

  @Column()
  apellido: string;

  @Column()
  tel: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  direccion: string;

  @OneToMany(() => Comision, (comision) => comision.profesor)
  comisiones: Comision[];

  @ManyToOne(() => Sucursal, (sucursal) => sucursal.profesores)
  sucursal: Sucursal;

  @OneToMany(() => Caja, (caja) => caja.profesor)
  pagos: Caja[];

  @OneToMany(() => AsistenciaProfesor, (asistencia) => asistencia.profesor)
  asistencias: AsistenciaProfesor[];
}
