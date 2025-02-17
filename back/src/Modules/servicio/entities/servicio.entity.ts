import { Sucursal } from 'src/Modules/sucursal/entities/sucursal.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
@Entity({
  name: 'servicios',
})
export class Servicio {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();
  @Column()
  name: string;
  @Column()
  vencimiento: Date;
  @Column()
  monto: number;
  @Column()
  estado: string;
  @ManyToOne(() => Sucursal, (sucursal) => sucursal.servicios)
  sucursal: Sucursal;
}
