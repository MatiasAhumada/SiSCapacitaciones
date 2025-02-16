import { Admins } from 'src/Modules/admin/entities/admin.entity';
import { Alumno } from 'src/Modules/alumno/entities/alumno.entity';
import { Curso } from 'src/Modules/curso/entities/curso.entity';
import { Profesor } from 'src/Modules/profesor/entities/profesor.entity';
import { Vendedor } from 'src/Modules/vendedor/entities/vendedor.entity';
import {
  Admin,
  Column,
  Entity,
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
  //   @OneToMany(()=>Alumno, alumno=>alumno.sucursal)
  //   alumnos: string;
  //   @OneToMany(()=>Profesor, profesor=>profesor.sucursal)
  //   profesores: string;
  //   @OneToMany(()=>Curso, curso=>curso.sucursal)
  //   cursos: string;
  @ManyToOne(() => Vendedor, (vendedor) => vendedor.sucursales)
  vendedores: Vendedor[];
  @ManyToOne(() => Admins, (admin) => admin.sucursales)
  admin: Admin;
}
