import { Curso } from 'src/Modules/curso/entities/curso.entity';
import { Inscripcion } from 'src/Modules/inscripcion/entities/inscripcion.entity';
import { Profesor } from 'src/Modules/profesor/entities/profesor.entity';
import { Sucursal } from 'src/Modules/sucursal/entities/sucursal.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { AlumnoComision } from './alumnocomision.entity';
@Entity({
  name: 'comisiones',
})
export class Comision {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column()
  name: string;

  @Column()
  day: string;

  @Column('json', { nullable: true })
  hour: {
    start: string;
    end: string;
  };

  @ManyToOne(() => Curso, (curso) => curso.comisiones, { onDelete: 'SET NULL' })
  curso: Curso;

  @ManyToOne(() => Profesor, (profesor) => profesor.comisiones, {
    onDelete: 'SET NULL',
  })
  profesor: Profesor;

  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.comision)
  inscripciones: Inscripcion[];

  @OneToMany(() => AlumnoComision, (alumnoComision) => alumnoComision.comision)
  alumnoComisiones: AlumnoComision[];

  @ManyToOne(() => Sucursal, (sucursal) => sucursal.comisiones)
  sucursal: Sucursal;
}
