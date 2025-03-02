import { Alumno } from "src/Modules/alumno/entities/alumno.entity";
import { Sucursal } from "src/Modules/sucursal/entities/sucursal.entity";
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import{v4 as uuid} from "uuid";

@Entity({
    name:"abonos"
})
export class Abono {
    @PrimaryGeneratedColumn("uuid")
    id: string=uuid();
    @Column()
    fecha:string
    @Column()
    cuota:string
    @Column()
    monto:number
    @Column()
    sucursalId:string
    @Column()
    comisionId:string
    @ManyToOne(()=>Alumno,alumno=>alumno.abonos,{ onDelete: 'CASCADE' })
    alumno:Alumno

}
