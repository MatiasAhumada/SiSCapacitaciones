import { Module } from '@nestjs/common';
import { CursoService } from './curso.service';
import { CursoController } from './curso.controller';
import { Type } from 'class-transformer';
import { Curso } from './entities/curso.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profesor } from '../profesor/entities/profesor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Curso])],
  controllers: [CursoController],
  providers: [CursoService],
})
export class CursoModule {}
