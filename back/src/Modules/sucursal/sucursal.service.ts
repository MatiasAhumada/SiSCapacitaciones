import { Injectable } from '@nestjs/common';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';
import { SucursalRepository } from './sucursal.repository';

@Injectable()
export class SucursalService {
  constructor(private sucursales: SucursalRepository) {}

  getSucursales() {
    return this.sucursales.getSucursales();
  }

  getByIdSucursal(id: number) {
    return `This action returns a #${id} sucursal`;
  }
  createSuc(createSucursalDto: CreateSucursalDto) {
    return 'This action adds a new sucursal';
  }

  updateSuc(id: number, updateSucursalDto: UpdateSucursalDto) {
    return `This action updates a #${id} sucursal`;
  }

  removeSuc(id: number) {
    return `This action removes a #${id} sucursal`;
  }
}
