import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateAttributeDto, UpdateAttributeDto } from './dto/create-attribute.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { DeleteAttributeDto } from './dto/delete-attribute.dto';
import { AttributeService } from './attribute.service';

@ApiTags('attribute')
@Controller('attribute')
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Get()
  @ApiOperation({ summary: 'Get all attributes with filters' })
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
    description: 'Attributes retrieved successfully',
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
    return this.attributeService
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
  @ApiOperation({ summary: 'Create a new Attribute' })
  @ApiResponse({ status: 201, description: 'Attribute successfully created' })
  @ApiResponse({ status: 409, description: 'Attribute already exists' })
  @ResponseMessage('🎉 Attribute created successfully!')
  async create(@Body() createAttributeDto: CreateAttributeDto) {
    return this.attributeService.create(createAttributeDto);
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Show a Attribute' })
  @ApiResponse({ status: 201, description: 'Attribute successfully Show' })
  @ResponseMessage('🎉 Get Attribute successfully!')
  async show(@Param('id') id: string) {
    return this.attributeService.show(id);
  }

  @Public()
  @Patch(':id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update a Attribute' })
  @ApiResponse({ status: 201, description: 'Attribute successfully update' })
  @ApiResponse({ status: 409, description: 'Attribute already exists' })
  @ResponseMessage('🎉 Attribute update successfully!')
  async update(
    @Param('id') id: string,
    @Body() updateAttributeDto: UpdateAttributeDto,
  ) {
    return this.attributeService.update(id, updateAttributeDto);
  }

  @Public()
  @Post('status/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update Status a Attribute' })
  @ApiResponse({
    status: 201,
    description: 'Attribute successfully Update Status',
  })
  @ApiResponse({ status: 409, description: 'Attribute already exists' })
  @ResponseMessage('🎉 Attribute status update successfully!')
  async status(@Param('id') id: string) {
    return this.attributeService.status(id);
  }

  @Public()
  @Delete('delete')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new Attribute' })
  @ApiResponse({ status: 201, description: 'Attribute successfully created' })
  @ApiResponse({ status: 409, description: 'Attribute already exists' })
  @ResponseMessage('🎉 Attribute Delete successfully!')
  async delete(@Body() deleteAttributeDto: DeleteAttributeDto) {
    return this.attributeService.delete(deleteAttributeDto);
  }
}
