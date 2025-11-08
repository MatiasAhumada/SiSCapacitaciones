import { IsString, IsUUID } from 'class-validator';

export class TransferAlumnoDto {
  @IsUUID()
  alumnoComisionId: string;

  @IsUUID()
  nuevaComisionId: string;
}
