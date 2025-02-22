import { Comision } from 'src/Modules/comision/entities/comision.entity';
import { Inscripcion } from 'src/Modules/inscripcion/entities/inscripcion.entity';
import { Sucursal } from 'src/Modules/sucursal/entities/sucursal.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
@Entity({ name: 'alumnos' })
export class Alumno {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();
  @Column()
  dni: number;
  @Column()
  name: string;
  @Column()
  fNac: Date;
  @Column()
  tel: number;
  @Column()
  ocupation: string;
  @Column()
  nationality: string;
  @Column()
  address: string;
  @Column()
  province: string;
  @Column()
  locality: string;
  @Column()
  email: string;
  @Column()
  age: number;
  @Column()
  gender: string;
  @ManyToMany(() => Comision, (comision) => comision.alumnos)
  comisiones: Comision[];
  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.alumno)
  inscripciones: Inscripcion[];
  @ManyToOne(() => Sucursal, (sucursal) => sucursal.alumnos)
  sucursal: Sucursal[];
}
