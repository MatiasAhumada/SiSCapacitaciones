import {
  IsUUID,
  IsNumber,
  IsString,
  IsDate,
  IsEmail
} from 'class-validator';

export class CreateAlumnoDto {
  @IsUUID()
  id: string;

  @IsNumber()
  dni: number;

  @IsString()
  name: string;

  @IsDate()
  fNac: Date;

  @IsNumber()
  tel: number;

  @IsString()
  ocupation: string;

  @IsString()
  nationality: string;

  @IsString()
  address: string;

  @IsString()
  province: string;

  @IsString()
  locality: string;

  @IsEmail()
  email: string;

  @IsNumber()
  age: number;

  @IsString()
  gender: string;

  @IsUUID()
  sucursalId: string;
}
