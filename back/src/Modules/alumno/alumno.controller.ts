import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  Req,
  UnauthorizedException,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AlumnoService } from './alumno.service';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { UpdateAlumnoDto } from './dto/update-alumno.dto';

@Controller('alumno')
export class AlumnoController {
  constructor(private readonly alumnoService: AlumnoService) {}

  @Post()
  create(@Body() createAlumnoDto: CreateAlumnoDto) {
    return this.alumnoService.create(createAlumnoDto);
  }
  @Post('simple')
  createSimpleAlumno(@Body() alumnoSimple: { dni: string; name: string }) {
    return this.alumnoService.createSimpleAlumno(
      alumnoSimple.dni,
      alumnoSimple.name,
    );
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Req() request: { user: { role?: string } }) {
    this.assertStaffAccess(request.user);
    return this.alumnoService.findAll();
  }

  @Get('global')
  @UseGuards(AuthGuard('jwt'))
  getAlumnosGlobales(
    @Req() request: { user: { role?: string } },
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('nombre') nombre?: string,
    @Query('dni') dni?: string,
    @Query('tel') tel?: string,
    @Query('cantidadComisiones') cantidadComisiones?: string,
    @Query('cantidadCertificados') cantidadCertificados?: string,
  ) {
    this.assertStaffAccess(request.user);

    return this.alumnoService.getAlumnosListado(
      { page: Number(page), limit: Number(limit) },
      { nombre, dni, tel, cantidadComisiones, cantidadCertificados },
    );
  }

  @Get('sucursal/:id')
  @UseGuards(AuthGuard('jwt'))
  getAlumnosBySucursal(
    @Req() request: { user: { role?: string } },
    @Param('id') sucursalId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('nombre') nombre?: string,
    @Query('dni') dni?: string,
    @Query('tel') tel?: string,
    @Query('cantidadComisiones') cantidadComisiones?: string,
    @Query('cantidadCertificados') cantidadCertificados?: string,
  ) {
    this.assertStaffAccess(request.user);
    const filtros = {
      nombre,
      dni,
      tel,
      cantidadComisiones,
      cantidadCertificados,
    };
    return this.alumnoService.getAlumnosBySucursal(
      sucursalId,
      {
        page: Number(page),
        limit: Number(limit),
      },
      filtros,
    );
  }

  @Put('/img/:id')
  update(@Param('id') id: string, @Body() update: UpdateAlumnoDto) {
    return this.alumnoService.actualizarImgUrl(id, update);
  }
  // @Put(':id/estado/:nuevoEstado')
  // async cambiarEstado(
  //   @Param('id') id: string,
  //   @Param('nuevoEstado') nuevoEstado: string,
  // ) {
  //   const estadoBooleano = nuevoEstado === 'true';
  //   return this.alumnoService.cambiarEstado(id, estadoBooleano);
  // }
  @Get('buscar')
  @UseGuards(AuthGuard('jwt'))
  async buscarPorDni(
    @Req() request: { user: { role?: string } },
    @Query('dni') dni: string,
  ) {
    this.assertStaffAccess(request.user);
    return this.alumnoService.findByDniBasic(dni);
  }

  @Get('search/:dni')
  @UseGuards(AuthGuard('jwt'))
  findOne(
    @Req() request: { user: { role?: string } },
    @Param('dni') dni: string,
  ) {
    this.assertStaffAccess(request.user);
    return this.alumnoService.findOne(dni);
  }

  @Put('edit/:id')
  updateImgUrl(
    @Param('id') id: string,
    @Body() updateAlumnoDto: UpdateAlumnoDto,
  ) {
    return this.alumnoService.update(id, updateAlumnoDto);
  }
  @Delete('remove/:id')
  remove(@Param('id') id: string) {
    return this.alumnoService.remove(id);
  }

  private assertStaffAccess(user?: { role?: string }) {
    if (!user) {
      throw new UnauthorizedException();
    }
    if (!['admin', 'vendedor'].includes(user.role || '')) {
      throw new ForbiddenException(
        'Acceso exclusivo para administración y ventas',
      );
    }
  }
}
