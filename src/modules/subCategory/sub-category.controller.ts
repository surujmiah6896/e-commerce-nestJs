import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { SubCategoryService } from './sub-category.service';
import { DeleteSubCategoryDto } from './dto/delete-sub-category.dto';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from './dto/create-sub-category.dto';

@ApiTags('subcategory')
@Controller('subcategory')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all sub-categories with filters' })
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
    description: 'sub-categories retrieved successfully',
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
    return this.subCategoryService
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
  @ApiOperation({ summary: 'Create a new sub-category' })
  @ApiResponse({ status: 201, description: 'SubCategory successfully created' })
  @ApiResponse({ status: 409, description: 'SubCategory already exists' })
  @ResponseMessage('🎉 SubCategory created successfully!')
  async create(@Body() createSubCategoryDto: CreateSubCategoryDto) {
    return this.subCategoryService.create(createSubCategoryDto);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Show a sub-category' })
  @ApiResponse({ status: 201, description: 'SubCategory successfully Show' })
  @ResponseMessage('🎉 Get SubCategory successfully!')
  async show(@Param('id') id: string) {
    return this.subCategoryService.show(id);
  }

  @Public()
  @Patch(':id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update a sub-category' })
  @ApiResponse({ status: 201, description: 'SubCategory successfully update' })
  @ApiResponse({ status: 409, description: 'SubCategory already exists' })
  @ResponseMessage('🎉 SubCategory update successfully!')
  async update(
    @Param('id') id: string,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    return this.subCategoryService.update(id, updateSubCategoryDto);
  }

  @Public()
  @Post('status/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update Status a sub-category' })
  @ApiResponse({
    status: 201,
    description: 'SubCategory successfully Update Status',
  })
  @ApiResponse({ status: 409, description: 'SubCategory already exists' })
  @ResponseMessage('🎉 SubCategory status update successfully!')
  async status(@Param('id') id: string) {
    return this.subCategoryService.status(id);
  }

  @Public()
  @Delete('delete')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new sub-category' })
  @ApiResponse({ status: 201, description: 'SubCategory successfully created' })
  @ApiResponse({ status: 409, description: 'SubCategory already exists' })
  @ResponseMessage('🎉 SubCategory Delete successfully!')
  async delete(@Body() deleteSubCategoryDto: DeleteSubCategoryDto) {
    return this.subCategoryService.delete(deleteSubCategoryDto);
  }
}
