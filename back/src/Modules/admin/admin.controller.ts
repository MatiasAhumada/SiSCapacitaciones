import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmSv(createAdminDto);
  }

  @Get()
  findAllAdmins() {
    return this.adminService.findAllAdmSv();
  }

  @Get(':id')
  findOneAdmin(@Param('id') id: string) {
    return this.adminService.findOneAdmSv(id);
  }

  @Put(':id')
  updateAdmin(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.updateAdmSv(id, updateAdminDto);
  }

  @Delete(':id')
  removeAdmin(@Param('id') id: string) {
    return this.adminService.removeAdmSv(id);
  }
}
