import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { DeleteProductDto } from './dto/delete-product.dto';

@ApiTags('Product')
@Controller('Product')
export class ProductController {
  constructor(private readonly ProductService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories with filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'parentId', required: false, type: String })
  @ApiQuery({ name: 'position', required: false, type: Number })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['name', 'position', 'createdAt'],
  })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
  })
  async getAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('isActive') isActive?: boolean,
    @Query('parentId') parentId?: string,
    @Query('position') position?: number,
    @Query('sortBy') sortBy: string = 'position',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  ) {
    return this.ProductService
      .getAll
      // page,
      // limit,
      // { search, isActive, parentId, position },
      // sortBy,
      // sortOrder,
      ();
  }

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new Product' })
  @ApiResponse({ status: 201, description: 'Product successfully created' })
  @ApiResponse({ status: 409, description: 'Product already exists' })
  @ResponseMessage('🎉 Product created successfully!')
  async create(@Body() createProductDto: CreateProductDto) {
    return this.ProductService.create(createProductDto);
  }


  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Show a Product' })
  @ApiResponse({ status: 201, description: 'Product successfully Show' })
  @ResponseMessage('🎉 Get Product successfully!')
  async show(@Param('id') id: string) {
    return this.ProductService.show(id);
  }

  @Public()
  @Patch(':id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update a Product' })
  @ApiResponse({ status: 201, description: 'Product successfully update' })
  @ApiResponse({ status: 409, description: 'Product already exists' })
  @ResponseMessage('🎉 Product update successfully!')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.ProductService.update(id, updateProductDto);
  }

  @Public()
  @Post('status/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update Status a Product' })
  @ApiResponse({
    status: 201,
    description: 'Product successfully Update Status',
  })
  @ApiResponse({ status: 409, description: 'Product already exists' })
  @ResponseMessage('🎉 Product status update successfully!')
  async status(@Param('id') id: string) {
    return this.ProductService.status(id);
  }

  @Public()
  @Delete('delete')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new Product' })
  @ApiResponse({ status: 201, description: 'Product successfully created' })
  @ApiResponse({ status: 409, description: 'Product already exists' })
  @ResponseMessage('🎉 Product Delete successfully!')
  async delete(@Body() deleteProductDto: DeleteProductDto) {
    return this.ProductService.delete(deleteProductDto);
  }
}
