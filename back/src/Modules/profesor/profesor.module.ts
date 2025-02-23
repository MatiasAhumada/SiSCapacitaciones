import { Module } from '@nestjs/common';
import { ProfesorService } from './profesor.service';
import { ProfesorController } from './profesor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profesor } from './entities/profesor.entity';
import { Sucursal } from '../sucursal/entities/sucursal.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Profesor,Sucursal])],
  controllers: [ProfesorController],
  providers: [ProfesorService],
})
export class ProfesorModule {}
