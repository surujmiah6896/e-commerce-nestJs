import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsBoolean,
} from 'class-validator';

export class DeleteBrandDto {
  @ApiProperty({ description: 'Brand ID' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional({
    description: 'Force delete (permanent)',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  force?: boolean = false;
}

