import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../../users-domain/dto/response/user-response.dto';

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzIJ9...' })
  access_token: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
