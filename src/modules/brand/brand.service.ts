import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThan, MoreThan, Repository } from 'typeorm';
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
      slug
    });

    return await this.categoryRepository.save(category);
  }

  //get all category
  async getAll(
    page: number = 1,
    limit: number = 10,
    filters?: {
      search?: string;
      isActive?: boolean;
      parentId?: string;
      createdAtFrom?: Date;
      createdAtTo?: Date;
      positionMin?: number;
      positionMax?: number;
    },
  ): Promise<{ data: Category[]; meta: any }> {
    const skip = (page - 1) * limit;

    // Build where conditions
    const whereConditions: any = {};

    // Active status filter
    if (filters?.isActive !== undefined) {
      whereConditions.isActive = filters.isActive;
    } else {
      whereConditions.isActive = true; // Default to active only
    }

    // Parent filter
    if (filters?.parentId === 'null') {
      whereConditions.parentId = IsNull(); // Root categories
    } else if (filters?.parentId) {
      whereConditions.parentId = filters.parentId;
    }

    // Date range filter
    if (filters?.createdAtFrom || filters?.createdAtTo) {
      whereConditions.createdAt = {};
      if (filters.createdAtFrom) {
        whereConditions.createdAt = MoreThan(filters.createdAtFrom);
      }
      if (filters.createdAtTo) {
        whereConditions.createdAt = LessThan(filters.createdAtTo);
      }
    }

    // Position range filter
    if (
      filters?.positionMin !== undefined ||
      filters?.positionMax !== undefined
    ) {
      whereConditions.position = {};
      if (filters.positionMin !== undefined) {
        whereConditions.position = MoreThan(filters.positionMin);
      }
      if (filters.positionMax !== undefined) {
        whereConditions.position = LessThan(filters.positionMax);
      }
    }

    // Build query with caching
    const queryBuilder = this.categoryRepository.createQueryBuilder('category');

    // Apply where conditions
    if (Object.keys(whereConditions).length > 0) {
      queryBuilder.where(whereConditions);
    }

    // Search filter (uses LIKE for partial match)
    if (filters?.search) {
      queryBuilder.andWhere(
        '(category.name LIKE :search OR category.description LIKE :search OR category.slug LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    // Ordering
    queryBuilder.orderBy('category.position', 'ASC');
    queryBuilder.addOrderBy('category.name', 'ASC');

    // Pagination
    queryBuilder.skip(skip).take(limit);

    // Cache configuration (Redis recommended for production)
    queryBuilder.cache({
      id: `categories_${JSON.stringify(filters)}_page_${page}_limit_${limit}`,
      milliseconds: 30000, // 30 seconds cache
    });

    // Execute query
    const [categories, total] = await queryBuilder.getManyAndCount();

    return {
      data: categories,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
        filters: filters || {},
      },
    };
  }

  //show category
  async show(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
        subCategories: {
          isActive: true, // Only active subcategories
        },
      },
      relations: ['subCategories'],
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        isActive: true,
        subCategories: {
          id: true,
          name: true,
          slug: true,
          position: true,
          isActive: true,
        },
      },
      order: {
        subCategories: {
          position: 'ASC',
        },
      },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  //status category
  async status(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    category.isActive = !category.isActive;
    return await this.categoryRepository.save(category);
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
