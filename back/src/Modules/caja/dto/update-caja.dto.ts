import { PartialType } from '@nestjs/mapped-types';
import { CreateCajaDto } from './create-caja.dto';
import { IsString } from 'class-validator';

export class UpdateCajaDto extends PartialType(CreateCajaDto) {}
