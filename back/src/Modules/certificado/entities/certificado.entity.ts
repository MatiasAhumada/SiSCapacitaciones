import { Alumno } from 'src/Modules/alumno/entities/alumno.entity';
import { Curso } from 'src/Modules/curso/entities/curso.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';

@Entity({
  name: 'certificados',
})
@Unique(['numero'])
export class Certificado {
  @PrimaryColumn()
  numero: string;

  @Column()
  link: string;

  @ManyToOne(() => Alumno, (alumno) => alumno.certificados)
  @JoinColumn({ name: 'alumno_id' })
  alumno: Alumno;

  @ManyToOne(() => Curso, (curso) => curso.certificados, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'curso_id' })
  curso: Curso;
}
