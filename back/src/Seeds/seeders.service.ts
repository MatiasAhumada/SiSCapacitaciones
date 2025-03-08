import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admins } from '../Modules/admin/entities/admin.entity';
import { Sucursal } from '../Modules/sucursal/entities/sucursal.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @InjectRepository(Admins) private readonly adminRepository: Repository<Admins>,
    @InjectRepository(Sucursal) private readonly sucursalRepository: Repository<Sucursal>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    console.log('Ejecutando seeder...');

    // Verificar si el admin ya existe
    let admin = await this.adminRepository.findOne({ where: { name: 'javier' } });

    if (!admin) {
      //const hashedPassword = await bcrypt.hash('javieradmin', 10);
      admin = this.adminRepository.create({
        name: 'javier',
        password: 'javieradmin',
        isAdmin: true,
      });

      await this.adminRepository.save(admin);
      console.log(`Admin creado con ID: ${admin.id}`);
    } else {
      console.log(`Admin ${admin.name} ya existe.`);
    }

    // Datos de sucursales
    const sucursalesData = [
      { name: 'Sucursal Santiago', localidad: 'Santiago Del Estero', provincia: 'Santiago del Estero' },
      { name: 'Sucursal Centro', localidad: 'San Miguel de Tucumán', provincia: 'Tucumán' },
      { name: 'Sucursal Tafi', localidad: 'Tafi Viejo', provincia: 'Tucumán' },
    ];

    for (const sucursalData of sucursalesData) {
      const exists = await this.sucursalRepository.findOne({ where: { name: sucursalData.name } });

      if (!exists) {
        const sucursal = this.sucursalRepository.create({ ...sucursalData, admin });
        await this.sucursalRepository.save(sucursal);
        console.log(`Sucursal ${sucursal.name} creada.`);
      } else {
        console.log(`Sucursal ${sucursalData.name} ya existe.`);
      }
    }

    console.log('Seeder ejecutado correctamente.');
  }
}
