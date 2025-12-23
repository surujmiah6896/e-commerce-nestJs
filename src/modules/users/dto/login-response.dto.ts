// src/modules/user/dto/login-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

export class LoginResponseDto {
  @ApiProperty()
  user: UserResponseDto;

  @ApiProperty()
  token: string;
}

export class RegisterResponseDto extends LoginResponseDto {}
