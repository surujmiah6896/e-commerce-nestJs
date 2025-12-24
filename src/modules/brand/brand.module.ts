import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { Brand } from './entities/brand.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Brand])],
  providers: [BrandService],
  controllers: [BrandController],
  exports: [BrandService, TypeOrmModule],
})
export class BrandModule {}
