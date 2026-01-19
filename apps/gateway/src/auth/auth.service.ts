import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PinoLogger } from 'nestjs-pino';
import { BaseMicroserviceClient } from '../../../../lib/common/clients/base-microservice.client';
import {
  LoginDto,
  AuthResponseDto,
  RegisterDto,
  ValidateUserDto,
} from '../../../../lib/core/src/auth-domain';

export interface IAuthService {
  validateUser(dto: ValidateUserDto): Promise<AuthResponseDto>;
  login(dto: LoginDto): Promise<AuthResponseDto>;
  register(dto: RegisterDto): Promise<AuthResponseDto>;
}

@Injectable()
export class AuthService
  extends BaseMicroserviceClient
  implements IAuthService
{
  constructor(
    @Inject('AUTH_SERVICE') client: ClientProxy,
    private readonly logger: PinoLogger,
  ) {
    super(client);
    this.logger.setContext(AuthService.name);
  }

  async validateUser(credentials: ValidateUserDto): Promise<AuthResponseDto> {
    this.logger.info(
      { email: credentials.email },
      'Sending validateUser request to auth microservice',
    );
    const result = await this.send<AuthResponseDto>(
      'validateUser',
      credentials,
    );
    this.logger.info(
      { email: credentials.email },
      'User validated via microservice',
    );
    return result;
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    this.logger.info(
      { email: loginDto.email },
      'Sending login request to auth microservice',
    );
    const result = await this.send<AuthResponseDto>('login', loginDto);
    this.logger.info(
      { email: loginDto.email },
      'User logged in via microservice',
    );
    return result;
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    this.logger.info(
      { email: registerDto.email, username: registerDto.username },
      'Sending register request to auth microservice',
    );
    const result = await this.send<AuthResponseDto>('register', registerDto);
    this.logger.info(
      { email: registerDto.email, username: registerDto.username },
      'User registered via microservice',
    );
    return result;
  }
}
