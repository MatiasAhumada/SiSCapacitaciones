import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Caja } from './caja.entity';
import { v4 as uuid } from 'uuid';

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

  @OneToMany(() => Caja, (movimiento) => movimiento.sesionCaja, {
    cascade: true,
  })
  movimientos: Caja[];
}
