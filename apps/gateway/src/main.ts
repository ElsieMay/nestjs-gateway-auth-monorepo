import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Gateway API')
    .setDescription('API Gateway with JWT Authentication')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.GATEWAY_PORT
    ? parseInt(process.env.GATEWAY_PORT, 10)
    : 3000;

  await app.listen(port);

  Logger.log(`Gateway is running on port ${port}`, 'Main');
  Logger.log(
    `Swagger documentation available at http://localhost:${port}/api`,
    'Main',
  );
}

bootstrap().catch((error) => {
  Logger.error('Failed to start gateway:', error, 'Main');
  process.exit(1);
});
