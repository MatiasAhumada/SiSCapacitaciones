import { Admins } from 'src/Modules/admin/entities/admin.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
@Entity({
  name: 'factura',
})
export class Factura {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();
  @Column()
  fecha: Date;
  @Column()
  monto: number;
  @Column()
  razonSocial: string;
  @Column()
  DNI: string;
  @Column()
  condIVA: string;
  @ManyToOne(() => Admins, (admin) => admin.facturas)
  admin: Admins;
}
