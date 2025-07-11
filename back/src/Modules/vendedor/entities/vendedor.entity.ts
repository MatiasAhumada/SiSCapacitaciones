import { SesionCaja } from '@modules/Modules/caja/entities/sesion-caja.entity';
import { Caja } from 'src/Modules/caja/entities/caja.entity';
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
@Entity('vendedores')
export class Vendedor {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();
  @Column()
  name: string;
  @Column()
  email: string;
  @Column()
  tel: string;
  @Column()
  password: string;
  @Column()
  isAdmin: boolean;

  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.vendedor, {
    onDelete: 'CASCADE',
  })
  inscripciones: Inscripcion[];
  @ManyToMany(() => Sucursal, (sucursal) => sucursal.vendedores, {
    onDelete: 'CASCADE',
  })
  sucursales: Sucursal[];
  @OneToMany(() => Caja, (caja) => caja.vendedorPagos)
  pagosRealizados: Caja[];

  @OneToMany(() => Caja, (caja) => caja.vendedor)
  caja: Caja[];
  
  @OneToMany(() => SesionCaja, (sesionCaja) => sesionCaja.vendedor)
  sesionesCaja: SesionCaja[];
}
