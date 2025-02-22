import { IsString, IsUUID, IsArray } from 'class-validator';
import { Alumno } from 'src/Modules/alumno/entities/alumno.entity';
import { Profesor } from 'src/Modules/profesor/entities/profesor.entity';
import { Comision } from 'src/Modules/comision/entities/comision.entity';
import { Vendedor } from 'src/Modules/vendedor/entities/vendedor.entity';
import { Admins } from 'src/Modules/admin/entities/admin.entity';
import { Inscripcion } from 'src/Modules/inscripcion/entities/inscripcion.entity';
import { Servicio } from 'src/Modules/servicio/entities/servicio.entity';

export class CreateSucursalDto {
  @IsString()
  name: string;

  @IsString()
  localidad: string;

  @IsString()
  provincia: string;

  @IsUUID()
  adminId: string; 

  @IsArray()
  @IsUUID('all', { each: true })
  vendedores: string[]; 

  @IsArray()
  @IsUUID('all', { each: true })
  alumnos: string[];

  @IsArray()
  @IsUUID('all', { each: true })
  profesores: string[];

  @IsArray()
  @IsUUID('all', { each: true })
  comisiones: string[];

  @IsArray()
  @IsUUID('all', { each: true })
  inscripciones: string[];

  @IsArray()
  @IsUUID('all', { each: true })
  servicios: string[];
}
