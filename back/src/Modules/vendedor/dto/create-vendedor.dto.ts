import {
  IsBoolean,
  IsEmail,
  IsString,
  IsUUID,
  IsOptional,
  IsArray,
} from 'class-validator';

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
  @IsUUID('all', { each: true }) // Valida que cada elemento sea un UUID
  inscripciones: string[];

  @IsArray()
  @IsUUID('all', { each: true })
  sucursal: string[];
}
