import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterDto } from '../../../../lib/core/src/auth/dto/register-auth.dto';
import { ValidateUserDto } from '../../../../lib/core/src/auth/dto/validate-user.dto';
import { LoginDto } from '../../../../lib/core/src/auth/dto/login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('validate_user')
  async validateUser(@Payload() credentials: ValidateUserDto) {
    return await this.authService.validateUser(credentials);
  }

  @MessagePattern('register')
  async register(@Payload() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @MessagePattern('login')
  async login(@Payload() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}
