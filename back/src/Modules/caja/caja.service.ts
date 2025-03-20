import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCajaDto } from './dto/create-caja.dto';
import { UpdateCajaDto } from './dto/update-caja.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Caja } from './entities/caja.entity';
import { Repository } from 'typeorm';
import { Vendedor } from '../vendedor/entities/vendedor.entity';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Alumno } from '../alumno/entities/alumno.entity';
import { Comision } from '../comision/entities/comision.entity';
@Injectable()
export class CajaService {
  constructor(
    @InjectRepository(Caja)
    private readonly cajaRepository: Repository<Caja>,
    @InjectRepository(Vendedor)
    private readonly vendedorRepository: Repository<Vendedor>,
    @InjectRepository(Alumno)
    private readonly AlumnoRepository: Repository<Alumno>,
  ) {}

  async create(createCajaDto: CreateCajaDto) {
    const vendedor = await this.vendedorRepository.findOne({
      where: { id: createCajaDto.vendedorId },
    });
    if (!vendedor) {
      throw new NotFoundException('Vendedor no encontrado');
    }
    const alumno = await this.AlumnoRepository.find({
      where: { id: createCajaDto.alumnoId },
    });
    if (!alumno) {
      throw new NotFoundException('Alumno no encontrado');
    }
    const movimiento = this.cajaRepository.create({
      ...createCajaDto,
      vendedor: { id: createCajaDto.vendedorId },
      alumno: { id: createCajaDto.alumnoId },
    });

    return await this.cajaRepository.save(movimiento);
  }

  async findAll() {
    return this.cajaRepository.find({
      relations: ['vendedor', 'alumno'],
      select: {
        vendedor: {
          id: true,
          name: true,
        },
        alumno: {
          id: true,
          name: true,
        },
      },
    });
  }

  async findByVendedor(vendedorId: string) {
    const movimientos = await this.cajaRepository.find({
      where: { vendedor: { id: vendedorId } },
      relations: ['alumno'],
      select: {
        alumno: {
          id: true,
          name: true,
        },
      },
    });
    return movimientos.map((mov) => ({
      ...mov,
      fecha: format(new Date(mov.fecha), 'dd/MM/yyyy HH:mm', { locale: es }),
    }));
  }

  async findOne(id: string) {
    return `This action returns a #${id} caja`;
  }

  async update(id: string, updateCajaDto: UpdateCajaDto) {
    const { alumnoId, vendedorId, ...updateData } = updateCajaDto;
    const caja = await this.cajaRepository.findOne({
      where: { id },
      relations: ['alumno', 'vendedor'],
    });
    if (!caja) {
      throw new NotFoundException(`Caja con ID ${id} no encontrada`);
    }

    if (alumnoId) {
      const alumno = await this.AlumnoRepository.findOne({
        where: { id: alumnoId },
      });
      if (!alumno)
        throw new NotFoundException(`Alumno con ID ${alumnoId} no encontrado`);
      caja.alumno = alumno;
    }

    if (vendedorId) {
      const vendedor = await this.vendedorRepository.findOne({
        where: { id: vendedorId },
      });
      if (!vendedor)
        throw new NotFoundException(
          `Alumno con ID ${vendedorId} no encontrado`,
        );
      caja.vendedor = vendedor;
    }

    Object.assign(caja, updateData);

    return this.cajaRepository.save(caja);
  }

  async remove(id: string) {
    return this.cajaRepository.delete(id);
  }
}
