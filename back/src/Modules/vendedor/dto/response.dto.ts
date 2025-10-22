import { IsString, IsBoolean, IsArray, IsNumber } from 'class-validator';
import { Inscripcion } from 'src/Modules/inscripcion/entities/inscripcion.entity';
import { Sucursal } from 'src/Modules/sucursal/entities/sucursal.entity';

export class VendedorResponseDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsBoolean()
  isAdmin: boolean;

  @IsArray()
  inscripciones: Inscripcion[];

  @IsArray()
  sucursales: Sucursal[];

  @IsNumber()
  totalInscripciones: number;
}
