import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ example: 'strongpassword123' })
  password: string;
}
