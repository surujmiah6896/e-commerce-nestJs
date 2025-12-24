import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelperService } from 'src/shared/global/helper.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/create-category.dto';
import { DeleteCategoryDto } from './dto/delete-category.dto';

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

  //show category
  async show(id: string): Promise<Category>{
    const category = await this.categoryRepository.findOne({where:{id}})
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  //update category
  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    const slug = this.helperService.generateSlug(updateCategoryDto.name);
    const existingBySlug = await this.categoryRepository.findOne({
      where: { name: slug },
    });

    if (existingBySlug && existingBySlug.id !== id) {
      throw new ConflictException(
        `Category with name "${updateCategoryDto.name}" already exists`,
      );
    }

    if (
      !updateCategoryDto.slug &&
      (!updateCategoryDto.name || updateCategoryDto.name === category.name)
    ) {
      updateCategoryDto.slug = category.slug;
    } else {
      updateCategoryDto.slug = slug;
    }

    Object.assign(category, updateCategoryDto);

    return await this.categoryRepository.save(category);
  }

  //delete category
  async delete(deleteCategoryDto: DeleteCategoryDto): Promise<Category> {
    const { id, force } = deleteCategoryDto;
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (force) {
      await this.categoryRepository.delete(id);
    } else {
      await this.categoryRepository.softDelete(id);
    }

    return category;
  }
}
