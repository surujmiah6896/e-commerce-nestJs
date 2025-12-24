import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { BrandService } from './brand.service';
import { CreateBrandDto, UpdateBrandDto } from './dto/create-brand.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { DeleteBrandDto } from './dto/delete-brand.dto';

@ApiTags('brand')
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

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
    return this.brandService
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
  @ApiOperation({ summary: 'Create a new Brand' })
  @ApiResponse({ status: 201, description: 'Brand successfully created' })
  @ApiResponse({ status: 409, description: 'Brand already exists' })
  @ResponseMessage('🎉 Brand created successfully!')
  async create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }


  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Show a Brand' })
  @ApiResponse({ status: 201, description: 'Brand successfully Show' })
  @ResponseMessage('🎉 Get Brand successfully!')
  async show(@Param('id') id: string) {
    return this.brandService.show(id);
  }

  @Public()
  @Patch(':id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update a Brand' })
  @ApiResponse({ status: 201, description: 'Brand successfully update' })
  @ApiResponse({ status: 409, description: 'Brand already exists' })
  @ResponseMessage('🎉 Brand update successfully!')
  async update(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
    return this.brandService.update(id, updateBrandDto);
  }

  @Public()
  @Post('status/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update Status a Brand' })
  @ApiResponse({
    status: 201,
    description: 'Brand successfully Update Status',
  })
  @ApiResponse({ status: 409, description: 'Brand already exists' })
  @ResponseMessage('🎉 Brand status update successfully!')
  async status(@Param('id') id: string) {
    return this.brandService.status(id);
  }

  @Public()
  @Delete('delete')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new Brand' })
  @ApiResponse({ status: 201, description: 'Brand successfully created' })
  @ApiResponse({ status: 409, description: 'Brand already exists' })
  @ResponseMessage('🎉 Brand Delete successfully!')
  async delete(@Body() deleteBrandDto: DeleteBrandDto) {
    return this.brandService.delete(deleteBrandDto);
  }
}
