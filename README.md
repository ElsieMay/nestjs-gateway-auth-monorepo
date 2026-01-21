# NestJS Gateway Auth Monorepo

![Tests](https://img.shields.io/badge/tests-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![NestJS](https://img.shields.io/badge/NestJS-11.0-red)
![Docker](https://img.shields.io/badge/Docker-ready-blue)

A production-ready microservices architecture built with NestJS featuring an API Gateway and authentication service in a monorepo structure.

## 🎯 Project Highlights

- ✅ **Microservices Architecture** - API Gateway + Auth Service via TCP
- ✅ **100% Test Coverage** - Comprehensive unit + E2E tests
- ✅ **Security First** - JWT authentication, bcrypt hashing, input sanitisation, rate limiting
- ✅ **TypeScript Best Practices** - Strict mode, proper types, clean architecture
- ✅ **API Documentation** - Auto-generated Swagger/OpenAPI docs
- ✅ **Production Ready** - Health checks, structured logging, error handling
- ✅ **Docker Support** - Full containerisation with docker-compose

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

## Description

This project demonstrates a scalable microservices architecture using [NestJS](https://github.com/nestjs/nest) with the following components:

- **API Gateway**: Exposes a public HTTP REST API
- **Auth Service**: Dedicated authentication and authorisation microservice
- **Shared Libraries**: Common utilities, types, and configurations

## Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **PostgreSQL**: v14.x or higher (or use Docker)
- **Docker** (optional but recommended): For containerised setup

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
└────────────────┼──────────────┘
                 │
                 ▼
          ┌─────────────┐
          │ PostgreSQL  │
          │  Database   │
          └─────────────┘
```

### Technology Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Transport**: TCP (microservices communication)
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Package Manager**: npm workspaces
- **Containerisation**: Docker + Docker Compose

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
