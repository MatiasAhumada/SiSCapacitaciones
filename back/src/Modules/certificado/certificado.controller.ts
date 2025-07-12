import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CertificadoService } from './certificado.service';
import { CreateCertificadoDto } from './dto/create-certificado.dto';
import { UpdateCertificadoDto } from './dto/update-certificado.dto';

@Controller('certificado')
export class CertificadoController {
  constructor(private readonly certificadoService: CertificadoService) {}

  @Post()
  create(@Body() createCertificadoDto: CreateCertificadoDto) {
    return this.certificadoService.create(createCertificadoDto);
  }

  @Get()
  findAll() {
    return this.certificadoService.findAll();
  }

  @Get(':number')
  findOne(@Param('number') numero: string) {
    return this.certificadoService.findOneByNumber(numero);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCertificadoDto: UpdateCertificadoDto,
  ) {
    return this.certificadoService.update(id, updateCertificadoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.certificadoService.remove(id);
  }
}
