import { IsUUID, IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';
import { MetodoPago } from '../entities/caja.entity';

export class CreateTransferenciaDto {
  @IsDateString()
  fecha: string;

  @IsString()
  metodoPago: MetodoPago;

  @IsNumber()
  monto: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsUUID()
  vendedorOrigenId: string;

  @IsUUID()
  vendedorDestinoId: string;
}
