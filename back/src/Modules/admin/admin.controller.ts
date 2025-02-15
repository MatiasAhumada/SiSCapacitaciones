import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  @Get()
  findAllAdmins() {
    return this.adminService.findAllAdm();
  }

  @Get(':id')
  findOneAdmin(@Param('id') id: string) {
    return this.adminService.findOneAdm(+id);
  }

  @Put(':id')
  updateAdmin(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
