import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { SanitiseAndTrim } from '../../../../../common/decorators/sanitise.decorator';

export class LoginDto {
  @IsEmail()
  @SanitiseAndTrim()
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ example: 'strongpassword123' })
  password: string;
}
