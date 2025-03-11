import { Module } from '@nestjs/common';
import { CajaService } from './caja.service';
import { CajaController } from './caja.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Caja } from './entities/caja.entity';
import { Vendedor } from '../vendedor/entities/vendedor.entity';
import { Alumno } from '../alumno/entities/alumno.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Caja,Vendedor,Alumno])],
  controllers: [CajaController],
  providers: [CajaService],
})
export class CajaModule {}
