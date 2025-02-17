import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  createAdmSv(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
  }

  findAllAdmSv() {
    return `This action returns all admin`;
  }

  findOneAdmSv(id: number) {
    return `This action returns a #${id} admin`;
  }

  updateAdmSv(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  removeAdmSv(id: number) {
    return `This action removes a #${id} admin`;
  }
}
