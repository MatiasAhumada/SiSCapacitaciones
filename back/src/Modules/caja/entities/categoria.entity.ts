import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Subcategoria } from './subcategoria.entity';
import { Caja } from './caja.entity';

@Entity({
  name: 'categorias',
})
export class Categoria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  // @OneToMany(() => Caja, (c) => c.categoria)
  // cajas?: Caja[];

  @OneToMany(() => Subcategoria, (sub) => sub.categoria)
  subcategorias: Subcategoria[];
}
