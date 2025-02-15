import { Curso } from "src/Modules/curso/entities/curso.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import {v4 as uuid} from "uuid"
@Entity({ name: "profesores" })

export class Profesor {
    @PrimaryGeneratedColumn("uuid")
    id: string=uuid();
    @Column()
    nombre: string;
    @Column()
    apellido: string;
    @Column()
    dni:number
    @OneToMany(()=>Curso,curso=>curso.profesores)
    cursos:Curso[]

}
