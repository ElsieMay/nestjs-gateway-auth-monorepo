import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: parseInt(process.env.AUTH_SERVICE_PORT || '3002', 10),
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.startAllMicroservices();

  Logger.log(
    `Authentication microservice is running on port ${process.env.AUTH_SERVICE_PORT} (TCP)`,
    'Main',
  );
}

bootstrap().catch((err: unknown) => {
  const errorMessage = err instanceof Error ? err.message : String(err);
  const errorStack = err instanceof Error ? err.stack : undefined;

  Logger.error(
    `Error starting authentication microservice: ${errorMessage}`,
    errorStack,
    'Main',
  );
  process.exit(1); // Exit on startup failure
});
