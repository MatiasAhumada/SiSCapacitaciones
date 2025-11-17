import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { MetodoPago, TipoMovimiento } from '../entities/caja.entity';

export class IngresoSimpleDto {
  @IsEnum(TipoMovimiento)
  tipo: TipoMovimiento;

  @IsEnum(MetodoPago)
  metodoPago: MetodoPago;

  @IsNumber()
  monto: number;

  @IsString()
  descripcion: string;

  @IsDateString()
  @IsOptional()
  fecha?: Date;

  @IsUUID()
  vendedorId: string;
}
