import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../apps/gateway/src/app.module';
import { ClientProxy } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';
import type { Server } from 'http';
import { LoginDto } from '../lib/core/src/auth-domain';

describe('Gateway Auth - Login (e2e)', () => {
  let app: INestApplication;
  let authServiceClient: ClientProxy;

  const loginDto: LoginDto = {
    email: 'test@example.com',
    password: 'password123',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    authServiceClient = app.get('AUTH_SERVICE');

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/login (POST)', () => {
    it('should successfully login a user', () => {
      const mockResponse = {
        user: {
          id: '1',
          email: 'test@example.com',
        },
        token: 'mock.jwt.token',
      };

      jest.spyOn(authServiceClient, 'send').mockReturnValue(of(mockResponse));

      return request(app.getHttpServer() as Server)
        .post('/auth/login')
        .send(loginDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('user');
          expect(res.body).toHaveProperty('token');
          expect((res.body as typeof mockResponse).user.email).toBe(
            loginDto.email,
          );
        });
    });

    it('should return 400 for invalid credentials', () => {
      const invalidLoginDto = {
        email: 'invalid-email',
        password: 'password123',
      };

      return request(app.getHttpServer() as Server)
        .post('/auth/login')
        .send(invalidLoginDto)
        .expect(400);
    });

    it('should return 401 for incorrect password', () => {
      const invalidPasswordUserDto = {
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
        .post('/auth/login')
        .send(invalidPasswordUserDto)
        .expect(401);
    });
  });
});
