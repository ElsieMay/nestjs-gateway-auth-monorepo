import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  ValidateUserDto,
} from '../../../../lib/core/src/auth/dto/validate-user.dto';

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
}
