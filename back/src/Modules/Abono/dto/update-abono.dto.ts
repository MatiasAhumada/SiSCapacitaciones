import { PartialType } from '@nestjs/mapped-types';
import { CreateAbonoDto } from './create-abono.dto';

export class UpdateAbonoDto extends PartialType(CreateAbonoDto) {}
