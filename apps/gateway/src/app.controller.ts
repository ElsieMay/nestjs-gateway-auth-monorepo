import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('root')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'API root endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Returns API information and available endpoints',
  })
  getRoot() {
    return {
      name: 'NestJS Gateway Auth API',
      version: '1.0.0',
      status: 'running',
      documentation: '/api',
      endpoints: {
        health: '/health',
        auth: {
          register: 'POST /auth/register',
          login: 'POST /auth/login',
          profile: 'GET /auth/profile (protected)',
        },
        users: {
          list: 'GET /users (admin only)',
          getOne: 'GET /users/:id',
          update: 'PATCH /users/:id',
          updatePassword: 'PATCH /users/:id/password',
          delete: 'DELETE /users/:id (admin only)',
        },
        profile: {
          get: 'GET /profile (protected)',
          admin: 'GET /profile/admin (admin only)',
        },
      },
    };
  }
}
