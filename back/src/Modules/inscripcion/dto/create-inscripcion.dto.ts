import { IsUUID, IsDate, IsString, IsNumber } from 'class-validator';

export class CreateInscripcionDto {
  @IsDate()
  fechaRegistro: string;

  @IsString()
  formaPago: string;

  @IsNumber()
  cuotaIngreso: number;

  @IsUUID()
  vendedorId: string;

  @IsUUID()
  alumnoId: string;

  @IsUUID()
  comisionId: string;

  @IsUUID()
  sucursalId: string;
}

