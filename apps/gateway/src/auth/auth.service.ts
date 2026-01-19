import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
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
  constructor(@Inject('AUTH_SERVICE') client: ClientProxy) {
    super(client);
  }

  async validateUser(credentials: ValidateUserDto): Promise<AuthResponseDto> {
    return this.send<AuthResponseDto>('validateUser', credentials);
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.send<AuthResponseDto>('login', loginDto);
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.send<AuthResponseDto>('register', registerDto);
  }
}
