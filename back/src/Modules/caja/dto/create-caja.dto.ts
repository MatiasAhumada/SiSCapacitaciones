import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { MetodoPago, TipoMovimiento } from '../entities/caja.entity';
import { Type } from 'class-transformer';
import { Comprobante } from '@modules/Modules/comprobante/entities/comprobante.entity';
import { CreateComprobanteDto } from '@modules/Modules/comprobante/dto/create-comprobante.dto';

export class CreateCajaDto {
  @IsEnum(TipoMovimiento)
  tipo: TipoMovimiento= TipoMovimiento.INGRESO;

  @IsEnum(MetodoPago)
  metodoPago: MetodoPago;

  @IsNumber()
  monto: number;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsDateString()
  fecha: Date ;

  @IsUUID()
  vendedorId: string;

  @IsUUID()
  @IsOptional()
  alumnoComisionId: string;

  @IsString()
  numeroSucursal:string

  @IsOptional()
  @IsNumber()
  cuota: number;

  @IsOptional()
  @ValidateNested()
  @Type(()=>CreateComprobanteDto)
  comprobante?: CreateComprobanteDto
}
