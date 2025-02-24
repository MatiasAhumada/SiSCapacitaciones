import { Module } from '@nestjs/common';
import { ComisionService } from './comision.service';
import { ComisionController } from './comision.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comision } from './entities/comision.entity';
import { Sucursal } from '../sucursal/entities/sucursal.entity';
import { Curso } from '../curso/entities/curso.entity';
import { Profesor } from '../profesor/entities/profesor.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Comision,Sucursal,Curso,Profesor])],
  controllers: [ComisionController],
  providers: [ComisionService],
})
export class ComisionModule {}
