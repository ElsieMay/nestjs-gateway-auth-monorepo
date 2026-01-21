import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Start HTTP server for health checks (Render requirement)
  const httpPort = parseInt(process.env.PORT || '10000', 10);

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
  await app.listen(httpPort); // Listen on HTTP for health checks

  Logger.log(
    `Authentication microservice is running on port ${process.env.AUTH_SERVICE_PORT} (TCP)`,
    'Main',
  );
  Logger.log(
    `HTTP server listening on port ${httpPort} for health checks`,
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
