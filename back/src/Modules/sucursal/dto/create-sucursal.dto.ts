import { IsString, IsUUID, IsArray, IsNumber } from 'class-validator';

export class CreateSucursalDto {
  @IsString()
  name: string;

  @IsNumber()
  numeroSucursal: number;

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
