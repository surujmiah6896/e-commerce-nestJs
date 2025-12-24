import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Variant } from './entities/variant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThan, MoreThan, Repository } from 'typeorm';
import { HelperService } from 'src/shared/global/helper.service';
import { CreateVariantDto, UpdateVariantDto } from './dto/create-variant.dto';
import { DeleteVariantDto } from './dto/delete-variant.dto';

@Injectable()
export class VariantService {
  constructor(
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
    private readonly helperService: HelperService,
  ) {}

  // Create new Variant
  async create(createVariantDto: CreateVariantDto): Promise<Variant> {
    const existingByName = await this.variantRepository.findOne({
      where: { name: createVariantDto.name },
    });

    if (existingByName) {
      throw new ConflictException(
        `Variant with name "${createVariantDto.name}" already exists`,
      );
    }

    const Variant = this.variantRepository.create({
      ...createVariantDto,
    });

    return await this.variantRepository.save(Variant);
  }

  //get all Variant
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
  ): Promise<{ data: Variant[]; meta: any }> {
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
    const queryBuilder = this.variantRepository.createQueryBuilder('Variant');

    // Apply where conditions
    if (Object.keys(whereConditions).length > 0) {
      queryBuilder.where(whereConditions);
    }

    // Search filter (uses LIKE for partial match)
    if (filters?.search) {
      queryBuilder.andWhere(
        '(Variant.name LIKE :search OR Variant.description LIKE :search OR Variant.slug LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    // Ordering
    queryBuilder.orderBy('Variant.position', 'ASC');
    queryBuilder.addOrderBy('Variant.name', 'ASC');

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

  //show Variant
  async show(id: string): Promise<Variant> {
    const Variant = await this.variantRepository.findOne({
      where: { id },
    });

    if (!Variant) {
      throw new NotFoundException(`Variant with ID ${id} not found`);
    }
    return Variant;
  }

  //status Variant
  async status(id: string): Promise<Variant> {
    const Variant = await this.variantRepository.findOne({
      where: { id },
    });

    if (!Variant) {
      throw new NotFoundException(`Variant with ID ${id} not found`);
    }

    Variant.isActive = !Variant.isActive;
    return await this.variantRepository.save(Variant);
  }

  //update Variant
  async update(
    id: string,
    updateVariantDto: UpdateVariantDto,
  ): Promise<Variant> {
    const Variant = await this.variantRepository.findOne({ where: { id } });

    if (!Variant) {
      throw new NotFoundException(`Variant with ID ${id} not found`);
    }

    const existingBySlug = await this.variantRepository.findOne({
      where: { name: updateVariantDto.name },
    });

    if (existingBySlug && existingBySlug.id !== id) {
      throw new ConflictException(
        `Variant with name "${updateVariantDto.name}" already exists`,
      );
    }

    Object.assign(Variant, updateVariantDto);

    return await this.variantRepository.save(Variant);
  }

  //delete Variant
  async delete(deleteVariantDto: DeleteVariantDto): Promise<Variant> {
    const { id, force } = deleteVariantDto;
    const Variant = await this.variantRepository.findOne({
      where: { id },
    });

    if (!Variant) {
      throw new NotFoundException(`Variant with ID ${id} not found`);
    }
    
    if (force) {
      await this.variantRepository.delete(id);
    } else {
      await this.variantRepository.softDelete(id);
    }
    return Variant;
  }
}
