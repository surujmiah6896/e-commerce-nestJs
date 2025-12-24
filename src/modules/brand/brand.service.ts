import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Brand } from './entities/brand.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThan, MoreThan, Repository } from 'typeorm';
import { HelperService } from 'src/shared/global/helper.service';
import { CreateBrandDto, UpdateBrandDto } from './dto/create-brand.dto';
import { DeleteBrandDto } from './dto/delete-brand.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly BrandRepository: Repository<Brand>,
    private readonly helperService: HelperService,
  ) {}

  // Create new Brand
  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    const existingByName = await this.BrandRepository.findOne({
      where: { name: createBrandDto.name },
    });

    if (existingByName) {
      throw new ConflictException(
        `Brand with name "${createBrandDto.name}" already exists`,
      );
    }

    const Brand = this.BrandRepository.create({
      ...createBrandDto
    });

    return await this.BrandRepository.save(Brand);
  }

  //get all Brand
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
  ): Promise<{ data: Brand[]; meta: any }> {
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
    const queryBuilder = this.BrandRepository.createQueryBuilder('Brand');

    // Apply where conditions
    if (Object.keys(whereConditions).length > 0) {
      queryBuilder.where(whereConditions);
    }

    // Search filter (uses LIKE for partial match)
    if (filters?.search) {
      queryBuilder.andWhere(
        '(Brand.name LIKE :search OR Brand.description LIKE :search OR Brand.slug LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    // Ordering
    queryBuilder.orderBy('Brand.position', 'ASC');
    queryBuilder.addOrderBy('Brand.name', 'ASC');

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

  //show Brand
  async show(id: string): Promise<Brand> {
    const brand = await this.BrandRepository.findOne({
      where: {id}
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
    return brand;
  }

  //status Brand
  async status(id: string): Promise<Brand> {
    const brand = await this.BrandRepository.findOne({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    brand.isActive = !brand.isActive;
    return await this.BrandRepository.save(brand);
  }

  //update Brand
  async update(
    id: string,
    updateBrandDto: UpdateBrandDto,
  ): Promise<Brand> {
    const brand = await this.BrandRepository.findOne({ where: { id } });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    const slug = this.helperService.generateSlug(updateBrandDto.name);
    const existingBySlug = await this.BrandRepository.findOne({
      where: { name: slug },
    });

    if (existingBySlug && existingBySlug.id !== id) {
      throw new ConflictException(
        `Brand with name "${updateBrandDto.name}" already exists`,
      );
    }

    Object.assign(brand, updateBrandDto);

    return await this.BrandRepository.save(brand);
  }

  //delete Brand
  async delete(deleteBrandDto: DeleteBrandDto): Promise<Brand> {
    const { id, force } = deleteBrandDto;
    const brand = await this.BrandRepository.findOne({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    if (force) {
      await this.BrandRepository.delete(id);
    } else {
      await this.BrandRepository.softDelete(id);
    }
    return brand;
  }
}
