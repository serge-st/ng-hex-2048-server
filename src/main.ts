import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const PORT = 3000;
const CORS_OPTIONS: CorsOptions = {
  origin: ['https://hex2048.stetsen.co', 'http://localhost:4200'],
  methods: ['GET', 'POST', 'OPTIONS'],
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(CORS_OPTIONS);
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  await app.listen(PORT);
}
bootstrap();
