import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import { InscripcionService } from './inscripcion.service';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';
import { Response } from 'express';

@Controller('inscripcion')
export class InscripcionController {
  constructor(private readonly inscripcionService: InscripcionService) {}

  @Post()
  create(@Body() createInscripcionDto: CreateInscripcionDto) {
    return this.inscripcionService.create(createInscripcionDto);
  }

  @Post(':id/firmar')
  firmarContrato(@Param('id') id: string, @Body('firmaBase64') firmaBase64: string) {
    return this.inscripcionService.firmarContrato(id, firmaBase64);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('vendedorId') vendedorId?: string,
    @Query('fecha') fecha?: string,
  ) {
    return this.inscripcionService.findAll(
      parseInt(page),
      parseInt(limit),
      vendedorId,
      fecha,
    );
  }

  @Get('vendedor/:vendedorId')
  findByVendedor(
    @Param('vendedorId') vendedorId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.inscripcionService.findByVendedor(
      vendedorId,
      parseInt(page),
      parseInt(limit),
    );
  }

  @Get(':id/pdf')
  async descargarPDF(@Param('id') id: string, @Res() res: Response) {
    const pdf = await this.inscripcionService.generarPDF(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=inscripcion-${id}.pdf`,
    });
    res.send(pdf);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inscripcionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInscripcionDto: UpdateInscripcionDto,
  ) {
    return this.inscripcionService.update(id, updateInscripcionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inscripcionService.remove(id);
  }
}
