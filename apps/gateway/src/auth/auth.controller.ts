import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from '../../../../lib/core/src/auth/dto/login.dto';
import { RegisterDto } from '../../../../lib/core/src/auth/dto/register-auth.dto';
import { ValidateUserDto } from '../../../../lib/core/src/auth/dto/validate-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('validate_user')
  @ApiOperation({ summary: 'Validate user credentials' })
  validate_user(@Body() credentials: ValidateUserDto) {
    return this.authService.validateUser(credentials);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login and get JWT token' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
