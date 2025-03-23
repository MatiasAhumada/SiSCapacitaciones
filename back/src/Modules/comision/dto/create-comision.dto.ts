import { IsUUID, IsDate, IsString, IsBoolean } from 'class-validator';

export class CreateComisionDto {
  @IsString()
  name: string;

  @IsString()
  day: string;
  
  @IsString()
  hour: string;

  @IsUUID()
  cursoId: string;

  @IsUUID()
  profesorId: string;

  @IsUUID()
  sucursalId: string;

 
}
