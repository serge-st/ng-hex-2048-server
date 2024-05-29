import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

// TODO: move into configuration function
const origin = 'http://localhost:4200';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin,
  });
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  await app.listen(3000);
}
bootstrap();
