import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Parent product
  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE', // Delete variants when product deleted
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  // Variant identification
  @Column()
  sku: string; // Unique SKU for this variant

  @Column({ nullable: true })
  barcode: string;

  // Variant attributes (size, color, etc.)
  @Column('jsonb', { nullable: true })
  attributes: Record<string, any>; // e.g., { color: 'Red', size: 'XL' }

  @Column({ nullable: true })
  name: string; // e.g., "iPhone 14 Pro 128GB Silver"

  // Pricing
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  compareAtPrice: number; // Original price

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  costPrice: number; // Cost price

  // Inventory
  @Column({ default: 0 })
  stockQuantity: number;

  @Column({ default: false })
  trackInventory: boolean;

  @Column({ default: false })
  allowBackorders: boolean;

  // Weight & Dimensions (for shipping)
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  weight: number; // kg

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  length: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  width: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  height: number;

  // Images specific to this variant
  @Column({ nullable: true })
  image: string;

  @Column('jsonb', { default: [] })
  gallery: string[];

  // Status
  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  position: number;

  // Timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
