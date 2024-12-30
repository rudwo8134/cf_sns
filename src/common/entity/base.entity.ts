import { PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CreateDateColumn } from 'typeorm';

export abstract class BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
