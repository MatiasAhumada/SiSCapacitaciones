import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateProfesorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsString()
  @IsNotEmpty()
  tel: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsUUID()
  @IsNotEmpty()
  sucursalId: string;
}
