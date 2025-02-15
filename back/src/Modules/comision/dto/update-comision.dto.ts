import { PartialType } from '@nestjs/mapped-types';
import { CreateComisionDto } from './create-comision.dto';

export class UpdateComisionDto extends PartialType(CreateComisionDto) {}
