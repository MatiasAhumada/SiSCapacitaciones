import { IsArray, IsNumber, IsString, IsUUID } from "class-validator";

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
  