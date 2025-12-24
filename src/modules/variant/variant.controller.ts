import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateVariantDto, UpdateVariantDto } from './dto/create-variant.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { VariantService } from './variant.service';
import { DeleteVariantDto } from './dto/delete-variant.dto';

@ApiTags('variant')
@Controller('variant')
export class VariantController {
  constructor(private readonly variantService: VariantService) {}

  @Get()
  @ApiOperation({ summary: 'Get all Variants with filters' })
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
    description: 'Variants retrieved successfully',
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
    return this.variantService
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
  @ApiOperation({ summary: 'Create a new Variant' })
  @ApiResponse({ status: 201, description: 'Variant successfully created' })
  @ApiResponse({ status: 409, description: 'Variant already exists' })
  @ResponseMessage('🎉 Variant created successfully!')
  async create(@Body() createVariantDto: CreateVariantDto) {
    return this.variantService.create(createVariantDto);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Show a Variant' })
  @ApiResponse({ status: 201, description: 'Variant successfully Show' })
  @ResponseMessage('🎉 Get Variant successfully!')
  async show(@Param('id') id: string) {
    return this.variantService.show(id);
  }

  @Public()
  @Patch(':id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update a Variant' })
  @ApiResponse({ status: 201, description: 'Variant successfully update' })
  @ApiResponse({ status: 409, description: 'Variant already exists' })
  @ResponseMessage('🎉 Variant update successfully!')
  async update(
    @Param('id') id: string,
    @Body() updateVariantDto: UpdateVariantDto,
  ) {
    return this.variantService.update(id, updateVariantDto);
  }

  @Public()
  @Post('status/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update Status a Variant' })
  @ApiResponse({
    status: 201,
    description: 'Variant successfully Update Status',
  })
  @ApiResponse({ status: 409, description: 'Variant already exists' })
  @ResponseMessage('🎉 Variant status update successfully!')
  async status(@Param('id') id: string) {
    return this.variantService.status(id);
  }

  @Public()
  @Delete('delete')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new Variant' })
  @ApiResponse({ status: 201, description: 'Variant successfully created' })
  @ApiResponse({ status: 409, description: 'Variant already exists' })
  @ResponseMessage('🎉 Variant Delete successfully!')
  async delete(@Body() deleteVariantDto: DeleteVariantDto) {
    return this.variantService.delete(deleteVariantDto);
  } 
}
