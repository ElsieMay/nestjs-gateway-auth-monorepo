import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../apps/gateway/src/app.module';
import { ClientProxy } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';
import type { Server } from 'http';
import { RegisterDto } from '../lib/core/src/auth-domain';

describe('Gateway Auth - Register (e2e)', () => {
  let app: INestApplication;
  let authServiceClient: ClientProxy;

  const invalidRegisterDto: RegisterDto = {
    email: 'invalid-email',
    username: 'testuser',
    password: 'password123',
  };

  interface ErrorResponse {
    message: string;
    error: string;
    statusCode: number;
  }

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

  describe('/auth/register (POST)', () => {
    it('should successfully register a new user', () => {
      const validRegisterDto: RegisterDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };

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
        .post('/auth/register')
        .send(validRegisterDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('user');
          expect(res.body).toHaveProperty('token');
          expect((res.body as typeof mockResponse).user.email).toBe(
            validRegisterDto.email,
          );
          expect((res.body as typeof mockResponse).user.username).toBe(
            validRegisterDto.username,
          );
        });
    });

    it('should return 400 for invalid email', () => {
      return request(app.getHttpServer() as Server)
        .post('/auth/register')
        .send(invalidRegisterDto)
        .expect(400);
    });

    it('should return 400 for password less than 6 characters', () => {
      return request(app.getHttpServer() as Server)
        .post('/auth/register')
        .send(invalidRegisterDto)
        .expect(400);
    });

    it('should return 409 for duplicate email', () => {
      const validRegisterDto: RegisterDto = {
        email: 'existing@example.com',
        username: 'newuser',
        password: 'password123',
      };

      const mockError = {
        statusCode: 409,
        message: 'User with this email already exists',
        error: 'Conflict',
      };

      jest
        .spyOn(authServiceClient, 'send')
        .mockReturnValue(throwError(() => mockError));

      return request(app.getHttpServer() as Server)
        .post('/auth/register')
        .send(validRegisterDto)
        .expect(409)
        .expect((res) => {
          expect((res.body as ErrorResponse).message).toContain('email');
        });
    });

    it('should return 409 for duplicate username', () => {
      const validRegisterDto: RegisterDto = {
        email: 'newemail@example.com',
        username: 'existinguser',
        password: 'password123',
      };

      const mockError = {
        statusCode: 409,
        message: 'User with this username already exists',
        error: 'Conflict',
      };

      jest
        .spyOn(authServiceClient, 'send')
        .mockReturnValue(throwError(() => mockError));

      return request(app.getHttpServer() as Server)
        .post('/auth/register')
        .send(validRegisterDto)
        .expect(409)
        .expect((res) => {
          expect((res.body as ErrorResponse).message).toContain(
            'User with this username already exists',
          );
        });
    });
  });
});
