import { IsNumber, IsString } from 'class-validator';

export class CreateCursoDto {
  @IsString()
  name: string;

  @IsNumber()
  duration: number;

  @IsNumber()
  price: number;

  @IsString()
  area: string;
}
