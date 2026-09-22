import 'reflect-metadata';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  app.use(helmet());
  app.use(cookieParser());

  app.enableCors({
    origin: [process.env.VITE_SITE_URL, process.env.VITE_ADMIN_URL].filter(
      (origin): origin is string => Boolean(origin),
    ),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.API_PORT ? Number(process.env.API_PORT) : 3333;
  await app.listen(port, '0.0.0.0');

  // eslint-disable-next-line no-console
  console.log(`API DJ Solar rodando em http://localhost:${port}/api/v1`);
}

bootstrap();
