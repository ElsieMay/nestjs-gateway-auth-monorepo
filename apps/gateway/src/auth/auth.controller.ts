import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../../../../lib/core/src/auth/dto/login.dto';
import { RegisterDto } from '../../../../lib/core/src/auth/dto/register-auth.dto';
import { ValidateUserDto } from '../../../../lib/core/src/auth/dto/validate-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('validate_user')
  validate_user(@Body() credentials: ValidateUserDto) {
    return this.authService.validateUser(credentials);
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
