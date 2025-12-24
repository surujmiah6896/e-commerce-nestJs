import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto, UpdateSupplierDto } from './dto/create-supplier.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { DeleteSupplierDto } from './dto/delete-supplier.dto';

@ApiTags('Supplier')
@Controller('Supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

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
    return this.supplierService
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
  @ApiOperation({ summary: 'Create a new Supplier' })
  @ApiResponse({ status: 201, description: 'Supplier successfully created' })
  @ApiResponse({ status: 409, description: 'Supplier already exists' })
  @ResponseMessage('🎉 Supplier created successfully!')
  async create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.supplierService.create(createSupplierDto);
  }


  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Show a Supplier' })
  @ApiResponse({ status: 201, description: 'Supplier successfully Show' })
  @ResponseMessage('🎉 Get Supplier successfully!')
  async show(@Param('id') id: string) {
    return this.supplierService.show(id);
  }

  @Public()
  @Patch(':id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update a Supplier' })
  @ApiResponse({ status: 201, description: 'Supplier successfully update' })
  @ApiResponse({ status: 409, description: 'Supplier already exists' })
  @ResponseMessage('🎉 Supplier update successfully!')
  async update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ) {
    return this.supplierService.update(id, updateSupplierDto);
  }

  @Public()
  @Post('status/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update Status a Supplier' })
  @ApiResponse({
    status: 201,
    description: 'Supplier successfully Update Status',
  })
  @ApiResponse({ status: 409, description: 'Supplier already exists' })
  @ResponseMessage('🎉 Supplier status update successfully!')
  async status(@Param('id') id: string) {
    return this.supplierService.status(id);
  }

  @Public()
  @Delete('delete')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new Supplier' })
  @ApiResponse({ status: 201, description: 'Supplier successfully created' })
  @ApiResponse({ status: 409, description: 'Supplier already exists' })
  @ResponseMessage('🎉 Supplier Delete successfully!')
  async delete(@Body() deleteSupplierDto: DeleteSupplierDto) {
    return this.supplierService.delete(deleteSupplierDto);
  }
}
