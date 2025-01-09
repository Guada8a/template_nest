// src/utils/entity-generator.util.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

interface SchemaField {
  campo: string;
  tipo: string;
  longitud?: number;
  requerido?: boolean;
}

export function generateEntityFromSchema(schemaContent: any) {
  const tableName = schemaContent.tabla;
  const campos = schemaContent.campos;

  @Entity({ name: tableName })
  class GeneratedEntity {
    @Column({ primary: true, length: 50 })
    uuid: string;

    @Column({ default: 1 })
    status: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    constructor(partial: Partial<GeneratedEntity>) {
      Object.assign(this, partial);
    }
  }

  // Añadir columnas dinámicamente basadas en el schema
  for (const [fieldName, fieldConfig] of Object.entries(campos)) {
    if (fieldName === 'uuid') continue; // Skip uuid as it's already defined

    const columnConfig: any = {
      name: (fieldConfig as SchemaField).campo,
      length: (fieldConfig as SchemaField).longitud || undefined,
      nullable: !(fieldConfig as SchemaField).requerido
    };

    switch ((fieldConfig as SchemaField).tipo) {
      case 'string':
        columnConfig.type = 'varchar';
        break;
      case 'number':
        columnConfig.type = 'numeric';
        break;
      case 'date':
        columnConfig.type = 'date';
        break;
      default:
        columnConfig.type = 'varchar';
    }

    Column(columnConfig)(GeneratedEntity.prototype, fieldName);
  }

  return GeneratedEntity;
}