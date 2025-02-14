import {  Injectable } from '@nestjs/common';


@Injectable()
export class SucursalRepository {
  private sucursales = [
    {
      ID: 1,
      Nombre: 'Sucursal Centro',
      Localidad: 'Centro',
      Provincia: 'Tucuman',
      Profesores: [
        { id: 1, nombre: 'Profesor 1' },
        { id: 2, nombre: 'Profesor 2' },
        { id: 3, nombre: 'Profesor 3' },
        { id: 4, nombre: 'Profesor 4' },
        { id: 5, nombre: 'Profesor 5' },
        { id: 6, nombre: 'Profesor 6' },
        { id: 7, nombre: 'Profesor 7' },
        { id: 8, nombre: 'Profesor 8' },
        { id: 9, nombre: 'Profesor 9' },
        { id: 10, nombre: 'Profesor 10' },
      ],
      Cursos: [
        { id: 1, nombre: 'Curso 1' },
        { id: 2, nombre: 'Curso 2' },
        { id: 3, nombre: 'Curso 3' },
        { id: 4, nombre: 'Curso 4' },
        { id: 5, nombre: 'Curso 5' },
        { id: 6, nombre: 'Curso 6' },
        { id: 7, nombre: 'Curso 7' },
        { id: 8, nombre: 'Curso 8' },
        { id: 9, nombre: 'Curso 9' },
        { id: 10, nombre: 'Curso 10' },
      ],
      Vendedores: [
        { id: 1, nombre: 'Vendedor 1' },
        { id: 2, nombre: 'Vendedor 2' },
        { id: 3, nombre: 'Vendedor 3' },
        { id: 4, nombre: 'Vendedor 4' },
        { id: 5, nombre: 'Vendedor 5' },
      ],
    },
    {
      ID: 2,
      Nombre: 'Sucursal Tafi Viejo',
      Localidad: 'Tafi Viejo',
      Provincia: 'Tucuman',
      Profesores: [
        { id: 1, nombre: 'Profesor 1' },
        { id: 2, nombre: 'Profesor 2' },
        { id: 3, nombre: 'Profesor 3' },
        { id: 4, nombre: 'Profesor 4' },
        { id: 5, nombre: 'Profesor 5' },
        { id: 6, nombre: 'Profesor 6' },
        { id: 7, nombre: 'Profesor 7' },
        { id: 8, nombre: 'Profesor 8' },
        { id: 9, nombre: 'Profesor 9' },
        { id: 10, nombre: 'Profesor 10' },
      ],
      Cursos: [
        { id: 1, nombre: 'Curso 1' },
        { id: 2, nombre: 'Curso 2' },
        { id: 3, nombre: 'Curso 3' },
        { id: 4, nombre: 'Curso 4' },
        { id: 5, nombre: 'Curso 5' },
        { id: 6, nombre: 'Curso 6' },
        { id: 7, nombre: 'Curso 7' },
        { id: 8, nombre: 'Curso 8' },
        { id: 9, nombre: 'Curso 9' },
        { id: 10, nombre: 'Curso 10' },
      ],
      Vendedores: [
        { id: 1, nombre: 'Vendedor 1' },
        { id: 2, nombre: 'Vendedor 2' },
        { id: 3, nombre: 'Vendedor 3' },
        { id: 4, nombre: 'Vendedor 4' },
        { id: 5, nombre: 'Vendedor 5' },
      ],
    },
    {
      ID: 1,
      Nombre: 'Sucursal Santiago',
      Localidad: 'Centro',
      Provincia: 'Santiago del Estero',
      Profesores: [
        { id: 1, nombre: 'Profesor 1' },
        { id: 2, nombre: 'Profesor 2' },
        { id: 3, nombre: 'Profesor 3' },
        { id: 4, nombre: 'Profesor 4' },
        { id: 5, nombre: 'Profesor 5' },
        { id: 6, nombre: 'Profesor 6' },
        { id: 7, nombre: 'Profesor 7' },
        { id: 8, nombre: 'Profesor 8' },
        { id: 9, nombre: 'Profesor 9' },
        { id: 10, nombre: 'Profesor 10' },
      ],
      Cursos: [
        { id: 1, nombre: 'Curso 1' },
        { id: 2, nombre: 'Curso 2' },
        { id: 3, nombre: 'Curso 3' },
        { id: 4, nombre: 'Curso 4' },
        { id: 5, nombre: 'Curso 5' },
        { id: 6, nombre: 'Curso 6' },
        { id: 7, nombre: 'Curso 7' },
        { id: 8, nombre: 'Curso 8' },
        { id: 9, nombre: 'Curso 9' },
        { id: 10, nombre: 'Curso 10' },
      ],
      Vendedores: [
        { id: 1, nombre: 'Vendedor 1' },
        { id: 2, nombre: 'Vendedor 2' },
        { id: 3, nombre: 'Vendedor 3' },
        { id: 4, nombre: 'Vendedor 4' },
        { id: 5, nombre: 'Vendedor 5' },
      ],
    },
  ];
  async getSucursales() {
    return this.sucursales;
  }
  create() {
    return 'This action adds a new sucursal';
  }

  findOne(id: number) {
    return `This action returns a #${id} sucursal`;
  }

  update(id: number) {
    return `This action updates a #${id} sucursal`;
  }

  remove(id: number) {
    return `This action removes a #${id} sucursal`;
  }
}
