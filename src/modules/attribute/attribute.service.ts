import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Attribute } from './entities/attribute.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThan, MoreThan, Repository } from 'typeorm';
import { HelperService } from 'src/shared/global/helper.service';
import { CreateAttributeDto, UpdateAttributeDto } from './dto/create-attribute.dto';
import { DeleteAttributeDto } from './dto/delete-attribute.dto';

@Injectable()
export class AttributeService {
  constructor(
    @InjectRepository(Attribute)
    private readonly attributeRepository: Repository<Attribute>,
    private readonly helperService: HelperService,
  ) {}

  // Create new Attribute
  async create(createAttributeDto: CreateAttributeDto): Promise<Attribute> {
    const existingByName = await this.attributeRepository.findOne({
      where: { name: createAttributeDto.name },
    });

    if (existingByName) {
      throw new ConflictException(
        `Attribute with name "${createAttributeDto.name}" already exists`,
      );
    }

    const attribute = this.attributeRepository.create({
      ...createAttributeDto,
    });

    return await this.attributeRepository.save(attribute);
  }

  //get all Attribute
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
  ): Promise<{ data: Attribute[]; meta: any }> {
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
      this.attributeRepository.createQueryBuilder('Attribute');

    // Apply where conditions
    if (Object.keys(whereConditions).length > 0) {
      queryBuilder.where(whereConditions);
    }

    // Search filter (uses LIKE for partial match)
    if (filters?.search) {
      queryBuilder.andWhere(
        '(Attribute.name LIKE :search OR Attribute.description LIKE :search OR Attribute.slug LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    // Ordering
    queryBuilder.orderBy('Attribute.position', 'ASC');
    queryBuilder.addOrderBy('Attribute.name', 'ASC');

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

  //show Attribute
  async show(id: string): Promise<Attribute> {
    const attribute = await this.attributeRepository.findOne({
      where: { id },
    });

    if (!attribute) {
      throw new NotFoundException(`Attribute with ID ${id} not found`);
    }
    return attribute;
  }

  //status Attribute
  async status(id: string): Promise<Attribute> {
    const attribute = await this.attributeRepository.findOne({
      where: { id },
    });

    if (!attribute) {
      throw new NotFoundException(`Attribute with ID ${id} not found`);
    }

    attribute.isActive = !attribute.isActive;
    return await this.attributeRepository.save(attribute);
  }

  //update Attribute
  async update(
    id: string,
    updateAttributeDto: UpdateAttributeDto,
  ): Promise<Attribute> {
    const attribute = await this.attributeRepository.findOne({ where: { id } });

    if (!attribute) {
      throw new NotFoundException(`Attribute with ID ${id} not found`);
    }

    const existingBySlug = await this.attributeRepository.findOne({
      where: { name: updateAttributeDto.name },
    });

    if (existingBySlug && existingBySlug.id !== id) {
      throw new ConflictException(
        `Attribute with name "${updateAttributeDto.name}" already exists`,
      );
    }

    Object.assign(attribute, updateAttributeDto);

    return await this.attributeRepository.save(attribute);
  }

  //delete Attribute
  async delete(deleteAttributeDto: DeleteAttributeDto): Promise<Attribute> {
    const { id, force } = deleteAttributeDto;
    const attribute = await this.attributeRepository.findOne({
      where: { id },
    });

    if (!attribute) {
      throw new NotFoundException(`Attribute with ID ${id} not found`);
    }
    
    if (force) {
      await this.attributeRepository.delete(id);
    } else {
      await this.attributeRepository.softDelete(id);
    }
    return attribute;
  }
}
