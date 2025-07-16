import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Categoria } from './categoria.entity';
import { Caja } from './caja.entity';

@Entity({
  name: 'subcategorias',
})
export class Subcategoria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @ManyToOne(() => Categoria, (cat) => cat.subcategorias)
  @JoinColumn()
  categoria: Categoria;

  @OneToMany(() => Caja, (caja) => caja.subcategoria)
  cajas: Caja[];
}
