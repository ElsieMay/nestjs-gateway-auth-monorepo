import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from '../../../lib/common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from '../../../lib/common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(Logger));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new LoggingInterceptor(app.get(Logger)));

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapterHost));

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Gateway API')
    .setDescription('API Gateway with JWT Authentication')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication related endpoints')
    .addTag('profile', 'User management endpoints')
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

bootstrap().catch((err: unknown) => {
  const errorMessage = err instanceof Error ? err.message : String(err);
  const errorStack = err instanceof Error ? err.stack : undefined;

  Logger.error(`Error starting gateway: ${errorMessage}`, errorStack, 'Main');
  process.exit(1); // Exit on startup failure
});
