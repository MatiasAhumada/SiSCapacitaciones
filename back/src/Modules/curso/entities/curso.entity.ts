import { Certificado } from 'src/Modules/certificado/entities/certificado.entity';
import { Comision } from 'src/Modules/comision/entities/comision.entity';
import { Profesor } from 'src/Modules/profesor/entities/profesor.entity';
import {
  Column,
  Entity,
  ManyToMany,
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

  @Column()
  tipo: string;

  @OneToMany(() => Comision, (comision) => comision.curso)
  comisiones: Comision[];

  @OneToMany(() => Certificado, (cert) => cert.curso)
  certificados: Certificado[];
}
