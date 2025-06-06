import { Comprobante } from '@modules/Modules/comprobante/entities/comprobante.entity';
import { Profesor } from '@modules/Modules/profesor/entities/profesor.entity';
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
import { Subcategoria } from './subcategoria.entity';
import { Categoria } from './categoria.entity';
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

  @Column({
    type: 'enum',
    enum: TipoMovimiento,
    default: TipoMovimiento.INGRESO,
  })
  tipo: TipoMovimiento;

  @Column({ type: 'enum', enum: MetodoPago, default: MetodoPago.EFECTIVO })
  metodoPago: MetodoPago;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  monto: number;

  @Column({ type: 'text', nullable: true, default: '-' })
  descripcion?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @Column({ type: 'decimal', nullable: true, default: 0 })
  cuota?: number;

  @Column({ default: '0', nullable: true })
  descuento?: number;

  @ManyToOne(() => Vendedor, (vendedor) => vendedor.caja, { nullable: true })
  vendedor: Vendedor;

  @ManyToOne(() => AlumnoComision, (ac) => ac.pagos, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  alumnoComision?: AlumnoComision;

  @OneToOne(() => Comprobante, (comprobante) => comprobante.caja, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  comprobante?: Comprobante;

  @ManyToOne(() => Profesor, (profesor) => profesor.pagos, { nullable: true })
  @JoinColumn()
  profesor?: Profesor;

  @ManyToOne(() => Vendedor, (v) => v.pagosRealizados, { nullable: true })
  @JoinColumn()
  vendedorPagos?: Vendedor;
  
  @ManyToOne(() => Subcategoria, (sub) => sub.cajas, { nullable: true })
  @JoinColumn()
  subcategoria?: Subcategoria;
}
