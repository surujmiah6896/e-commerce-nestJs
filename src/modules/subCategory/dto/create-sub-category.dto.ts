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
  Matches,
  IsUUID,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateSubCategoryDto {
  @ApiProperty({
    example: 'Smartphones',
    description: 'SubCategory name (must be unique)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Parent Category ID (UUID)',
  })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiPropertyOptional({
    example: 'smartphones',
    description: 'URL-friendly slug (auto-generated if not provided)',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim().toLowerCase())
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens',
  })
  slug?: string;

  @ApiPropertyOptional({
    example: 'Mobile phones including Android and iOS devices',
    description: 'SubCategory description',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
  @Transform(({ value }) => value?.trim())
  description?: string;

  @ApiPropertyOptional({
    example: '📱',
    description: 'Icon or emoji representing the subcategory',
  })
  @IsOptional()
  @IsString()
  @MaxLength(10, { message: 'Icon cannot exceed 10 characters' })
  icon?: string;

  @ApiPropertyOptional({
    example: '#3B82F6',
    description: 'Color code for the subcategory',
  })
  @IsOptional()
  @IsString()
  @Matches(
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$|^[a-zA-Z]+$/,
    {
      message:
        'Invalid color format. Use hex (#RRGGBB), rgb(r,g,b), or color name',
    },
  )
  color?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Display position/order within parent category',
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0, { message: 'Position must be 0 or greater' })
  @Max(999, { message: 'Position cannot exceed 999' })
  @Type(() => Number)
  position?: number = 0;

  @ApiPropertyOptional({
    example: 'https://example.com/subcategory-image.jpg',
    description: 'SubCategory image URL',
  })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'Image must be a valid URL' })
  @MaxLength(500, { message: 'Image URL cannot exceed 500 characters' })
  image?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the subcategory is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean = true;

  @ApiPropertyOptional({
    example: 'Best Smartphones 2024 - Latest Models & Reviews',
    description: 'SEO meta title',
  })
  @IsOptional()
  @IsString()
  @MaxLength(70, { message: 'Meta title cannot exceed 70 characters' })
  @Transform(({ value }) => value?.trim())
  metaTitle?: string;

  @ApiPropertyOptional({
    example:
      'Find the latest smartphones with reviews, prices, and comparisons. Best Android and iOS phones.',
    description: 'SEO meta description',
  })
  @IsOptional()
  @IsString()
  @MaxLength(160, { message: 'Meta description cannot exceed 160 characters' })
  @Transform(({ value }) => value?.trim())
  metaDescription?: string;

  @ApiPropertyOptional({
    example: 'smartphones, mobile phones, android, ios, latest phones',
    description: 'SEO meta keywords',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Meta keywords cannot exceed 255 characters' })
  @Transform(({ value }) => value?.trim())
  metaKey?: string;

  @ApiPropertyOptional({
    example:
      '<h1>Smartphones Collection</h1><p>Browse our smartphone collection...</p>',
    description: 'Meta content or rich text',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Meta content cannot exceed 2000 characters' })
  metaContent?: string;
}


export class UpdateSubCategoryDto extends CreateSubCategoryDto {}