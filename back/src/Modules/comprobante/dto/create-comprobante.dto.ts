import { IsDateString, IsEnum, IsNumber, IsString } from 'class-validator';
import { FormaPago } from '../entities/comprobante.entity';

export class CreateComprobanteDto {
  @IsString()
  apellidoNombre: string;

  @IsString()
  dni: string;

  @IsString()
  domicilioComercial: string;

  @IsString()
  iva: string;

  @IsDateString()
  fecha: string;

  @IsString()
  tipoComprobante: string;

  @IsEnum(FormaPago)
  formaPago: FormaPago;

  @IsString()
  numero: string;

  @IsString()
  numeroSucursal: string;

  @IsString()
  observacion: string;

  @IsNumber()
  monto: number;
}
