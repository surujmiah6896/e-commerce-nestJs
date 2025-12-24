import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Supplier } from './entities/supplier.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThan, MoreThan, Repository } from 'typeorm';
import { HelperService } from 'src/shared/global/helper.service';
import { CreateSupplierDto, UpdateSupplierDto } from './dto/create-supplier.dto';
import { DeleteSupplierDto } from './dto/delete-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    private readonly helperService: HelperService,
  ) {}

  // Create new Supplier
  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    const existingByName = await this.supplierRepository.findOne({
      where: { name: createSupplierDto.name },
    });

    if (existingByName) {
      throw new ConflictException(
        `Supplier with name "${createSupplierDto.name}" already exists`,
      );
    }

    const Supplier = this.supplierRepository.create({
      ...createSupplierDto
    });

    return await this.supplierRepository.save(Supplier);
  }

  //get all Supplier
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
  ): Promise<{ data: Supplier[]; meta: any }> {
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
    const queryBuilder = this.supplierRepository.createQueryBuilder('Supplier');

    // Apply where conditions
    if (Object.keys(whereConditions).length > 0) {
      queryBuilder.where(whereConditions);
    }

    // Search filter (uses LIKE for partial match)
    if (filters?.search) {
      queryBuilder.andWhere(
        '(Supplier.name LIKE :search OR Supplier.description LIKE :search OR Supplier.slug LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    // Ordering
    queryBuilder.orderBy('Supplier.position', 'ASC');
    queryBuilder.addOrderBy('Supplier.name', 'ASC');

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

  //show Supplier
  async show(id: string): Promise<Supplier> {
    const Supplier = await this.supplierRepository.findOne({
      where: {id}
    });

    if (!Supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }
    return Supplier;
  }

  //status Supplier
  async status(id: string): Promise<Supplier> {
    const Supplier = await this.supplierRepository.findOne({
      where: { id },
    });

    if (!Supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    Supplier.isActive = !Supplier.isActive;
    return await this.supplierRepository.save(Supplier);
  }

  //update Supplier
  async update(
    id: string,
    updateSupplierDto: UpdateSupplierDto,
  ): Promise<Supplier> {
    const Supplier = await this.supplierRepository.findOne({ where: { id } });

    if (!Supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    const slug = this.helperService.generateSlug(updateSupplierDto.name);
    const existingBySlug = await this.supplierRepository.findOne({
      where: { name: slug },
    });

    if (existingBySlug && existingBySlug.id !== id) {
      throw new ConflictException(
        `Supplier with name "${updateSupplierDto.name}" already exists`,
      );
    }

    Object.assign(Supplier, updateSupplierDto);

    return await this.supplierRepository.save(Supplier);
  }

  //delete Supplier
  async delete(deleteSupplierDto: DeleteSupplierDto): Promise<Supplier> {
    const { id, force } = deleteSupplierDto;
    const Supplier = await this.supplierRepository.findOne({
      where: { id },
    });

    if (!Supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    if (force) {
      await this.supplierRepository.delete(id);
    } else {
      await this.supplierRepository.softDelete(id);
    }
    return Supplier;
  }
}
