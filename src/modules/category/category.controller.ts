import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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

  @Public()
  @Post('create')
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
