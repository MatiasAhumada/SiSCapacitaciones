import { Comision } from 'src/Modules/comision/entities/comision.entity';
import { Inscripcion } from 'src/Modules/inscripcion/entities/inscripcion.entity';
import { Column, Entity, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: 'alumnos' })
export class Alumno {
  @PrimaryColumn()
  dni: number;
  @Column()
  apeNom: string;
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
  @OneToMany(()=>Inscripcion,inscripcion=>inscripcion.alumno)
  inscripciones: Inscripcion[];
}
