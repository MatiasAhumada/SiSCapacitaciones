import { Module } from '@nestjs/common';
import { ComprobanteService } from './comprobante.service';
import { ComprobanteController } from './comprobante.controller';
import { Comprobante } from './entities/comprobante.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Comprobante])],
  controllers: [ComprobanteController],
  providers: [ComprobanteService],
})
export class ComprobanteModule {}
