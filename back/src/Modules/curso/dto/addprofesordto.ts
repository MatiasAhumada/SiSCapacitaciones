import { IsUUID } from "class-validator";

export class AddProfesorDto {
    @IsUUID("4")
    cursoId: string;
  
    @IsUUID("4", { each: true })
    profesoresIds: string[];
  }
  