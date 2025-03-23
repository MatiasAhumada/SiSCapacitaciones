import { Alumno } from 'src/Modules/alumno/entities/alumno.entity';
import { Comision } from 'src/Modules/comision/entities/comision.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('alumno_comision')
export class AlumnoComision {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Alumno, (alumno) => alumno.id)
  alumno: Alumno;

  @ManyToOne(() => Comision, (comision) => comision.id)
  comision: Comision;

  @Column({ default: true })
  state: boolean; 
}
