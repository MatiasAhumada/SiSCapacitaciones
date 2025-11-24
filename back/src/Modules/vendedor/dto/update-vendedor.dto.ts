import { PartialType } from '@nestjs/mapped-types';
import { CreateVendedorDto } from './create-vendedor.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateVendedorDto extends PartialType(CreateVendedorDto) {
  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  img?: string;
}
