import { SesionCaja } from '@modules/Modules/caja/entities/sesion-caja.entity';
import { Sucursal } from 'src/Modules/sucursal/entities/sucursal.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
@Entity({
  name: 'admins',
})
export class Admins {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();
  @Column()
  name: string;
  @Column()
  password: string;
  @Column()
  isAdmin: boolean;
  @Column({ type: 'text', nullable: true })
  img: string;
  @OneToMany(() => Sucursal, (sucursal) => sucursal.admin)
  sucursales: Sucursal[];
  @OneToMany(() => SesionCaja, (sesionCaja) => sesionCaja.admin)
  sesionesCaja: SesionCaja[];
}
