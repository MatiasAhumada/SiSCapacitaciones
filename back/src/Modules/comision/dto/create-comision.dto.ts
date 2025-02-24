import { IsUUID, IsDate, IsString } from 'class-validator';

export class CreateComisionDto {
  @IsString()
  name: string;

  @IsDate()
  fecInit: string;

  @IsUUID()
  cursoId: string;

  @IsUUID()
  profesorId: string;

  @IsUUID()
  sucursalId: string;
}
