import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Admins } from './entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admins])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
