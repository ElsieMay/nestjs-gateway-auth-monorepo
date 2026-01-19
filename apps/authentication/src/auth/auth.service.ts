import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from '../../../../lib/core/src/auth-domain/dto/request/register-auth.dto';
import { ValidateUserDto } from '../../../../lib/core/src/auth-domain/dto/request/validate-user.dto';
import { LoginDto } from '../../../../lib/core/src/auth-domain/dto/request/login.dto';
import { AuthResponseDto } from '../../../../lib/core/src/auth-domain/dto/response/auth-response.dto';
import {
  hashPassword,
  comparePassword,
} from '../../../../lib/common/utils/password.util';
import { Role } from '../../../../lib/core/src/auth-domain/enums/roles.enum';
import { UsersRepository } from '../../../../lib/core/src/users-domain';

interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  roles: Role[];
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(credentials: ValidateUserDto): Promise<AuthResponseDto> {
    const { email, password } = credentials;
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles,
    };
    const access_token = this.jwtService.sign(payload);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return {
      access_token,
      user: userWithoutPassword,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    return await this.validateUser(loginDto);
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, username } = registerDto;

    const existingUser = await this.usersRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const existingUsername =
      await this.usersRepository.findByUsername(username);
    if (existingUsername) {
      throw new ConflictException('Username already in use');
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await this.usersRepository.create({
      email,
      username,
      password: hashedPassword,
      roles: [Role.USER],
    });

    const payload: JwtPayload = {
      sub: newUser.id,
      email: newUser.email,
      username: newUser.username,
      roles: newUser.roles,
    };
    const access_token = this.jwtService.sign(payload);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = newUser;

    return {
      access_token,
      user: userWithoutPassword,
    };
  }
}
