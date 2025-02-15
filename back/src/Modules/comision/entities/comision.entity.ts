import { Curso } from 'src/Modules/curso/entities/curso.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
@Entity({
  name: 'comisiones',
})
export class Comision {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();
  @Column()
  fecInit: Date;
  @ManyToOne(() => Curso, (curso) => curso.comisiones, { onDelete: 'SET NULL' })
  curso: Curso;
  
}
