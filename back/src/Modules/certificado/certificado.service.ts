import { Injectable } from '@nestjs/common';
import { CreateCertificadoDto } from './dto/create-certificado.dto';
import { UpdateCertificadoDto } from './dto/update-certificado.dto';

@Injectable()
export class CertificadoService {
  create(createCertificadoDto: CreateCertificadoDto) {
    return 'This action adds a new certificado';
  }

  findAll() {
    return `This action returns all certificado`;
  }

  findOne(id: number) {
    return `This action returns a #${id} certificado`;
  }

  update(id: number, updateCertificadoDto: UpdateCertificadoDto) {
    return `This action updates a #${id} certificado`;
  }

  remove(id: number) {
    return `This action removes a #${id} certificado`;
  }
}
