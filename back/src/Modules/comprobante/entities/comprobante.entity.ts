import { Caja } from '@modules/Modules/caja/entities/caja.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { v4 as uuid } from 'uuid';
export enum MetodoPago {
  EFECTIVO = 'Efectivo',
  DEBITO = 'Debito',
  CREDITO = 'Credito',
  TRANSFERENCIA = 'Transferencia',
}
@Entity({
  name: 'comprobantes',
})
export class Comprobante {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column()
  apellidoNombre: string;

  @Column()
  dni: string;

  @Column()
  domicilioComercial: string;

  @Column()
  iva: string;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({
    type: 'enum',
    enum: MetodoPago,
  })
  formaPago: MetodoPago;

  @Column()
  observacion: string;

  @Column('decimal', { precision: 10, scale: 2 })
  monto: number;

  @Column()
  numero: string;

  @Column({nullable: true})
  tipoComprobante: string;

  @Column()
  numeroComprobante: string;

  @OneToOne(() => Caja, (caja) => caja.comprobante)
  caja: Caja;
}
