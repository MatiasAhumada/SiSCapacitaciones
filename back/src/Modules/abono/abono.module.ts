import { Module } from '@nestjs/common';
import { AbonoService } from './abono.service';
import { AbonoController } from './abono.controller';

@Module({
  controllers: [AbonoController],
  providers: [AbonoService],
})
export class AbonoModule {}
