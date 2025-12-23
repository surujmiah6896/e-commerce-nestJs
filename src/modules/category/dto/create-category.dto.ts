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
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateCategoryDto {
    @ApiProperty({
        example: 'Electronics',
        description: 'Category name (must be unique)',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(2, { message: 'Name must be at least 2 characters long' })
    @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
    @Transform(({ value }) => value?.trim())
    name: string;

    @ApiPropertyOptional({
        example: 'electronics',
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
        example: 'Devices and gadgets including smartphones, laptops, etc.',
        description: 'Category description',
    })
    @IsOptional()
    @IsString()
    @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
    @Transform(({ value }) => value?.trim())
    description?: string;

    @ApiPropertyOptional({
        example: '💻',
        description: 'Icon or emoji representing the category',
    })
    @IsOptional()
    @IsString()
    @MaxLength(10, { message: 'Icon cannot exceed 10 characters' })
    icon?: string;

    @ApiPropertyOptional({
        example: '#3B82F6',
        description: 'Color code for the category (hex, rgb, or name)',
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
        example: 'https://example.com/category-image.jpg',
        description: 'Category image URL',
    })
    @IsOptional()
    @IsString()
    @IsUrl({}, { message: 'Image must be a valid URL' })
    @MaxLength(500, { message: 'Image URL cannot exceed 500 characters' })
    image?: string;

    @ApiPropertyOptional({
        example: true,
        description: 'Whether the category is active',
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    isActive?: boolean = true;

    @ApiPropertyOptional({
        example: 'Best Electronics - Smartphones, Laptops & More',
        description: 'SEO meta title',
    })
    @IsOptional()
    @IsString()
    @MaxLength(70, { message: 'Meta title cannot exceed 70 characters' })
    @Transform(({ value }) => value?.trim())
    metaTitle?: string;

    @ApiPropertyOptional({
        example:
            'Shop the latest electronics including smartphones, laptops, tablets, and accessories at best prices.',
        description: 'SEO meta description',
    })
    @IsOptional()
    @IsString()
    @MaxLength(160, { message: 'Meta description cannot exceed 160 characters' })
    @Transform(({ value }) => value?.trim())
    metaDescription?: string;

    @ApiPropertyOptional({
        example: 'electronics, gadgets, smartphones, laptops, technology',
        description: 'SEO meta keywords',
    })
    @IsOptional()
    @IsString()
    @MaxLength(255, { message: 'Meta keywords cannot exceed 255 characters' })
    @Transform(({ value }) => value?.trim())
    metaKey?: string;

    @ApiPropertyOptional({
        example: '<h1>Welcome to Electronics</h1><p>Best electronic gadgets...</p>',
        description: 'Meta content or rich text for the category page',
    })
    @IsOptional()
    @IsString()
    metaContent?: string;
}
