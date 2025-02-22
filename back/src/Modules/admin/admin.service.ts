import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Admins } from './entities/admin.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admins)
    private readonly admRepository: Repository<Admins>,
  ) {}

  async createAdmSv(createAdminDto: CreateAdminDto) {
    const newAdmin = this.admRepository.create(createAdminDto);
    await this.admRepository.save(newAdmin);
    return { name: newAdmin.name, isAdmin: newAdmin.isAdmin };
  }

  async findAllAdmSv() {
    return await this.admRepository.find();
  }

  async findOneAdmSv(id: string) {
    return await this.admRepository.findOneBy({ id });
  }

  async updateAdmSv(id: string, updateAdminDto: UpdateAdminDto) {
    const admin=await this.admRepository.findOneBy({id});
    if(!admin){
      return null;
    }
    Object.assign(admin,updateAdminDto);
    await this.admRepository.save(admin);
    return admin;
  }

  async removeAdmSv(id: string) {
    const admin=await this.admRepository.findOneBy({id});
    if(!admin){
      return null;
    }
    await this.admRepository.remove(admin);
    return admin;
  }
}
