import { NestFactory } from '@nestjs/core';
import { AppModule } from '../Modules/app.module';
import { DataSource } from 'typeorm';
import { Admins } from '../Modules/admin/entities/admin.entity';
import { Sucursal } from '../Modules/sucursal/entities/sucursal.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const adminRepository = dataSource.getRepository(Admins);
  const sucursalRepository = dataSource.getRepository(Sucursal);

//   // Hash de la contraseña
//   const hashedPassword = await bcrypt.hash('javieradmin', 10);

  // Crear Admin
  const admin = adminRepository.create({
    name: 'javier',
    password: 'javieradmin',
    isAdmin: true,
  });

  await adminRepository.save(admin);

  console.log(`Admin creado con ID: ${admin.id}`);

  // Crear Sucursales
  const sucursalesData = [
    { name: 'Sucursal Santiago', localidad: 'Santiago Del Estero', provincia: 'Santiago del Estero', admin: {id: admin.id }},
    { name: 'Sucursal Centro', localidad: 'San Miguel de Tucumán', provincia: 'Tucumán', admin: {id: admin.id} },
    { name: 'Sucursal Tafi', localidad: 'Tafi Viejo', provincia: 'Tucumán', admin: {id: admin.id} },
  ];

  const sucursales = sucursalesData.map((sucursal) =>
    sucursalRepository.create(sucursal)
  );

  await sucursalRepository.save(sucursales);

  console.log('Sucursales creadas');

  await app.close();
}

seed().catch((error) => {
  console.error('Error en el seeder:', error);
});
