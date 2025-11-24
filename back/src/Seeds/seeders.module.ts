import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admins } from '../Modules/admin/entities/admin.entity';
import { SeederService } from './seeders.service';
import { SesionCaja } from '@modules/Modules/caja/entities/sesion-caja.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admins, SesionCaja])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
