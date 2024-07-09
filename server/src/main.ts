import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

// TODO: move into configuration function
const PORT = 3000;
const CORS_OPTIONS: CorsOptions = {
  origin: ['http://localhost:4200', 'http://192.168.101.8:4200', 'localhost:4200', '192.168.101.18'],
};
// TODO: probably have it removed or have 2 different configs: dev/prod
// const LOCAL_IP = '0.0.0.0';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(CORS_OPTIONS);
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  await app.listen(PORT);
}
bootstrap();
