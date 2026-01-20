# NestJS Gateway Auth Monorepo

A microservices architecture built with NestJS featuring an API Gateway and authentication service in a monorepo structure.

## Description

This project demonstrates a scalable microservices architecture using [NestJS](https://github.com/nestjs/nest) with the following components:

- **API Gateway**: Exposes a public HTTP REST API
- **Auth Service**: Dedicated authentication and authorisation microservice
- **Shared Libraries**: Common utilities, types, and configurations

## Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **PostgreSQL**: v14.x or higher
- **Docker** (optional): For containerized database setup

## Architecture

This monorepo uses NestJS microservices pattern with TCP transport for inter-service communication. The architecture separates concerns between the public-facing gateway and internal authentication logic.

### Technology Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Transport**: TCP (microservices communication)
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Package Manager**: npm workspaces

### Project Structure

```
├── apps/
│   ├── gateway/          # API Gateway service
│   └── authentication/   # Authentication service
├── libs/
│   ├── common/           # Shared utilities and helpers
│   ├── core/             # Shared business logic and domain models
│   └── config/           # Configuration management
└── package.json          # Monorepo configuration
```

### Communication Flow

```
Monorepo Root
    │
    ├─ apps/
    │    ├─ gateway/ ──────────────────────── Client HTTP Entry
    │    │    src/auth/
    │    │    │    ├─ auth.controller.ts    │  @Controller() / @Get('login')
    │    │    │    │                        │    ↓ validateUser()
    │    │    │    └─ auth.module.ts        │
    │    │    └─ main.ts ─────────────────── app.enableHybridApplication()
    │    │
    │    └─ authentication/ ───────────────── Microservice Listener (TCP)
    │         src/auth/
    │         │    ├─ auth.controller.ts    │  @MessagePattern('validateUser')
    │         │    │                        │    ↓ calls service
    │         │    ├─ auth.service.ts       │  Business Logic
    │         │    │    ↓ validateUser()    │    ↓ calls repo
    │         │    └─ auth.repository.ts    │  DB Queries → PostgreSQL
    │         │
    │         └─ main.ts ──────────────────── app.connectMicroservice({ transport: Transport.TCP })
    │
    └─ libs/
         ├─ common/ ───────────────────────── Pipes/Guards/Interceptors
         │    └─ src/guards/jwt.guard.ts ──── Used by gateway controller
         │
         ├─ core/  ────────────────────────── DTOs/Entities/Interfaces
         │    └─ src/auth/dto/ ──────────────── ValidateUserDto
         │         └─ validate-user.dto.ts ─── Used by controller/service
         │
         └─ config/─────────────────────────── ConfigModule.forRoot()
              └─ src/auth.config.ts ────────── JWT_SECRET from .env
```

## API Documentation

### Authentication Endpoints

#### Register User

```
POST /auth/register
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "securePassword123",
  "username": "johndoe"
}

Response: 201 Created
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "johndoe",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Login

```
POST /auth/login
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response: 200 OK
{
  "access_token": "eyJhbGkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

#### Get Profile (Protected)

```
GET /auth/profile
Authorization: Bearer {access_token}

Response: 200 OK
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "johndoe",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Validate User (Internal - Microservice)

```
Microservice Message Pattern: 'validateUser'

Payload:
{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response:
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "johndoe"
}
```

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [NestJS Microservices](https://docs.nestjs.com/microservices/basics)
- [NestJS Authentication](https://docs.nestjs.com/security/authentication)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
