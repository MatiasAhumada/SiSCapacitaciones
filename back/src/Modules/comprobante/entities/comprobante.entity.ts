import { Caja } from '@modules/Modules/caja/entities/caja.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { v4 as uuid } from 'uuid';
 export enum FormaPago {
   EFECTIVO = 'Efectivo',
   CREDITO = 'Credito',
   DEBITO ='Digital Tobias' ,
   TRANSFERENCIA = 'Digital Javier',
 }
// export enum MetodoPago {
//   EFECTIVO = 'Efectivo',
//   CREDITO = 'Credito',
//   DIGITAL_TOBIAS = 'Digital Tobias',
//   DIGITAL_JAVIER = 'Digital Javier',
// }
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
    enum: FormaPago,
  })
  formaPago: FormaPago;

  @Column()
  observacion: string;

  @Column('decimal', { precision: 10, scale: 2 })
  monto: number;

  @Column()
  numero: string;

  @Column({ nullable: true })
  tipoComprobante: string;

  @Column()
  numeroComprobante: string;

  @OneToOne(() => Caja, (caja) => caja.comprobante)
  caja: Caja;
}
