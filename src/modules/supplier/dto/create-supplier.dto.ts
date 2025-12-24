import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsInt,
    IsBoolean,
    IsUrl,
    MaxLength,
    MinLength,
    Min,
    Max,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateSupplierDto {
  @ApiProperty({
    example: 'SQuare',
    description: 'Supplier name (must be unique)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiPropertyOptional({
    example: 'Devices and gadgets including smartphones, laptops, etc.',
    description: 'Supplier description',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
  @Transform(({ value }) => value?.trim())
  description?: string;

  @ApiPropertyOptional({
    example: 'B-23, bank-colony, savar, dhaka.',
    description: 'Supplier address',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'address cannot exceed 500 characters' })
  address?: string;

  
  @ApiPropertyOptional({
    example: 1,
    description: 'this phone number',
    default: 1711100000,
  })
  @IsOptional()
  @IsInt()
  @Max(11, { message: 'max 11 digit' })
  @Type(() => Number)
  phone?: number = 0;

  
  @ApiPropertyOptional({
    example: 1,
    description: 'Display position/order (lower numbers appear first)',
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0, { message: 'Position must be 0 or greater' })
  @Max(999, { message: 'Position cannot exceed 999' })
  @Type(() => Number)
  position?: number = 0;

  @ApiPropertyOptional({
    example: 'https://example.com/Supplier-image.jpg',
    description: 'Supplier image URL',
  })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'Image must be a valid URL' })
  @MaxLength(500, { message: 'Image URL cannot exceed 500 characters' })
  image?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the Supplier is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean = true;
}


export class UpdateSupplierDto extends CreateSupplierDto{}