import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { MetodoPago, TipoMovimiento } from '../entities/caja.entity';

export class CreateCajaDto {
  @IsEnum(TipoMovimiento)
  tipo: TipoMovimiento;

  @IsEnum(MetodoPago)
  metodoPago: MetodoPago;

  @IsNumber()
  monto: number;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsDateString()
  fecha: string;

  @IsUUID()
  vendedorId: string;

  @IsUUID()
  @IsOptional()
  alumnoComisionId: string;

  @IsOptional()
  @IsNumber()
  cuota: number;
  
}
