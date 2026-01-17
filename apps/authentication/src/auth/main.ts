import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: parseInt(process.env.AUTH_SERVICE_PORT || '3002', 10),
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen();

  Logger.log(
    `Authentication microservice is running on port ${process.env.AUTH_SERVICE_PORT || '3002'} (TCP)`,
    'Main',
  );
}
bootstrap().catch((err) => {
  Logger.error('Error starting authentication microservice', err, 'Main');
});
