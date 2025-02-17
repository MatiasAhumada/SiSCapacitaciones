import { Inscripcion } from 'src/Modules/inscripcion/entities/inscripcion.entity';
import { Sucursal } from 'src/Modules/sucursal/entities/sucursal.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
@Entity('vendedor')
export class Vendedor {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();
  @Column()
  name: string;
  @Column()
  email: string;
  @Column()
  tel: string;
  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.vendedor)
  inscripciones: Inscripcion[];
  @ManyToMany(() => Sucursal, (sucursal) => sucursal.vendedores)
  sucursales: Sucursal[];
}
