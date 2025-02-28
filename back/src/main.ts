import { NestFactory } from '@nestjs/core';
import { AppModule } from './Modules/app.module';
import cors from "cors";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors())
  await app.listen(4040);
}
bootstrap();
