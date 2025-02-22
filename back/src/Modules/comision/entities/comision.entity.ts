import { Alumno } from 'src/Modules/alumno/entities/alumno.entity';
import { Curso } from 'src/Modules/curso/entities/curso.entity';
import { Inscripcion } from 'src/Modules/inscripcion/entities/inscripcion.entity';
import { Profesor } from 'src/Modules/profesor/entities/profesor.entity';
import { Sucursal } from 'src/Modules/sucursal/entities/sucursal.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
@Entity({
  name: 'comisiones',
})
export class Comision {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();
  
  @Column()
  fecInit: Date;
  @Column()
  name: string;

  @ManyToOne(() => Curso, (curso) => curso.comisiones, { onDelete: 'SET NULL' })
  curso: Curso;

  @ManyToOne(() => Profesor, (profesor) => profesor.comisiones, {
    onDelete: 'SET NULL',
  })
  profesor: Profesor;

  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.comision)
  inscripciones: Inscripcion[];

  @ManyToMany(() => Alumno, (alumno) => alumno.comisiones)
  @JoinTable()
  alumnos: Alumno[];

  @ManyToOne(() => Sucursal, (sucursal) => sucursal.comisiones)
  sucursal: Sucursal;
}
