import { Comision } from "src/Modules/comision/entities/comision.entity";
import { Curso } from "src/Modules/curso/entities/curso.entity";
import { Sucursal } from "src/Modules/sucursal/entities/sucursal.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import {v4 as uuid} from "uuid"
@Entity({ name: "profesores" })

export class Profesor {
    @PrimaryGeneratedColumn("uuid")
    id: string=uuid();
    @Column()
    name: string;
    @Column()
    apellido: string;
    @Column()
    dni:number
    @ManyToMany(()=>Curso,curso=>curso.profesores)
    @JoinTable()
    cursos:Curso[]
    @OneToMany(()=>Comision,comision=>comision.profesor)
    comisiones:Comision[]
    @ManyToOne(()=>Sucursal,sucursal=>sucursal.profesores)
    sucursal:Sucursal
}
