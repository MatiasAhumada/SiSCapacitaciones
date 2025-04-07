import { IsBoolean, IsString } from 'class-validator';

export class ChangeStateDto {
  @IsBoolean()
  estado: boolean;
  @IsString()
  alumnoCom: string;
}
