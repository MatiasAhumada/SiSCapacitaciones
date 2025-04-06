import { Alumno } from 'src/Modules/alumno/entities/alumno.entity';
import { Vendedor } from 'src/Modules/vendedor/entities/vendedor.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
export enum TipoMovimiento {
  INGRESO = 'ingreso',
  EGRESO = 'egreso',
  TRANSFERENCIA = 'transferencia',
}
export enum MetodoPago {
  EFECTIVO = 'efectivo',
  DEBITO = 'debito',
  CREDITO = 'credito',
  TRANSFERENCIA = 'transferencia',
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

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @Column({ type: 'decimal', nullable: true })
  cuota: number;

  @ManyToOne(() => Vendedor, (vendedor) => vendedor.caja)
  vendedor: Vendedor;

  @ManyToOne(() => Alumno, (alumno) => alumno.pagos, { nullable: true })
  alumno?: Alumno;
}
