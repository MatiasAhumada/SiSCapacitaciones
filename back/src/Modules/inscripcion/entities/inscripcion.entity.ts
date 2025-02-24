import { Alumno } from 'src/Modules/alumno/entities/alumno.entity';
import { Comision } from 'src/Modules/comision/entities/comision.entity';
import { Sucursal } from 'src/Modules/sucursal/entities/sucursal.entity';
import { Vendedor } from 'src/Modules/vendedor/entities/vendedor.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
@Entity({
  name: 'inscripciones',
})
export class Inscripcion {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column()
  fechaRegistro: Date;

  @Column()
  formaPago: string;

  @Column()
  cuotaIngreso: number;
  @ManyToOne(() => Vendedor, (vendedor) => vendedor.inscripciones)
  vendedor: Vendedor;

  @ManyToOne(() => Alumno, (alumno) => alumno.inscripciones)
  alumno: Alumno;

  @ManyToOne(() => Comision, (comision) => comision.inscripciones)
  comision: Comision;

  @ManyToOne(() => Sucursal, (sucursal) => sucursal.inscripciones)
  sucursal: Sucursal;
}
