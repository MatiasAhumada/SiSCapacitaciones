import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admins } from '../Modules/admin/entities/admin.entity';
import { Sucursal } from '../Modules/sucursal/entities/sucursal.entity';
import { SeederService } from './seeders.service';
import { Curso } from 'src/Modules/curso/entities/curso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admins, Sucursal,Curso])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
