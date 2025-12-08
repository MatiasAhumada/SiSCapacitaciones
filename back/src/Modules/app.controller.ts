import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('app-lock/status')
  getLockStatus() {
    return this.appService.getLockStatus();
  }

  @Post('app-lock/toggle')
  toggleLock(@Body() body: { locked: boolean; message?: string }) {
    return this.appService.setLock(body.locked, body.message);
  }
}
