import { Comprobante } from '@modules/Modules/comprobante/entities/comprobante.entity';
import { Alumno } from 'src/Modules/alumno/entities/alumno.entity';
import { AlumnoComision } from 'src/Modules/comision/entities/alumnocomision.entity';
import { Comision } from 'src/Modules/comision/entities/comision.entity';
import { Vendedor } from 'src/Modules/vendedor/entities/vendedor.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
export enum TipoMovimiento {
  INGRESO = 'Ingreso',
  EGRESO = 'Egreso',
  TRANSFERENCIA = 'Transferencia',
}

export enum MetodoPago {
  EFECTIVO = 'Efectivo',
  CREDITO = 'Credito',
  DIGITAL_TOBIAS = 'Digital Tobias',
  DIGITAL_JAVIER = 'Digital Javier',
}

@Entity({
  name: 'cajas',
})
export class Caja {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'enum', enum: TipoMovimiento })
  tipo: TipoMovimiento;

  @Column({ type: 'enum', enum: MetodoPago })
  metodoPago: MetodoPago;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  monto: number;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @Column({ type: 'decimal', nullable: true })
  cuota?: number;

  @Column({ default: '0', nullable: true })
  descuento?: number;

  @ManyToOne(() => Vendedor, (vendedor) => vendedor.caja)
  vendedor: Vendedor;

  @ManyToOne(() => AlumnoComision, (ac) => ac.pagos, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  alumnoComision?: AlumnoComision;

  @OneToOne(() => Comprobante, { cascade: true })
  @JoinColumn()
  comprobante?: Comprobante;
}
