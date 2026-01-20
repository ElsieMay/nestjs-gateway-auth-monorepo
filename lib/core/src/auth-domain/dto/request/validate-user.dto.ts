import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { SanitiseAndTrim } from '../../../../../common/decorators/sanitise.decorator';

export class ValidateUserDto {
  @IsEmail()
  @SanitiseAndTrim()
  @ApiProperty({ example: 'john@test.com' })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ example: 'strongpassword' })
  password: string;
}

export class ValidatedUserDto {
  @IsString()
  @ApiProperty({ example: 'e4b2c1a8-3f5d-4c2e-9b1a-8d7c6e5f4a3b' })
  id: string;

  @IsEmail()
  @SanitiseAndTrim()
  @ApiProperty({ example: 'john@test.com' })
  email: string;

  @IsString()
  @SanitiseAndTrim()
  username: string;
}
