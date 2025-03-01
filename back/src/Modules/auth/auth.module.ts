import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admins } from '../admin/entities/admin.entity';
import { Vendedor } from '../vendedor/entities/vendedor.entity';
import { Alumno } from '../alumno/entities/alumno.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admins,Vendedor,Alumno])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
