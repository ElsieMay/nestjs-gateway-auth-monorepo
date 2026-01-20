import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../apps/gateway/src/app.module';
import { ClientProxy } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';
import type { Server } from 'http';
import { ValidateUserDto } from '../lib/core/src/auth-domain';

describe('Gateway Auth - Validate User (e2e)', () => {
  let app: INestApplication;
  let authServiceClient: ClientProxy;

  const validateDto: ValidateUserDto = {
    email: 'test@example.com',
    password: 'password123',
  };

  const invalidValidateDto: ValidateUserDto = {
    email: 'invalid-email',
    password: 'password123',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply same validation pipe as production
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // Mock the AUTH_SERVICE microservice client
    authServiceClient = app.get('AUTH_SERVICE');

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/validate_user (POST)', () => {
    it('should successfully validate a user', () => {
      const mockResponse = {
        user: {
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
        },
        token: 'mock.jwt.token',
      };

      jest.spyOn(authServiceClient, 'send').mockReturnValue(of(mockResponse));

      return request(app.getHttpServer() as Server)
        .post('/auth/validate_user')
        .send(validateDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('user');
          expect(res.body).toHaveProperty('token');
          expect((res.body as typeof mockResponse).user.email).toBe(
            validateDto.email,
          );
        });
    });

    it('should return 400 for invalid email format', () => {
      return request(app.getHttpServer() as Server)
        .post('/auth/validate_user')
        .send(invalidValidateDto)
        .expect(400);
    });

    it('should return 401 for incorrect password', () => {
      const wrongPasswordDto: ValidateUserDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      jest.spyOn(authServiceClient, 'send').mockReturnValue(
        throwError(() => ({
          statusCode: 401,
          message: 'Invalid credentials',
        })),
      );

      return request(app.getHttpServer() as Server)
        .post('/auth/validate_user')
        .send(wrongPasswordDto)
        .expect(401);
    });
  });
});
