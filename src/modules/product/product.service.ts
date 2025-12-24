import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThan, MoreThan, Repository } from 'typeorm';
import { HelperService } from 'src/shared/global/helper.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { DeleteProductDto } from './dto/delete-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly helperService: HelperService,
  ) {}

  // Create new Product
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const existingByName = await this.productRepository.findOne({
      where: { name: createProductDto.name },
    });

    if (existingByName) {
      throw new ConflictException(
        `Product with name "${createProductDto.name}" already exists`,
      );
    }

    const product = this.productRepository.create({
      ...createProductDto
    });

    return await this.productRepository.save(product);
  }

  //get all Product
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
  ): Promise<{ data: Product[]; meta: any }> {
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
    const queryBuilder = this.productRepository.createQueryBuilder('Product');

    // Apply where conditions
    if (Object.keys(whereConditions).length > 0) {
      queryBuilder.where(whereConditions);
    }

    // Search filter (uses LIKE for partial match)
    if (filters?.search) {
      queryBuilder.andWhere(
        '(Product.name LIKE :search OR Product.description LIKE :search OR Product.slug LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    // Ordering
    queryBuilder.orderBy('Product.position', 'ASC');
    queryBuilder.addOrderBy('Product.name', 'ASC');

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

  //show Product
  async show(id: string): Promise<Product> {
    const Product = await this.productRepository.findOne({
      where: {id}
    });

    if (!Product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return Product;
  }

  //status Product
  async status(id: string): Promise<Product> {
    const Product = await this.productRepository.findOne({
      where: { id },
    });

    if (!Product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    Product.isActive = !Product.isActive;
    return await this.productRepository.save(Product);
  }

  //update Product
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const Product = await this.productRepository.findOne({ where: { id } });

    if (!Product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const slug = this.helperService.generateSlug(updateProductDto.name);
    const existingBySlug = await this.productRepository.findOne({
      where: { name: slug },
    });

    if (existingBySlug && existingBySlug.id !== id) {
      throw new ConflictException(
        `Product with name "${updateProductDto.name}" already exists`,
      );
    }

    Object.assign(Product, updateProductDto);

    return await this.productRepository.save(Product);
  }

  //delete Product
  async delete(deleteProductDto: DeleteProductDto): Promise<Product> {
    const { id, force } = deleteProductDto;
    const Product = await this.productRepository.findOne({
      where: { id },
    });

    if (!Product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (force) {
      await this.productRepository.delete(id);
    } else {
      await this.productRepository.softDelete(id);
    }
    return Product;
  }
}
