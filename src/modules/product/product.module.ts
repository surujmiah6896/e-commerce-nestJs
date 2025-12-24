import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../category/category.module';
import { SubCategoryModule } from '../subCategory/sub-category.module';
import { ProductImage } from './entities/product-image.entity';
import { BrandModule } from '../brand/brand.module';
import { BrandService } from '../brand/brand.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product,ProductImage]), CategoryModule, SubCategoryModule, BrandModule],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService, TypeOrmModule],
})
export class ProductModule {}
