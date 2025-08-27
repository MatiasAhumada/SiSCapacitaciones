import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Profesor } from 'src/Modules/profesor/entities/profesor.entity';
import { Comision } from './comision.entity';

@Entity('asistencia_profesor')
export class AsistenciaProfesor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Profesor, (profesor) => profesor.asistencias)
  @JoinColumn({ name: 'profesor_id' })
  profesor: Profesor;

  @ManyToOne(() => Comision, { onDelete: 'CASCADE' })
  comision: Comision;

  @Column({ type: 'enum', enum: ['Presente', 'Ausente', 'Feriado'] })
  estado: 'Presente' | 'Ausente' | 'Feriado';

  @Column({ nullable: true })
  descripcion: string;

  @CreateDateColumn()
  fecha: Date;
}
