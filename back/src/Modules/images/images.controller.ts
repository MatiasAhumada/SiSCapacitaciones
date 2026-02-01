import {
  Controller,
  Post,
  Delete,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }
    const imageUrl = await this.imagesService.uploadImage(file);
    return { url: imageUrl };
  }

  @Delete()
  async deleteImage(@Body('url') url: string) {
    if (!url) {
      throw new BadRequestException('Se requiere la URL de la imagen');
    }
    await this.imagesService.deleteImage(url);
    return { message: 'Imagen eliminada exitosamente' };
  }
}
