import { Module } from '@nestjs/common';
import { VendedorService } from './vendedor.service';
import { VendedorController } from './vendedor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendedor } from './entities/vendedor.entity';
import { Sucursal } from '../sucursal/entities/sucursal.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';

@Module({
imports:[TypeOrmModule.forFeature([Vendedor,Sucursal,Inscripcion])],
  controllers: [VendedorController],
  providers: [VendedorService],
})
export class VendedorModule {}
