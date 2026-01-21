# NestJS Gateway Auth Monorepo

![Tests](https://img.shields.io/badge/tests-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![NestJS](https://img.shields.io/badge/NestJS-11.0-red)
![Docker](https://img.shields.io/badge/Docker-ready-blue)

## Description

This project demonstrates a scalable microservices architecture using [NestJS](https://github.com/nestjs/nest) with the following components:

- **API Gateway**: Exposes a public HTTP REST API
- **Auth Service**: Dedicated authentication and authorisation microservice
- **Shared Libraries**: Common utilities, types, and configurations

**[View Live API Here](https://nestjs-gateway-auth-monorepo.onrender.com)**

## Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **PostgreSQL**: v14.x or higher (or use Docker)
- **Docker** (optional but recommended): For containerised setup

## Quick Start (< 5 minutes)

### Option 1: Using Docker (Recommended)

```bash
# 1. Clone and setup
git clone https://github.com/ElsieMay/nestjs-gateway-auth-monorepo
cd nestjs-gateway-auth-monorepo
cp .env.example .env

# 2. Start everything with Docker
docker-compose up -d

# 3. Test the API
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@example.com","username":"newuser","password":"Test123!"}'
```

### Option 2: Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start PostgreSQL
docker-compose up postgres -d
# Or use your local PostgreSQL instance

# 3. Setup environment
cp .env.example .env
# Edit .env with your database credentials

# 4. Run tests (optional)
npm run test:cov

# 5. Start services
npm run start:auth        # Terminal 1
npm run start:gateway     # Terminal 2
```

## Tech Stack

### API Layer

[![NestJS](https://img.shields.io/badge/NestJS-%23E0235C.svg?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/) Enterprise structure for microservices/decorators  
[![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)]() Type safety across shared libs/services  
[![Swagger](https://img.shields.io/badge/Swagger-%23F7F7F7.svg?style=for-the-badge&logo=swagger&logoColor=black)]() Auto-generated API docs

### Data Layer

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)]() ACID-compliant relational storage  
[![TypeORM](https://img.shields.io/badge/TypeORM-%23303333.svg?style=for-the-badge&logo=typeorm&logoColor=white)]() Native TS ORM with migrations

### Auth Layer

[![JWT](https://img.shields.io/badge/JWT-%2300D1B2.svg?style=for-the-badge&logo=json-web-tokens&logoColor=white)]() Stateless token auth across services  
[![Passport](https://img.shields.io/badge/Passport-282C34.svg?style=for-the-badge&logo=passport&logoColor=white)]() Battle-tested auth strategies  
[![Bcrypt](https://img.shields.io/badge/Bcrypt-%23A07F65.svg?style=for-the-badge&logo=bcrypt&logoColor=white)]() Secure password hashing

### DevOps Layer

[![Docker](https://img.shields.io/badge/Docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)]() Consistent dev/prod environments  
[![Pino](https://img.shields.io/badge/Pino-%23008000.svg?style=for-the-badge&logo=pino&logoColor=white)]() Low-overhead structured logging  
[![Jest](https://img.shields.io/badge/Jest-%23C83E94.svg?style=for-the-badge&logo=jest&logoColor=white)]() Fast TS unit/integration testing

## Architecture

This monorepo uses NestJS microservices pattern with TCP transport for inter-service communication. The architecture separates concerns between the public-facing gateway and internal authentication logic.

### High-Level Architecture

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │ HTTP/REST
       │
       ▼
┌──────────────────────────────┐
│   API Gateway (Port 3000)    │
│  ┌────────────────────────┐  │
│  │ - CORS & Rate Limiting │  │
│  │ - JWT Validation       │  │
│  │ - Swagger/OpenAPI      │  │
│  │ - HTTP → TCP Proxy     │  │
│  └────────────────────────┘  │
└──────────────┬───────────────┘
               │ TCP Transport
               │
               ▼
┌──────────────────────────────┐
│  Auth Service (Port 3002)    │
│  ┌────────────────────────┐  │
│  │ - User Registration    │  │
│  │ - Login/Validation     │  │
│  │ - Password Hashing     │  │
│  │ - JWT Token Generation │  │
│  └────────────┬───────────┘  │
└────────────────┼─────────────┘
                 │
                 ▼
          ┌─────────────┐
          │ PostgreSQL  │
          │  Database   │
          └─────────────┘
```

## Architectural Decisions

This section explains the key architectural choices made in this project and the reasoning behind them.

## Why Microservices?

[![Separation of Concerns](https://img.shields.io/badge/Separation%20of%20Concerns-%23007ACC.svg?style=for-the-badge)]() Authentication as distinct security domain  
[![Independent Scaling](https://img.shields.io/badge/Independent%20Scaling-%23F7B900.svg?style=for-the-badge)]() Auth scales to login loads alone  
[![Security Isolation](https://img.shields.io/badge/Security%20Isolation-%23FF6B35.svg?style=for-the-badge)]() Credentials isolated from gateway  
[![Team Autonomy](https://img.shields.io/badge/Team%20Autonomy-%23850C9C.svg?style=for-the-badge)]() Teams own services independently  
[![Technology Flexibility](https://img.shields.io/badge/Tech%20Flexibility-%2328A745.svg?style=for-the-badge)]() Swap auth without gateway changes

## TCP Transport

[![Low Latency](https://img.shields.io/badge/Low%20Latency-%2300D1B2.svg?style=for-the-badge)]() Faster than HTTP service-to-service  
[![NestJS Native](https://img.shields.io/badge/NestJS%20Native-%23E0235C.svg?style=for-the-badge&logo=nestjs)]() Minimal setup transport  
[![Type Safety](https://img.shields.io/badge/Type%20Safety-%23007ACC.svg?style=for-the-badge&logo=typescript)]() TS types preserved across services  
[![Simple](https://img.shields.io/badge/Simple-%2328A745.svg?style=for-the-badge)]() No Redis/RabbitMQ needed  
[![Request-Response](https://img.shields.io/badge/Request-Response-%23F7B900.svg?style=for-the-badge)]() Perfect for sync auth ops

## JWT Authentication

[![Stateless](https://img.shields.io/badge/Stateless-%2300D1B2.svg?style=for-the-badge&logo=json-web-tokens)]() Horizontal scaling, no sessions  
[![Microservices](https://img.shields.io/badge/Microservices-%23F7B900.svg?style=for-the-badge)]() Any service validates tokens  
[![Mobile Ready](https://img.shields.io/badge/Mobile%20Ready-%2328A745.svg?style=for-the-badge)]() SPAs + mobile standard  
[![Cross-Domain](https://img.shields.io/badge/Cross-Domain-%23850C9C.svg?style=for-the-badge)]() Works across domains

**Security Note**: Short expiry (1 hour) limits impact of token theft. Consider refresh tokens for production.

## PostgreSQL

[![ACID Compliance](https://img.shields.io/badge/ACID%20Compliance-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)]() Strict consistency for auth  
[![Relational Data](https://img.shields.io/badge/Relational%20Data-%23436EEE.svg?style=for-the-badge&logo=postgresql)]() Perfect for users/roles/permissions  
[![Mature Ecosystem](https://img.shields.io/badge/Mature%20Ecosystem-%2328A745.svg?style=for-the-badge&logo=postgresql)]() TypeORM + battle-tested drivers  
[![JSONB Support](https://img.shields.io/badge/JSONB%20Support-%2300D1B2.svg?style=for-the-badge&logo=postgresql)]() Flexible data when needed  
[![Performance](https://img.shields.io/badge/Performance-%23F7B900.svg?style=for-the-badge&logo=postgresql)]() Read-heavy auth queries optimized

## TypeORM

[![TypeScript Native](https://img.shields.io/badge/TS%20Native-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)]() Decorators + first-class support  
[![NestJS Integration](https://img.shields.io/badge/NestJS%20Official-%23E0235C.svg?style=for-the-badge&logo=nestjs&logoColor=white)]() @nestjs/typeorm package  
[![Migrations](https://img.shields.io/badge/Migrations-%2328A745.svg?style=for-the-badge&logo=typeorm)]() Built-in schema versioning  
[![Active%20Record](https://img.shields.io/badge/Active%20Record-%23F7B900.svg?style=for-the-badge&logo=typeorm)]() + Data Mapper patterns  
[![Repository Pattern](https://img.shields.io/badge/Repository%20Pattern-%2300D1B2.svg?style=for-the-badge&logo=typeorm)]() Clean data access layer

## Shared Libraries

[![DRY Principle](https://img.shields.io/badge/DRY-%2328A745.svg?style=for-the-badge&logo=nodejs)]() JWT guards/DTOs reused everywhere  
[![Consistency](https://img.shields.io/badge/Consistency-%2300D1B2.svg?style=for-the-badge&logo=nodejs)]() Uniform validation rules  
[![Maintainability](https://img.shields.io/badge/Maintainable-%23F7B900.svg?style=for-the-badge&logo=nodejs)]() Fix once, deploy everywhere  
[![Clear Boundaries](https://img.shields.io/badge/Clear%20Boundaries-%23E0235C.svg?style=for-the-badge&logo=nodejs)]() Explicit shared/specific APIs

### Trade-offs and Future Improvements

- Add refresh token rotation for better security
- Implement caching layer (Redis) for frequently accessed user data
- Add API versioning for backwards compatibility
- Implement distributed tracing with OpenTelemetry
- Add event-driven patterns for user activity notifications
- Consider gRPC for better performance and type safety
- TCP requires services to be on the same network

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
Authorisation: Bearer {access_token}

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

## Testing

Run comprehensive test suite with 100% coverage:

```bash
# Unit tests
npm test

# Unit tests with coverage
npm run test:cov

# E2E tests
npm run test:e2e

# E2E tests with coverage
npm run test:e2e:cov

# Watch mode
npm run test:watch
```

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [NestJS Microservices](https://docs.nestjs.com/microservices/basics)
- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [TypeORM Documentation](https://typeorm.io/)
- [JWT.io](https://jwt.io/)

## Security

This project implements multiple security layers:

- **Input Sanitisation**: XSS protection on all user inputs using `xss` library
- **Password Hashing**: Bcrypt with configurable salt rounds (default: 10)
- **JWT Authentication**: Secure token-based authentication with expiry
- **Rate Limiting**: 100 requests per 60 seconds to prevent brute force
- **CORS**: Configurable cross-origin resource sharing
- **Validation**: Request validation with class-validator
- **Health Checks**: Service monitoring endpoints

This project is [MIT licensed](LICENSE).

---

<div align="center">

### Made with ❤️ and ⚡ by [Elsie Lawrie](https://github.com/elsiemay)

</div>
