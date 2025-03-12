import { Alumno } from 'src/Modules/alumno/entities/alumno.entity';
import { Curso } from 'src/Modules/curso/entities/curso.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'certificados',
})
export class Certificado {
  @PrimaryColumn()
  numero: number;

  @Column()
  link: string;

  @ManyToOne(() => Alumno, (alumno) => alumno.certificados)
  @JoinColumn({ name: 'alumno_id' })
  alumno: Alumno;

  @ManyToOne(() => Curso, (curso) => curso.certificados)
  @JoinColumn({ name: 'curso_id' })
  curso: Curso;
}
