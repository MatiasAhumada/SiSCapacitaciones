import { Inscripcion } from 'src/Modules/inscripcion/entities/inscripcion.entity';
import { Sucursal } from 'src/Modules/sucursal/entities/sucursal.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity('vendedor')
export class Vendedor {
  @PrimaryColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  email: string;
  @Column()
  tel: string;
  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.vendedor)
  inscripciones: Inscripcion[];
  @ManyToMany(() => Sucursal, (sucursal) => sucursal.vendedores)
  @JoinTable()
  sucursales: Sucursal[];
}
