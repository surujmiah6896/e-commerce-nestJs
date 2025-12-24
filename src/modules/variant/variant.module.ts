import { Module } from '@nestjs/common';
import { VariantController } from './variant.controller';
import { Variant } from './entities/variant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VariantService } from './variant.service';

@Module({
  imports: [TypeOrmModule.forFeature([Variant])],
  providers: [VariantService],
  controllers: [VariantController],
  exports: [VariantService, TypeOrmModule],
})
export class VariantModule {}
