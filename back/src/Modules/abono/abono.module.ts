import { Module } from '@nestjs/common';
import { AbonoService } from './abono.service';
import { AbonoController } from './abono.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alumno } from '../alumno/entities/alumno.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Alumno])],
  controllers: [AbonoController],
  providers: [AbonoService],
})
export class AbonoModule {}
