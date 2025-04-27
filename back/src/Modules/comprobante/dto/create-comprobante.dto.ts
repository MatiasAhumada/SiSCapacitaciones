import { MetodoPago } from '@modules/Modules/caja/entities/caja.entity';
import { IsDateString, IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateComprobanteDto {
  @IsString()
  apellidoNombre: string;

  @IsNumber()
  dni: number;

  @IsString()
  domicilioComercial: string;

  @IsString()
  iva: string;

  @IsDateString()
  fecha: string;

  @IsEnum(MetodoPago)
  formaPago: MetodoPago;

  @IsString()
  numero: string;

  @IsString()
  numeroSucursal: string;
  
  @IsString()
  observacion: string;

  @IsNumber()
  monto: number;
}
