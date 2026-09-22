import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  const port = process.env.API_PORT ? Number(process.env.API_PORT) : 3333;
  await app.listen(port, '0.0.0.0');

  // eslint-disable-next-line no-console
  console.log(`API DJ Solar rodando em http://localhost:${port}/api/v1`);
}

bootstrap();
