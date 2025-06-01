import { PartialType } from '@nestjs/mapped-types';
import { CreateCajaDto } from './create-caja.dto';
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { MetodoPago, TipoMovimiento } from '../entities/caja.entity';

export class EgresoCajaDTO  {
    @IsEnum(TipoMovimiento)
    tipo: TipoMovimiento = TipoMovimiento.EGRESO;
  
    @IsEnum(MetodoPago)
    metodoPago: MetodoPago;
  
    @IsNumber()
    monto: number;
  
    @IsOptional()
    descripcion?: string;
  
    @IsOptional()
    @IsUUID()
    vendedorId?: string;
  
    @IsOptional()
    @IsUUID()
    profesorId?: string;
  
    @IsUUID()
    subcategoriaId: string;
}