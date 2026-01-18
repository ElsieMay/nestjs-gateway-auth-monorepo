import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto } from '../../../../lib/core/src/auth/dto/login.dto';
import { RegisterDto } from '../../../../lib/core/src/auth/dto/register-auth.dto';
import { ValidateUserDto } from '../../../../lib/core/src/auth/dto/validate-user.dto';

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  validateUser(credentials: ValidateUserDto) {
    return this.authClient.send('validate_user', credentials);
  }

  login(loginDto: LoginDto) {
    return this.authClient.send('login', loginDto);
  }

  register(registerDto: RegisterDto) {
    return this.authClient.send('register', registerDto);
  }
}
