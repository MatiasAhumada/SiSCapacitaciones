import { Comision } from 'src/Modules/comision/entities/comision.entity';
import { Profesor } from 'src/Modules/profesor/entities/profesor.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'cursos' })
export class Curso {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  duration: number;
  @Column()
  price: number;
  @Column()
  area: string;
  @ManyToOne(() => Profesor, (profesor) => profesor.cursos, {
    onDelete: 'SET NULL',
  })
  profesores: Profesor[];
  @OneToMany(() => Comision, (comision) => comision.curso)
  comisiones: Comision[];
}
