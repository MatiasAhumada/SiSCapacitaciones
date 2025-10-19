import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Caja } from './caja.entity';
import { v4 as uuid } from 'uuid';
import { Vendedor } from '@modules/Modules/vendedor/entities/vendedor.entity';
import { Admins } from '@modules/Modules/admin/entities/admin.entity';

@Entity({
  name: 'sesiones_caja',
})
export class SesionCaja {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaApertura: Date;

  @Column({ type: 'timestamp', nullable: true })
  fechaCierre?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  montoApertura: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  montoCierre?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalIngresos: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalEgresos: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalDigitalJavier: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalDigitalTobias: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalCredito: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalEfectivo: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalFerro: number;

  @OneToMany(() => Caja, (movimiento) => movimiento.sesionCaja, {
    cascade: true,
  })
  movimientos: Caja[];

  @ManyToOne(() => Vendedor, (vendedor) => vendedor.sesionesCaja, {
    nullable: true,
  })
  @JoinColumn({ name: 'vendedorId' })
  vendedor: Vendedor;

  @ManyToOne(() => Admins, (admin) => admin.sesionesCaja, {
    nullable: true,
  })
  @JoinColumn({ name: 'adminId' })
  admin: Admins;
}
