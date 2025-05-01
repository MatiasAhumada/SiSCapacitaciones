import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateCertificadoDto {
  @IsString()
  numero: string;
  @IsString()
  link: string;
  @IsUUID()
  alumnoId: string;
  @IsUUID()
  cursoId: string;
}
