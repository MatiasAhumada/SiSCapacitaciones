import { Admins } from 'src/Modules/admin/entities/admin.entity';
import { Alumno } from 'src/Modules/alumno/entities/alumno.entity';
import { Comision } from 'src/Modules/comision/entities/comision.entity';
import { Curso } from 'src/Modules/curso/entities/curso.entity';
import { Inscripcion } from 'src/Modules/inscripcion/entities/inscripcion.entity';
import { Profesor } from 'src/Modules/profesor/entities/profesor.entity';
import { Servicio } from 'src/Modules/servicio/entities/servicio.entity';
import { Vendedor } from 'src/Modules/vendedor/entities/vendedor.entity';
import {
  Admin,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
@Entity({
  name: 'sucursale',
})
export class Sucursal {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();
  @Column()
  nombre: string;
  @Column()
  localidad: string;
  @Column()
  provincia: string;
  @OneToMany(() => Alumno, (alumno) => alumno.sucursal)
  alumnos: Alumno[];
  @OneToMany(() => Profesor, (profesor) => profesor.sucursal)
  profesores: Profesor[];
  @OneToMany(() => Comision, (comisiones) => comisiones.sucursal)
  comisiones: Comision[];
  @ManyToMany(() => Vendedor, (vendedor) => vendedor.sucursales)
  @JoinTable()
  vendedores: Vendedor[];
  @ManyToOne(() => Admins, (admin) => admin.sucursales)
  admin: Admin;
  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.sucursal)
  inscripciones: Inscripcion[];
  @OneToMany(() => Servicio, (servicio) => servicio.sucursal)
  servicios: Servicio[];
}
