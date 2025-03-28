import { Type } from 'class-transformer';
import { IsUUID, IsDate, IsString, IsBoolean, IsNotEmpty, ValidateNested, IsObject } from 'class-validator';

class HourDto {
  @IsString()
  @IsNotEmpty()
  start: string;

  @IsString()
  @IsNotEmpty()
  end: string;
}

export class CreateComisionDto {
  @IsString()
  name: string;

  @IsString()
  day: string;
  
  @IsObject()
  @ValidateNested()
  @Type(() => HourDto) 
  hour: HourDto;
  @IsUUID()
  cursoId: string;

  @IsUUID()
  profesorId: string;

  @IsUUID()
  sucursalId: string;

 
}
