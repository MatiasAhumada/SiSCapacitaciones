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

  @IsUUID()
  @IsNotEmpty()
  sucursalId: string;
}
