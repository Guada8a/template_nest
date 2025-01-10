import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { schemas_catalog } from '../data/schemas';
import { generateEntityFromSchema } from '../utils/entity_generator.util';
import { PatioImporters } from './entities/patio_importers.entity';

interface FrontSchemaField {
  title: string;
  dataIndex: string;
  type: string;
}

interface FrontSchema {
  schema: FrontSchemaField[];
}

interface SchemaField {
  campo: string;
  tipo: string;
  longitud?: number;
  requerido?: boolean;
}

interface BackSchema {
  tabla: string;
  campos: {
    [key: string]: SchemaField;
  };
}

function isBackSchema(schema: FrontSchema | BackSchema): schema is BackSchema {
  return 'campos' in schema;
}

@Injectable()
export class CrudsService {
  private entityCache: Map<string, any> = new Map();

  constructor(
    @InjectRepository(PatioImporters)
    private readonly repository: Repository<PatioImporters>,
  ) { }

  private async getEntity(schemaUuid: string): Promise<any> {
    if (this.entityCache.has(schemaUuid)) {
      return this.entityCache.get(schemaUuid);
    }

    const schema = await this.getSchemaByUuid(schemaUuid, 'back');
    if (!schema) throw new NotFoundException(`Schema not found: ${schemaUuid}`);

    const entity = generateEntityFromSchema(schema);
    this.entityCache.set(schemaUuid, entity);
    return entity;
  }

  private async getSchemaByUuid(uuid: string, type: 'front' | 'back'): Promise<FrontSchema | BackSchema | null> {
    try {
      const filePath = path.join(process.cwd(), 'src/data/schemas', `${type}-${uuid}.json`);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      console.error(`Error reading schema file: ${error.message}`);
      return null;
    }
  }

  private validateType(value: any, type: string, schema: SchemaField): boolean {
    switch (type) {
      case 'string':
      case 'select':
      case 'date':
        if (typeof value !== 'string') return false;
        if (schema.longitud && value.length > schema.longitud) return false;
        if (schema.requerido && !value) return false;
        return true;
      case 'number':
        return !isNaN(Number(value));
      default:
        return true; // Para tipos desconocidos, permitimos el valor
    }
  }

  async getSchema(crudUuid: string) {
    if (!schemas_catalog[crudUuid]) {
      throw new NotFoundException('Invalid schema UUID');
    }

    const schema = await this.getSchemaByUuid(crudUuid, 'front');
    if (!schema) {
      throw new NotFoundException('Schema file not found');
    }
    return schema;
  }

  async getOneRecord(crudUuid: string, recordUuid: string) {
    const schema = await this.getSchemaByUuid(crudUuid, 'back') as BackSchema;
    if (!schema) {
      throw new NotFoundException(`No schema found for UUID: ${crudUuid}`);
    }

    const record = await this.repository
      .createQueryBuilder(schema.tabla)
      .where('uuid = :uuid AND status = 1', { uuid: recordUuid })
      .getOne();

    if (!record) {
      throw new NotFoundException('Record not found');
    }

    return record;
  }

  async getAllCrudRecords(crudUuid: string) {
    const backSchema = await this.getSchemaByUuid(crudUuid, 'back') as BackSchema;
    if (!backSchema) {
      throw new NotFoundException(`No se encontró el esquema para el UUID: ${crudUuid}`);
    }

    const records = await this.repository
      .createQueryBuilder(backSchema.tabla)
      .where('status = 1')
      .getMany();

    if (!records || records.length === 0) {
      return [];
    }

    return records.map(record => {
      const formattedRecord = { ...record };
      // Formatear fechas si existen
      Object.entries(formattedRecord).forEach(([key, value]) => {
        if (value instanceof Date) {
          formattedRecord[key] = value.toISOString().split('T')[0];
        }
      });
      return formattedRecord;
    });
  }

  async createRecord(crudUuid: string, data: any) {
    const schema = await this.getSchemaByUuid(crudUuid, 'back');
    if (!schema || !isBackSchema(schema)) {
      throw new NotFoundException(`No schema found for UUID: ${crudUuid}`);
    }

    const Entity = await this.getEntity(crudUuid);
    const record = new Entity({
      uuid: uuidv4(),
      status: 1,
      ...data
    });

    // Validar campos según el schema
    for (const [field, config] of Object.entries(schema.campos)) {
      // Excluir la validación del uuid ya que se genera automáticamente
      if (field === 'uuid') continue;

      if (config.requerido && !data[field]) {
        throw new BadRequestException(`Required field missing: ${field}`);
      }

      if (data[field] && !this.validateType(data[field], config.tipo, config)) {
        throw new BadRequestException(`Invalid data type for field: ${field}`);
      }
    }

    return await this.repository.save(record);
  }

  async updateRecord(crudUuid: string, recordUuid: string, data: any) {
    const schema = await this.getSchemaByUuid(crudUuid, 'back') as BackSchema;
    if (!schema) {
      throw new NotFoundException(`No schema found for UUID: ${crudUuid}`);
    }

    const record = await this.repository.findOne({
      where: { uuid: recordUuid, status: 1 }
    });

    if (!record) {
      throw new NotFoundException('Record not found');
    }

    const updateData = { updated_at: new Date() };
    for (const [field, value] of Object.entries(data)) {
      const fieldSchema = schema.campos[field];
      if (fieldSchema &&
        field !== 'uuid' &&
        field !== 'status' &&
        field !== 'created_at' &&
        this.validateType(value, fieldSchema.tipo, fieldSchema)) {
        updateData[fieldSchema.campo] = value;
      }
    }

    await this.repository.update({ uuid: recordUuid }, updateData);
    return await this.getOneRecord(crudUuid, recordUuid);
  }

  async deleteRecord(crudUuid: string, recordUuid: string) {
    const schema = await this.getSchemaByUuid(crudUuid, 'back') as BackSchema;
    if (!schema) {
      throw new NotFoundException(`No schema found for UUID: ${crudUuid}`);
    }

    const record = await this.repository.findOne({
      where: { uuid: recordUuid, status: 1 }
    });

    if (!record) {
      throw new NotFoundException('Record not found');
    }

    return await this.repository.update(
      { uuid: recordUuid },
      {
        status: 0,
        updated_at: new Date()
      }
    );
  }

  async getUuidList() {
    return schemas_catalog;
  }
}