import { Module } from '@nestjs/common';
import { VendedorService } from './vendedor.service';
import { VendedorController } from './vendedor.controller';

@Module({
  controllers: [VendedorController],
  providers: [VendedorService],
})
export class VendedorModule {}
