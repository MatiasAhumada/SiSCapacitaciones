import { Injectable } from '@nestjs/common';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';

@Injectable()
export class InscripcionService {
  create(createInscripcionDto: CreateInscripcionDto) {
    return 'This action adds a new inscripcion';
  }

  findAll() {
    return `This action returns all inscripcion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inscripcion`;
  }

  update(id: number, updateInscripcionDto: UpdateInscripcionDto) {
    return `This action updates a #${id} inscripcion`;
  }

  remove(id: number) {
    return `This action removes a #${id} inscripcion`;
  }
}
