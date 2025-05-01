import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCertificadoDto } from './dto/create-certificado.dto';
import { UpdateCertificadoDto } from './dto/update-certificado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Certificado } from './entities/certificado.entity';
import { Repository } from 'typeorm';
import { Alumno } from '../alumno/entities/alumno.entity';
import { Curso } from '../curso/entities/curso.entity';

@Injectable()
export class CertificadoService {
  constructor(
    @InjectRepository(Certificado)
    private readonly certificadoRepository: Repository<Certificado>,
    @InjectRepository(Alumno)
    private readonly alumnoRepository: Repository<Alumno>,
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
  ) {}

  async create(
    createCertificadoDto: CreateCertificadoDto,
  ): Promise<Certificado> {
    const { numero, link, alumnoId, cursoId } = createCertificadoDto;

    const existingCertificate = await this.certificadoRepository.findOne({
      where: { numero },
    });
    if (existingCertificate) {
      throw new Error('Ya existe un certificado con este número');
    }

    const alumno = await this.alumnoRepository.findOne({
      where: { id: alumnoId },
    });
    if (!alumno) throw new NotFoundException('Alumno no encontrado');

    const curso = await this.cursoRepository.findOne({
      where: { id: cursoId },
    });
    if (!curso) throw new NotFoundException('Curso no encontrado');

    const certificado = this.certificadoRepository.create({
      numero: numero,
      link: link,
      alumno: alumno,
      curso: curso,
    });
    return this.certificadoRepository.save(certificado);
  }

  async findAll() {
    return this.certificadoRepository.find();
  }

  async findOneByNumber(numero: string) {
    return this.certificadoRepository.findOne({
      where: { numero: numero },
      select: {
        link: true,
      },
    });
  }

  async update(id: string, updateCertificadoDto: UpdateCertificadoDto) {
    return `This action updates a #${id} certificado`;
  }

  async remove(numero: number) {
    const deleted = await this.certificadoRepository.delete(numero);

    return deleted;
  }
}
