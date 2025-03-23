import { IsUUID, IsBoolean, IsOptional, IsDateString } from 'class-validator';

export class CreateAsistenciaDto {
  @IsUUID()
  alumnoComisionId: string;

  @IsBoolean()
  presente: boolean;

  @IsOptional()
  @IsDateString()
  fecha?: string; 
}
