import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { AlumnoComision } from './alumnocomision.entity';

@Entity('asistencia')
export class Asistencia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AlumnoComision, (alumnoComision) => alumnoComision.id)
  alumnoComision: AlumnoComision;

  @Column({ default: false }) 
  presente: boolean;

  @CreateDateColumn()
  fecha: Date; 
}
