import { PartialType } from '@nestjs/mapped-types';
import { CreateAlumnoDto } from './create-alumno.dto';
import { IsString } from 'class-validator';

export class UpdateAlumnoDto extends PartialType(CreateAlumnoDto) {
    @IsString()
    imgUrl: string;
}
