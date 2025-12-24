import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/create-category.dto';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { DeleteCategoryDto } from './dto/delete-category.dto';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

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
    return this.categoryService
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
  @ApiOperation({ summary: 'Create a new Category' })
  @ApiResponse({ status: 201, description: 'Category successfully created' })
  @ApiResponse({ status: 409, description: 'Category already exists' })
  @ResponseMessage('🎉 Category created successfully!')
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Show a Category' })
  @ApiResponse({ status: 201, description: 'Category successfully Show' })
  @ResponseMessage('🎉 Get Category successfully!')
  async show(@Param('id') id: string) {
    return this.categoryService.show(id);
  }

  @Public()
  @Patch(':id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new Category' })
  @ApiResponse({ status: 201, description: 'Category successfully created' })
  @ApiResponse({ status: 409, description: 'Category already exists' })
  @ResponseMessage('🎉 Category update successfully!')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Public()
  @Post('status/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new Category' })
  @ApiResponse({ status: 201, description: 'Category successfully created' })
  @ApiResponse({ status: 409, description: 'Category already exists' })
  @ResponseMessage('🎉 Category update successfully!')
  async status(
    @Param('id') id: string,
  ) {
    return this.categoryService.status(id);
  }

  @Public()
  @Delete('delete')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new Category' })
  @ApiResponse({ status: 201, description: 'Category successfully created' })
  @ApiResponse({ status: 409, description: 'Category already exists' })
  @ResponseMessage('🎉 Category Delete successfully!')
  async delete(@Body() deleteCategoryDto: DeleteCategoryDto) {
    return this.categoryService.delete(deleteCategoryDto);
  }
}
