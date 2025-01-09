// src/entities/base.entity.ts
import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @Column({ primary: true, length: 50 })
  uuid: string;

  @Column({ default: 1 })
  status: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}