// cruds.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { CrudsService } from './cruds.service';
import { ApiCustomResponses } from '../decorators/customResponses.decorator';
import { ResponseUtil } from '../utils/response.util';
import { CreateCrudDto } from './dto/crud.dto';

@Controller('cruds')
export class CrudsController {
  constructor(private readonly crudsService: CrudsService) { }

  @ApiCustomResponses({ summary: 'Get all UUIDs', successExample: { uuids: ['string', 'string'] } })
  @Get()
  async getUuidList() {
    const uuids = await this.crudsService.getUuidList();
    return ResponseUtil.success('UUIDs retrieved successfully', uuids);
  }

  @ApiCustomResponses({ summary: 'Get all records for a CRUD', successExample: { records: [{ id: 'string', data: {} }] } })
  @Get(':crud_uuid/records')
  async getAllCrudRecords(@Param('crud_uuid') crudUuid: string) {
    const records = await this.crudsService.getAllCrudRecords(crudUuid);
    return ResponseUtil.success('Records retrieved successfully', records);
  }

  @ApiCustomResponses({ summary: 'Create a new record', successExample: { record: { id: 'string', data: {} } } })
  @Post(':crud_uuid/records')
  async createRecord(
    @Param('crud_uuid') crudUuid: string,
    @Body() createCrudDto: CreateCrudDto
  ) {
    const created = await this.crudsService.createRecord(crudUuid, createCrudDto);
    return ResponseUtil.success('Record created successfully', created);
  }

  @ApiCustomResponses({ summary: 'Get one record by UUID', successExample: { record: { id: 'string', data: {} } } })
  @Get(':crud_uuid/records/:record_uuid')
  async getOneRecord(
    @Param('crud_uuid') crudUuid: string,
    @Param('record_uuid') recordUuid: string,
  ) {
    const record = await this.crudsService.getOneRecord(crudUuid, recordUuid);
    return ResponseUtil.success('Record retrieved successfully', record);
  }

  @ApiCustomResponses({ summary: 'Get schema by UUID', successExample: { schema: { fields: [], relations: [] } } })
  @Get(':crud_uuid/schema')
  async getSchema(@Param('crud_uuid') crudUuid: string) {
    const schema = await this.crudsService.getSchema(crudUuid);
    return ResponseUtil.success('Schema retrieved successfully', schema);
  }

  @ApiCustomResponses({ summary: 'Update a record', successExample: { record: { id: 'string', data: {} } } })
  @Patch(':crud_uuid/records/:record_uuid')
  async updateRecord(
    @Param('crud_uuid') crudUuid: string,
    @Param('record_uuid') recordUuid: string,
    @Body() updateCrudDto: CreateCrudDto
  ) {
    const updated = await this.crudsService.updateRecord(crudUuid, recordUuid, updateCrudDto);
    return ResponseUtil.success('Record updated successfully', updated);
  }

  @ApiCustomResponses({ summary: 'Delete a record', successExample: { success: true } })
  @Delete(':crud_uuid/records/:record_uuid')
  async deleteRecord(
    @Param('crud_uuid') crudUuid: string,
    @Param('record_uuid') recordUuid: string,
  ) {
    await this.crudsService.deleteRecord(crudUuid, recordUuid);
    return ResponseUtil.success('Record deleted successfully', null);
  }
}