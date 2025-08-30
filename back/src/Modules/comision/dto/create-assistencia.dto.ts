import { IsArray, IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateAsistenciaDto {
  @IsArray()
  @IsString({ each: true })
  alumnosComisionIds: string[];

  @IsString()
  profesorId: string;

  @IsString()
  comisionId: string;

  @IsDateString()
  fecha: Date;

  @IsEnum(['Presente', 'Ausente', 'Feriado'])
  estadoProfesor: 'Presente' | 'Ausente' | 'Feriado';

  @IsOptional()
  @IsString()
  descripcion?: string;
}
