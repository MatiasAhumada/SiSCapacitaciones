import { IsBoolean, IsEmail, IsString, IsUUID, IsOptional, IsArray } from 'class-validator';

export class CreateVendedorDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  tel: string;

  @IsString()
  password: string;

  @IsBoolean()
  isAdmin: boolean;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })  // Valida que cada elemento sea un UUID
  inscripciones: string[];  

  
  @IsUUID()  // Valida que cada sucursal sea un UUID
  sucursales: string;  // Cambié esto para que sea un array de IDs
}
