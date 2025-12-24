// src/modules/product/entities/product-image.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string; // Image URL

  @Column({ nullable: true })
  altText: string; // Alt text for SEO

  @Column({ nullable: true })
  caption: string; // Image caption

  @Column({ default: 0 })
  position: number; // Display order

  @Column({ default: true })
  isActive: boolean; // Show/hide image

  @Column({ default: false })
  isMain: boolean; // Is this the main image?

  // Product relation
  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE', // Delete images when product deleted
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @CreateDateColumn()
  createdAt: Date;
}
