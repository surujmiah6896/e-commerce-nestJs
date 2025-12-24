import { Module } from '@nestjs/common';
import { AttributeController } from './attribute.controller';
import { Attribute } from './entities/attribute.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeService } from './attribute.service';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Attribute]), ProductModule],
  providers: [AttributeService],
  controllers: [AttributeController],
  exports: [AttributeService, TypeOrmModule],
})
export class AttributeModule {}
