import { IsEmail, IsString, MinLength } from 'class-validator';

export class ValidateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class ValidatedUserDto {
  @IsString()
  id: string;
  @IsEmail()
  email: string;
  @IsString()
  username: string;
}

export class LoginDto {
  @IsString()
  access_token: string;
  @IsString()
  user?: ValidatedUserDto;
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}
