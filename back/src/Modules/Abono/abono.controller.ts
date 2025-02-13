import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AbonoService } from './abono.service';
import { CreateAbonoDto } from './dto/create-abono.dto';
import { UpdateAbonoDto } from './dto/update-abono.dto';

@Controller('abono')
export class AbonoController {
  constructor(private readonly abonoService: AbonoService) {}

  @Post()
  create(@Body() createAbonoDto: CreateAbonoDto) {
    return this.abonoService.create(createAbonoDto);
  }

  @Get()
  findAll() {
    return this.abonoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.abonoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAbonoDto: UpdateAbonoDto) {
    return this.abonoService.update(+id, updateAbonoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.abonoService.remove(+id);
  }
}
