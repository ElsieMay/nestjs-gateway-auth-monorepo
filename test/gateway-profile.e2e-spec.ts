import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../apps/gateway/src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Role } from '../lib/core/src/auth-domain';
import { of, throwError } from 'rxjs';
import type { Server } from 'http';
import { JwtService } from '@nestjs/jwt';

describe('Gateway Profile Controller (e2e)', () => {
  let app: INestApplication;
  let mockUsersServiceClient: Partial<ClientProxy>;
  let jwtService: JwtService;
  let adminToken: string;
  let userToken: string;

  // Test user data
  const adminUser = {
    sub: 'admin-123',
    email: 'admin@test.com',
    username: 'admin',
    roles: [Role.ADMIN],
  };

  const regularUser = {
    sub: '1',
    email: 'test@email.com',
    username: 'testuser',
    roles: [Role.USER],
  };

  beforeAll(async () => {
    // Create a mock client
    mockUsersServiceClient = {
      send: jest.fn(),
      emit: jest.fn(),
      close: jest.fn(),
      connect: jest.fn().mockResolvedValue(undefined),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('USER_SERVICE')
      .useValue(mockUsersServiceClient)
      .compile();

    app = moduleFixture.createNestApplication();

    // Apply same validation pipe as production
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    jwtService = app.get(JwtService);

    // Generate real JWT tokens for testing
    adminToken = jwtService.sign(adminUser);
    userToken = jwtService.sign(regularUser);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /profile', () => {
    it('should return profile with valid JWT', () => {
      const mockRawUser = {
        id: '1',
        username: 'testuser',
        email: 'test@email.com',
        roles: [Role.USER],
        createdAt: new Date(),
      };

      (mockUsersServiceClient.send as jest.Mock).mockImplementation(
        (pattern: string) => {
          if (pattern === 'find_user_by_id') {
            return of(mockRawUser);
          }
          return of(null);
        },
      );

      return request(app.getHttpServer() as Server)
        .get('/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', '1');
          expect(res.body).toHaveProperty('username', 'testuser');
          expect(res.body).toHaveProperty('email', 'test@email.com');
          expect(res.body).toHaveProperty('roles');
          expect(res.body).toHaveProperty(
            'message',
            'User profile retrieved successfully',
          );
          expect(res.body).toHaveProperty('user');
        });
    });

    it('should return 401 without JWT', () => {
      return request(app.getHttpServer() as Server)
        .get('/profile')
        .expect(401);
    });

    it('should return 401 with invalid JWT', () => {
      return request(app.getHttpServer() as Server)
        .get('/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should return 401 with malformed authorization header', () => {
      return request(app.getHttpServer() as Server)
        .get('/profile')
        .set('Authorization', 'Bjfhjdkfhkj')
        .expect(401);
    });

    it('should handle error when user service fails', () => {
      (mockUsersServiceClient.send as jest.Mock).mockReturnValue(
        throwError(() => ({
          statusCode: 500,
          message: 'Internal server error',
        })),
      );

      return request(app.getHttpServer() as Server)
        .get('/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(500);
    });

    it('should handle error when user not found', () => {
      (mockUsersServiceClient.send as jest.Mock).mockReturnValue(
        throwError(() => ({
          statusCode: 404,
          message: 'User not found',
        })),
      );

      return request(app.getHttpServer() as Server)
        .get('/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);
    });
  });

  describe('GET /profile/admin', () => {
    it('should return admin data with admin role', () => {
      (mockUsersServiceClient.send as jest.Mock).mockImplementation(
        (pattern: string) => {
          if (pattern === 'get_user_count') {
            return of(100);
          }
          if (pattern === 'get_user_stats') {
            return of({ activeUsers: 75 });
          }
          return of(null);
        },
      );

      return request(app.getHttpServer() as Server)
        .get('/profile/admin')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty(
            'message',
            'This is an admin-only route',
          );
          expect(res.body).toHaveProperty('userId', 'admin-123');
          expect(res.body).toHaveProperty('adminData');
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.adminData).toHaveProperty('totalUsers');
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(res.body.adminData).toHaveProperty('activeUsers');
        });
    });

    it('should return 403 for non-admin users', () => {
      return request(app.getHttpServer() as Server)
        .get('/profile/admin')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should return 401 without JWT', () => {
      return request(app.getHttpServer() as Server)
        .get('/profile/admin')
        .expect(401);
    });

    it('should return 401 with invalid JWT', () => {
      return request(app.getHttpServer() as Server)
        .get('/profile/admin')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should handle error when user service fails', () => {
      (mockUsersServiceClient.send as jest.Mock).mockReturnValue(
        throwError(() => ({
          statusCode: 500,
          message: 'Internal server error',
        })),
      );

      return request(app.getHttpServer() as Server)
        .get('/profile/admin')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(500);
    });
  });
});
