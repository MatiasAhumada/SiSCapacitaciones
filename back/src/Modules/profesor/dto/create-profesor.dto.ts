import { IsString, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateProfesorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsNumber()
  @IsNotEmpty()
  dni: number;

  @IsUUID()
  @IsNotEmpty()
  sucursalId: string;
}

