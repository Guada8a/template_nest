// src/entities/patio-importers.entity.ts
import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base_entity';

@Entity('patio_importers')
export class PatioImporters extends BaseEntity {
  @Column({ length: 50 })
  name: string;

  @Column({ length: 50, nullable: true })
  rfc: string;

  @Column({ length: 50, nullable: true })
  email: string;
}