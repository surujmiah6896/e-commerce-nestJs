import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export class CreateResponseDto {
  @ApiProperty({
    example: 201,
    description: 'HTTP status code',
    enum: HttpStatus,
  })
  statusCode: number;

  @ApiProperty({
    example: 'Success',
    description: 'Response message',
  })
  message: string;

  @ApiProperty({
    description: 'Response data',
    required: false,
  })
  data?: any;
}

export class UpdateResponseDto extends CreateResponseDto {}
