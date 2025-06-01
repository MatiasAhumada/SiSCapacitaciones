import { Alumno } from 'src/Modules/alumno/entities/alumno.entity';
import { Comision } from 'src/Modules/comision/entities/comision.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Asistencia } from './asistencia.entity';
import { Caja } from 'src/Modules/caja/entities/caja.entity';

@Entity('alumno_comision')
export class AlumnoComision {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Alumno, (alumno) => alumno.alumnoComisiones)
  alumno: Alumno;

  @ManyToOne(() => Comision, (comision) => comision.alumnoComisiones,{
    onDelete:"CASCADE"
  })
  comision: Comision;

  @Column({ default: true })
  state: boolean;
  
  @OneToMany(() => Asistencia, (asistencia) => asistencia.alumnoComision)
  asistencias: Asistencia[];
  
  @OneToMany(() => Caja, (caja) => caja.alumnoComision)
  pagos: Caja[];
}
