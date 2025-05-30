import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Subcategoria } from "./subcategoria.entity";

@Entity({
    name:"categorias"
})
export class Categoria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @OneToMany(() => Subcategoria, sub => sub.categoria)
  subcategorias: Subcategoria[];
}