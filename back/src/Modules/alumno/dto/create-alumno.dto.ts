import {
  IsUUID,
  IsNumber,
  IsString,
  IsDate,
  IsEmail,
  IsBoolean,
} from 'class-validator';

export class CreateAlumnoDto {
  @IsUUID()
  id: string;

  @IsString()
  dni: string;

  @IsString()
  name: string;

  @IsDate()
  fNac?: Date;

  @IsBoolean()
  state?: boolean;

  @IsNumber()
  tel?: number;
  
  @IsNumber()
  telex?: number;

  @IsString()
  ocupation?: string;

  @IsString()
  nationality?: string;

  @IsString()
  address?: string;

  @IsString()
  province?: string;

  @IsString()
  locality?: string;

  @IsEmail()
  email?: string;

  @IsNumber()
  age?: number;

  @IsString()
  gender?: string;

  @IsNumber()
  descuento?: number;

  @IsUUID()
  sucursalId?: string;
}
