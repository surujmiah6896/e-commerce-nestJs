// src/modules/user/dto/user-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ type: [String] })
  roles: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  fullName?: string; // Optional computed property
}

// Helper function to convert User entity to UserResponseDto
export function toUserResponseDto(user: any): UserResponseDto {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isActive: user.isActive,
    roles: user.roles,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    fullName: `${user.firstName} ${user.lastName}`,
  };
}
