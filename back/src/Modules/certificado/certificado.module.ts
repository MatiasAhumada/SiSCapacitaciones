import { Module } from '@nestjs/common';
import { CertificadoService } from './certificado.service';
import { CertificadoController } from './certificado.controller';

@Module({
  controllers: [CertificadoController],
  providers: [CertificadoService],
})
export class CertificadoModule {}
