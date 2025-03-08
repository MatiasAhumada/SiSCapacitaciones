import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admins } from '../Modules/admin/entities/admin.entity';
import { Sucursal } from '../Modules/sucursal/entities/sucursal.entity';
import { SeederService } from './seeders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admins, Sucursal])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
