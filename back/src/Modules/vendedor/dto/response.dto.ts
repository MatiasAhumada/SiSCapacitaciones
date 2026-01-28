import {
  IsString,
  IsBoolean,
  IsArray,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Inscripcion } from 'src/Modules/inscripcion/entities/inscripcion.entity';
import { Sucursal } from 'src/Modules/sucursal/entities/sucursal.entity';

export class VendedorResponseDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  tel?: string;

  @IsString()
  @IsOptional()
  img?: string;

  @IsBoolean()
  isAdmin: boolean;

  @IsArray()
  inscripciones: Inscripcion[];

  @IsArray()
  sucursales: Sucursal[];

  @IsArray()
  @IsOptional()
  comisiones?: { id: string; name: string }[];

  @IsNumber()
  totalInscripciones: number;
}
