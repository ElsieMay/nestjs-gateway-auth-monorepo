import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../apps/gateway/src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  UserResponseDto,
  DeleteUserResponseDto,
} from '../lib/core/src/users-domain';
import { Role } from '../lib/core/src/auth-domain';
import { of, throwError } from 'rxjs';
import type { Server } from 'http';
import { JwtService } from '@nestjs/jwt';

describe('Gateway Users Controller (e2e)', () => {
  let app: INestApplication;
  let usersServiceClient: ClientProxy;
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
    email: 'user@test.com',
    username: 'user1',
    roles: [Role.USER],
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('USER_SERVICE')
      .useValue({
        send: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    usersServiceClient = app.get('USER_SERVICE');
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

  describe('GET /users', () => {
    it('should return all users with admin role', () => {
      const mockResponse: UserResponseDto[] = [
        {
          id: '1',
          username: 'user1',
          email: 'test@email.com',
          roles: [Role.USER],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          username: 'user2',
          email: 'test@example.com',
          roles: [Role.ADMIN],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(usersServiceClient, 'send').mockReturnValue(of(mockResponse));

      return request(app.getHttpServer() as Server)
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body).toHaveLength(2);
        });
    });

    it('should return 401 for unauthorised access', () => {
      return request(app.getHttpServer() as Server)
        .get('/users')
        .expect(401);
    });

    it('should return 401 for invalid token', () => {
      return request(app.getHttpServer() as Server)
        .get('/users')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should return 403 for non-admin users', () => {
      return request(app.getHttpServer() as Server)
        .get('/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });

  describe('GET /users/:id', () => {
    it('should return user data when requesting own profile', () => {
      const mockUser: UserResponseDto = {
        id: '1',
        username: 'user1',
        email: 'test@email.com',
        roles: [Role.USER],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(usersServiceClient, 'send').mockReturnValue(of(mockUser));

      return request(app.getHttpServer() as Server)
        .get('/users/1')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', '1');
          expect(res.body).toHaveProperty('username', 'user1');
          expect(res.body).toHaveProperty('email', 'test@email.com');
        });
    });

    it('should return user data when admin requests any user', () => {
      const mockUser: UserResponseDto = {
        id: '2',
        username: 'user2',
        email: 'test2@email.com',
        roles: [Role.USER],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(usersServiceClient, 'send').mockReturnValue(of(mockUser));

      return request(app.getHttpServer() as Server)
        .get('/users/2')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', '2');
          expect(res.body).toHaveProperty('username', 'user2');
        });
    });

    it('should return 403 when non-admin tries to view other user', () => {
      return request(app.getHttpServer() as Server)
        .get('/users/2')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403)
        .expect((res) => {
          expect((res.body as { message: string }).message).toBe(
            'You can only access your own profile',
          );
        });
    });

    it('should return 401 for unauthorised access', () => {
      return request(app.getHttpServer() as Server)
        .get('/users/1')
        .expect(401);
    });

    it('should return 404 for non-existent user', () => {
      jest.spyOn(usersServiceClient, 'send').mockReturnValue(
        throwError(() => ({
          statusCode: 404,
          message: 'User not found',
        })),
      );

      return request(app.getHttpServer() as Server)
        .get('/users/999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('PATCH /users/:id', () => {
    it('should update own profile successfully', () => {
      const updateUserDto = {
        username: 'updatedUser',
      };

      const mockUpdatedUser: UserResponseDto = {
        id: '1',
        username: 'updatedUser',
        email: 'test@email.com',
        roles: [Role.USER],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(usersServiceClient, 'send')
        .mockReturnValue(of(mockUpdatedUser));

      return request(app.getHttpServer() as Server)
        .patch('/users/1')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateUserDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('username', 'updatedUser');
        });
    });

    it('should allow admin to update any user', () => {
      const updateUserDto = {
        username: 'adminUpdated',
      };

      const mockUpdatedUser: UserResponseDto = {
        id: '2',
        username: 'adminUpdated',
        email: 'test2@email.com',
        roles: [Role.USER],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(usersServiceClient, 'send')
        .mockReturnValue(of(mockUpdatedUser));

      return request(app.getHttpServer() as Server)
        .patch('/users/2')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateUserDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('username', 'adminUpdated');
        });
    });

    it('should return 403 when non-admin tries to update other user', () => {
      const updateUserDto = {
        username: 'hacker',
      };

      return request(app.getHttpServer() as Server)
        .patch('/users/2')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateUserDto)
        .expect(403)
        .expect((res) => {
          expect((res.body as { message: string }).message).toBe(
            'You can only access your own profile',
          );
        });
    });

    it('should return 401 for unauthorised access', () => {
      return request(app.getHttpServer() as Server)
        .patch('/users/1')
        .send({ username: 'updatedUser' })
        .expect(401);
    });

    it('should return 400 for invalid update data', () => {
      return request(app.getHttpServer() as Server)
        .patch('/users/1')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ email: 'not-an-email' })
        .expect(400);
    });
  });

  describe('PATCH /users/:id/password', () => {
    it('should update own password successfully', () => {
      const updatePasswordDto = {
        newPassword: 'NewStrongP@ssw0rd',
      };

      const mockUpdatedUser: UserResponseDto = {
        id: '1',
        username: 'user1',
        email: 'test@example.com',
        roles: [Role.USER],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(usersServiceClient, 'send')
        .mockReturnValue(of(mockUpdatedUser));

      return request(app.getHttpServer() as Server)
        .patch('/users/1/password')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updatePasswordDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', '1');
        });
    });

    it('should allow admin to update any user password', () => {
      const updatePasswordDto = {
        newPassword: 'AdminSetPassword123!',
      };

      const mockUpdatedUser: UserResponseDto = {
        id: '2',
        username: 'user2',
        email: 'test2@example.com',
        roles: [Role.USER],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(usersServiceClient, 'send')
        .mockReturnValue(of(mockUpdatedUser));

      return request(app.getHttpServer() as Server)
        .patch('/users/2/password')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatePasswordDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', '2');
        });
    });

    it('should return 403 when non-admin tries to update other user password', () => {
      const updatePasswordDto = {
        newPassword: 'HackedPassword123!',
      };

      return request(app.getHttpServer() as Server)
        .patch('/users/2/password')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updatePasswordDto)
        .expect(403)
        .expect((res) => {
          expect((res.body as { message: string }).message).toBe(
            'You can only access your own profile',
          );
        });
    });

    it('should return 401 for unauthorised access', () => {
      return request(app.getHttpServer() as Server)
        .patch('/users/1/password')
        .send({ newPassword: 'NewStrongP@ssw0rd' })
        .expect(401);
    });

    it('should return 400 for invalid password format', () => {
      return request(app.getHttpServer() as Server)
        .patch('/users/1/password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ newPassword: 'short' })
        .expect(400);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete user with admin role', () => {
      const mockDeleteResponse: DeleteUserResponseDto = {
        message: 'User deleted successfully',
      };

      jest
        .spyOn(usersServiceClient, 'send')
        .mockReturnValue(of(mockDeleteResponse));

      return request(app.getHttpServer() as Server)
        .delete('/users/2')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty(
            'message',
            'User deleted successfully',
          );
        });
    });

    it('should return 403 for non-admin users', () => {
      return request(app.getHttpServer() as Server)
        .delete('/users/2')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should return 401 for unauthorised access', () => {
      return request(app.getHttpServer() as Server)
        .delete('/users/1')
        .expect(401);
    });

    it('should return 404 for non-existent user', () => {
      jest.spyOn(usersServiceClient, 'send').mockReturnValue(
        throwError(() => ({
          statusCode: 404,
          message: 'User not found',
        })),
      );

      return request(app.getHttpServer() as Server)
        .delete('/users/999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });
});
