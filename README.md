# NestJS Gateway Auth Monorepo

A microservices architecture built with NestJS featuring an API Gateway and authentication service in a monorepo structure.

## Description

This project demonstrates a scalable microservices architecture using [NestJS](https://github.com/nestjs/nest) with the following components:

- **API Gateway**: Exposes a public HTTP REST API
- **Auth Service**: Dedicated authentication and authorisation microservice
- **Shared Libraries**: Common utilities, types, and configurations

## Architecture

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

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [NestJS Microservices](https://docs.nestjs.com/microservices/basics)
- [NestJS Authentication](https://docs.nestjs.com/security/authentication)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
