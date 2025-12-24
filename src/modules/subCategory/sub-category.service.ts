import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThan, MoreThan, Repository } from 'typeorm';
import { HelperService } from 'src/shared/global/helper.service';
import { SubCategory } from './entities/sub-category.entity';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from './dto/create-sub-category.dto';
import { DeleteSubCategoryDto } from './dto/delete-sub-category.dto';
import { Category } from '../category/entities/category.entity';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly helperService: HelperService,
  ) {}

  // Create new sub-category
  async create(
    createSubCategoryDto: CreateSubCategoryDto,
  ): Promise<SubCategory> {
    const slug = this.helperService.generateSlug(createSubCategoryDto.name);
    const existingBySlug = await this.subCategoryRepository.findOne({
      where: { slug: slug },
    });

    const category = await this.categoryRepository.findOne({
      where: { id: createSubCategoryDto.categoryId },
    });

    if (existingBySlug) {
      throw new ConflictException(
        `SubCategory with name "${createSubCategoryDto.name}" already exists`,
      );
    }

    if (!category) {
      throw new NotFoundException(
        `Category is "${createSubCategoryDto.categoryId}" Not Found`,
      );
    }

  const subcategoryData = {
    ...createSubCategoryDto,
    slug,
    category,
    categoryId: createSubCategoryDto.categoryId,
  };

    const subcategory = this.subCategoryRepository.create(subcategoryData);

    return await this.subCategoryRepository.save(subcategory);
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
  ): Promise<{ data: SubCategory[]; meta: any }> {
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
    const queryBuilder =
      this.subCategoryRepository.createQueryBuilder('category');

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
  async show(id: string): Promise<SubCategory> {
    const category = await this.subCategoryRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  //status category
  async status(id: string): Promise<SubCategory> {
    const category = await this.subCategoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    category.isActive = !category.isActive;
    return await this.subCategoryRepository.save(category);
  }

  //update category
  async update(
    id: string,
    updateSubCategoryDto: UpdateSubCategoryDto,
  ): Promise<SubCategory> {
    const category = await this.subCategoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    const slug = this.helperService.generateSlug(updateSubCategoryDto.name);
    const existingBySlug = await this.subCategoryRepository.findOne({
      where: { name: slug },
    });

    if (existingBySlug && existingBySlug.id !== id) {
      throw new ConflictException(
        `Category with name "${updateSubCategoryDto.name}" already exists`,
      );
    }

    if (
      !updateSubCategoryDto.slug &&
      (!updateSubCategoryDto.name ||
        updateSubCategoryDto.name === category.name)
    ) {
      updateSubCategoryDto.slug = category.slug;
    } else {
      updateSubCategoryDto.slug = slug;
    }

    Object.assign(category, updateSubCategoryDto);

    return await this.subCategoryRepository.save(category);
  }

  //delete category
  async delete(
    deleteSubCategoryDto: DeleteSubCategoryDto,
  ): Promise<SubCategory> {
    const { id, force } = deleteSubCategoryDto;
    const category = await this.subCategoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (force) {
      await this.subCategoryRepository.delete(id);
    } else {
      await this.subCategoryRepository.softDelete(id);
    }
    return category;
  }
}
