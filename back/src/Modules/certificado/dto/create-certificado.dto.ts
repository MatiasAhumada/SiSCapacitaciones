import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateCertificadoDto {
  @IsNumber()
  numero: number;
  @IsString()
  link: string;
  @IsUUID()
  alumnoId: string;
  @IsUUID()
  cursoId: string;
}
