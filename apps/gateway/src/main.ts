import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.GATEWAY_PORT
    ? parseInt(process.env.GATEWAY_PORT, 10)
    : 3000;

  await app.listen(port);

  Logger.log(`Gateway is running on port ${port}`, 'Main');
}

bootstrap().catch((error) => {
  Logger.error('Failed to start gateway:', error, 'Main');
  process.exit(1);
});
