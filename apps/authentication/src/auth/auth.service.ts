import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PinoLogger } from 'nestjs-pino';
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
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AuthService.name);
  }

  async validateUser(credentials: ValidateUserDto): Promise<AuthResponseDto> {
    const { email, password } = credentials;
    this.logger.info({ email }, 'Validating user credentials');

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      this.logger.warn({ email }, 'User not found');
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      this.logger.warn({ email }, 'Invalid password');
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

    this.logger.info({ userId: user.id, email }, 'User validated successfully');

    return {
      access_token,
      user: userWithoutPassword,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    this.logger.info({ email: loginDto.email }, 'User login attempt');
    const result = await this.validateUser(loginDto);
    this.logger.info({ email: loginDto.email }, 'User logged in successfully');
    return result;
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, username } = registerDto;
    this.logger.info({ email, username }, 'User registration attempt');

    const existingUser = await this.usersRepository.findByEmail(email);
    if (existingUser) {
      this.logger.warn({ email }, 'Email already in use');
      throw new ConflictException('Email already in use');
    }

    const existingUsername =
      await this.usersRepository.findByUsername(username);
    if (existingUsername) {
      this.logger.warn({ username }, 'Username already in use');
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

    this.logger.info(
      { userId: newUser.id, email, username },
      'User registered successfully',
    );

    return {
      access_token,
      user: userWithoutPassword,
    };
  }
}
