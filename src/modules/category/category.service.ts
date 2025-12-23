import { ConflictException, Injectable } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelperService } from 'src/shared/global/helper.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly helperService: HelperService,
  ) {}

  // Create new category
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
      const slug = this.helperService.generateSlug(createCategoryDto.name);
      const existingBySlug = await this.categoryRepository.findOne({
        where: { slug: slug },
      });

      if (existingBySlug) {
        throw new ConflictException(
          `Category with name "${createCategoryDto.name}" already exists`,
        );
      }

      const category = this.categoryRepository.create({
        ...createCategoryDto,
        slug,
      });

      return await this.categoryRepository.save(category);
  }
}
