import { Module } from '@nestjs/common';
import { CajaService } from './caja.service';
import { CajaController } from './caja.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Caja } from './entities/caja.entity';
import { Vendedor } from '../vendedor/entities/vendedor.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Caja,Vendedor])],
  controllers: [CajaController],
  providers: [CajaService],
})
export class CajaModule {}
