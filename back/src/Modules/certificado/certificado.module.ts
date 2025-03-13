import { Module } from '@nestjs/common';
import { CertificadoService } from './certificado.service';
import { CertificadoController } from './certificado.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alumno } from '../alumno/entities/alumno.entity';
import { Curso } from '../curso/entities/curso.entity';
import { Certificado } from './entities/certificado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Alumno, Curso, Certificado])],

  controllers: [CertificadoController],
  providers: [CertificadoService],
})
export class CertificadoModule {}
