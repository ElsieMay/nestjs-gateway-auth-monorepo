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

## 🚀 Quick Start (< 5 minutes)

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

### Tech Stack

| Technology | Purpose          |
| ---------- | ---------------- |
| NestJS     | Framework        |
| TypeScript | Language         |
| PostgreSQL | Database         |
| TypeORM    | ORM              |
| JWT        | Authentication   |
| Passport   | Auth middleware  |
| Bcrypt     | Password hashing |
| Jest       | Testing          |
| Pino       | Logging          |
| Swagger    | API docs         |
| Docker     | Containerisation |

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

## 🏗️ Architectural Decisions

This section explains the key architectural choices made in this project and the reasoning behind them.

### Why Microservices?

- **Separation of Concerns**: Authentication is a distinct domain with different security requirements
- **Independent Scaling**: Auth service can scale independently based on login/registration load
- **Security Isolation**: Credentials and hashing logic are isolated from public-facing gateway
- **Team Autonomy**: Different teams can own gateway and auth services independently
- **Technology Flexibility**: Can replace auth service with different implementation without affecting gateway

### Why TCP Transport?

- **Low Latency**: TCP is faster than HTTP for internal service-to-service calls
- **Built-in NestJS Support**: Native microservices transport with minimal configuration
- **Type Safety**: NestJS microservices preserve TypeScript types across services
- **Simplicity**: No need for additional infrastructure like Redis or RabbitMQ
- **Request-Response Pattern**: Perfect fit for synchronous auth operations e.g. login, validate

**Trade-offs**: TCP requires services to be on the same network. For multi-region deployments, consider HTTP or gRPC.

### Why JWT Authentication?

- **Stateless**: No server-side session storage required, easier to scale horizontally
- **Microservices-Friendly**: Token can be validated by any service without database lookup
- **Mobile-Ready**: Standard approach for mobile apps and SPAs
- **Cross-Domain**: Works across different domains/subdomains
- **Industry Standard**: Well-understood, many libraries available

**Security Note**: Short expiry (1 hour) limits impact of token theft. Consider refresh tokens for production.

### Why PostgreSQL?

- **ACID Compliance**: User authentication requires strict consistency
- **Relational Data**: Users, roles, and permissions are inherently relational
- **Mature Ecosystem**: Well-tested drivers, TypeORM support, easy backups
- **JSON Support**: Can still store flexible data with JSONB when needed
- **Performance**: Excellent performance for read-heavy auth queries with proper indexes

### Why TypeORM?

- **TypeScript Native**: First-class TypeScript support with decorators
- **NestJS Integration**: Official @nestjs/typeorm package
- **Migrations**: Built-in migration system for schema versioning
- **Active Record & Data Mapper**: Supports both patterns
- **Repository Pattern**: Clean separation of data access logic

### Why Shared Libraries?

- **DRY Principle**: JWT guards, logging, DTOs used by both services
- **Consistency**: Same validation rules across gateway and auth service
- **Maintainability**: Fix bugs once, applies everywhere
- **Clear Boundaries**: Explicit API between shared and service-specific code

### Trade-offs and Future Improvements

- Add refresh token rotation for better security
- Implement caching layer (Redis) for frequently accessed user data
- Add API versioning for backwards compatibility
- Implement distributed tracing with OpenTelemetry
- Add event-driven patterns for user activity notifications
- Consider gRPC for better performance and type safety

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

## 🧪 Testing

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
