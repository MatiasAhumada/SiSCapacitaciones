import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vendedor } from '../vendedor/entities/vendedor.entity';
import { Alumno } from '../alumno/entities/alumno.entity';
import { Comision } from '../comision/entities/comision.entity';
import { Sucursal } from '../sucursal/entities/sucursal.entity';
import { Repository } from 'typeorm';
import { Inscripcion } from './entities/inscripcion.entity';
import { AlumnoComision } from '../comision/entities/alumnocomision.entity';
import { PdfService } from '../pdf/pdf.service';
import { MailService } from '../mail/mail.service';
import { ImagesService } from '../images/images.service';

@Injectable()
export class InscripcionService {
  constructor(
    @InjectRepository(Vendedor)
    private readonly vendedorRepository: Repository<Vendedor>,
    @InjectRepository(Alumno)
    private readonly alumnoRepository: Repository<Alumno>,
    @InjectRepository(Comision)
    private readonly comisionRepository: Repository<Comision>,
    @InjectRepository(Sucursal)
    private readonly sucursalRepository: Repository<Sucursal>,
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
    @InjectRepository(AlumnoComision)
    private readonly alumnoComisionRepository: Repository<AlumnoComision>,
    private readonly pdfService: PdfService,
    private readonly mailService: MailService,
    private readonly imagesService: ImagesService,
  ) {}

  async create(createInscripcionDto: CreateInscripcionDto) {
    const {
      vendedorId,
      alumnoId,
      comisionId,
      sucursalId,
      fechaRegistro,
      state,
    } = createInscripcionDto;
    const vendedor = await this.vendedorRepository.findOne({
      where: { id: vendedorId },
    });
    const alumno = await this.alumnoRepository.findOne({
      where: { dni: alumnoId },
    });
    const comision = await this.comisionRepository.findOne({
      where: { id: comisionId },
      relations: ['alumnoComisiones'],
    });
    const sucursal = await this.sucursalRepository.findOne({
      where: { id: sucursalId },
    });

    if (!vendedor || !alumno || !comision || !sucursal) {
      throw new NotFoundException('Uno o más IDs proporcionados no existen');
    }

    const alumnoComisionExistente = await this.alumnoComisionRepository.findOne(
      {
        where: { alumno: { dni: alumnoId }, comision: { id: comisionId } },
      },
    );

    if (!alumnoComisionExistente) {
      // Si no existe, se crea una nueva relación entre el alumno y la comisión con el estado
      const alumnoComision = this.alumnoComisionRepository.create({
        alumno,
        comision,
        state: state || true, // Si no se pasa el estado, se considera activo por defecto
      });
      await this.alumnoComisionRepository.save(alumnoComision);
    }

    const inscripcion = this.inscripcionRepository.create({
      fechaRegistro,
      vendedor,
      alumno,
      comision,
      sucursal,
      firmado: false,
    });
    const insc = await this.inscripcionRepository.save(inscripcion);

    // Enviar email solicitando firma con PDF adjunto
    if (alumno.email) {
      try {
        const inscripcionCompleta = await this.inscripcionRepository.findOne({
          where: { id: insc.id },
          relations: ['vendedor', 'alumno', 'comision', 'sucursal'],
        });
        const pdfBuffer =
          await this.pdfService.generarInscripcionPDF(inscripcionCompleta);
        await this.mailService.sendContractSignRequest(
          alumno.email,
          alumno.name,
          insc.id,
          pdfBuffer,
        );
      } catch (error) {
        console.error('Error enviando email de solicitud de firma:', error);
      }
    }

    return await this.findOne(insc.id);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    vendedorId?: string,
    fecha?: string,
  ) {
    const skip = (page - 1) * limit;

    const queryBuilder = this.inscripcionRepository
      .createQueryBuilder('inscripcion')
      .leftJoinAndSelect('inscripcion.vendedor', 'vendedor')
      .leftJoinAndSelect('inscripcion.alumno', 'alumno')
      .leftJoinAndSelect('inscripcion.comision', 'comision')
      .leftJoinAndSelect('inscripcion.sucursal', 'sucursal')
      .select([
        'inscripcion',
        'vendedor.id',
        'vendedor.name',
        'alumno.id',
        'alumno.name',
        'alumno.dni',
        'comision.id',
        'comision.name',
        'sucursal.id',
        'sucursal.name',
      ])
      .orderBy('inscripcion.fechaRegistro', 'DESC');

    if (vendedorId) {
      queryBuilder.andWhere('vendedor.id = :vendedorId', { vendedorId });
    }

    if (fecha) {
      queryBuilder.andWhere('DATE(inscripcion.fechaRegistro) = :fecha', {
        fecha,
      });
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const statsQuery = this.inscripcionRepository
      .createQueryBuilder('inscripcion')
      .select('vendedor.id', 'vendedorId')
      .addSelect('vendedor.name', 'vendedorName')
      .addSelect('COUNT(inscripcion.id)', 'count')
      .leftJoin('inscripcion.vendedor', 'vendedor')
      .groupBy('vendedor.id')
      .addGroupBy('vendedor.name');

    if (vendedorId) {
      statsQuery.where('vendedor.id = :vendedorId', { vendedorId });
    }

    const statsByVendedor = await statsQuery.getRawMany();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      statsByVendedor: statsByVendedor.map((stat) => ({
        id: stat.vendedorId,
        name: stat.vendedorName,
        count: parseInt(stat.count),
      })),
    };
  }

  async findByVendedor(
    vendedorId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.inscripcionRepository.findAndCount({
      where: { vendedor: { id: vendedorId } },
      relations: ['vendedor', 'alumno', 'comision', 'sucursal'],
      select: {
        vendedor: {
          id: true,
          name: true,
        },
        alumno: {
          id: true,
          name: true,
          dni: true,
        },
        comision: {
          id: true,
          name: true,
        },
        sucursal: {
          id: true,
          name: true,
        },
      },
      order: {
        fechaRegistro: 'DESC',
      },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    return this.inscripcionRepository.findOne({
      where: { id },
      relations: ['vendedor', 'alumno', 'comision', 'sucursal'],
      select: {
        vendedor: {
          id: true,
          name: true,
        },
        alumno: {
          id: true,
          name: true,
        },
        comision: {
          id: true,
          name: true,
        },
        sucursal: {
          id: true,
          name: true,
        },
      },
    });
  }

  async update(id: string, updateInscripcionDto: UpdateInscripcionDto) {
    return `This action updates a #${id} inscripcion`;
  }

  async remove(id: string) {
    const deleted = await this.inscripcionRepository.delete(id);
    if (deleted.affected === 0) {
      throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
    }
    return `Inscripción con ID ${id} eliminada`;
  }

  async generarPDF(id: string): Promise<Buffer> {
    const inscripcion = await this.inscripcionRepository.findOne({
      where: { id },
      relations: ['vendedor', 'alumno', 'comision', 'sucursal'],
    });

    if (!inscripcion) {
      throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
    }

    return this.pdfService.generarInscripcionPDF(inscripcion);
  }

  async firmarContrato(id: string, firmaBase64: string) {
    const inscripcion = await this.inscripcionRepository.findOne({
      where: { id },
      relations: ['alumno', 'vendedor', 'comision', 'sucursal'],
    });

    if (!inscripcion) {
      throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
    }

    if (inscripcion.firmado) {
      throw new Error('Este contrato ya ha sido firmado');
    }

    const base64Data = firmaBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const file: Express.Multer.File = {
      buffer,
      originalname: `firma-${id}.png`,
      mimetype: 'image/png',
      fieldname: 'image',
      encoding: '7bit',
      size: buffer.length,
      stream: null as any,
      destination: '',
      filename: '',
      path: '',
    };

    const firmaUrl = await this.imagesService.uploadImage(file);

    inscripcion.firmaUrl = firmaUrl;
    inscripcion.fechaFirma = new Date();
    inscripcion.firmado = true;

    await this.inscripcionRepository.save(inscripcion);

    if (inscripcion.alumno.email) {
      try {
        const pdfBuffer =
          await this.pdfService.generarInscripcionPDF(inscripcion);
        await this.mailService.sendSignedContract(
          inscripcion.alumno.email,
          inscripcion.alumno.name,
          pdfBuffer,
        );
      } catch (error) {
        console.error('Error enviando contrato firmado:', error);
      }
    }

    return inscripcion;
  }
}
