import { Module } from '@nestjs/common';
import { SucursalService } from './sucursal.service';
import { SucursalController } from './sucursal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sucursal } from './entities/sucursal.entity';
import { Admins } from '../admin/entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sucursal,Admins])],
  controllers: [SucursalController],
  providers: [SucursalService],
})
export class SucursalModule {}
