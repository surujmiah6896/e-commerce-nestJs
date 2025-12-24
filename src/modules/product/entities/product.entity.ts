import { SubCategory } from '../../subCategory/entities/sub-category.entity';
import { Category } from '../../category/entities/category.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { Attribute } from '../../attribute/entities/attribute.entity';
import { Variant } from '../../variant/entities/variant.entity';
import { ProductImage } from './product-image.entity';
import { ProductVariant } from './product-variant.entity';


@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.products, {
    onDelete: 'SET NULL', // Don't delete product if subcategory deleted
  })
  @JoinColumn({ name: 'sub_category_id' })
  subCategory: SubCategory;

  @ManyToMany(() => Attribute, { cascade: true })
  @JoinTable({
    name: 'product_attributes',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'attribute_id', referencedColumnName: 'id' },
  })
  attributes: Attribute[];

  // @OneToMany(() => Variant, (variant) => variant.product, { cascade: true })
  // variants: Variant[];

  // Variants (if you have product variations)
  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: true,
  })
  variants: ProductVariant[];

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column('text', { nullable: true })
  shortDescription: string;

  @Column({ nullable: true })
  description: string;

  @Column('text', { nullable: true })
  specifications: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  salePrice: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  discountPrice: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  resellerPrice: number;

  @Column({ default: 0 })
  stockQuantity: number;

  @Column({ default: false })
  allowBackorders: boolean;

  @Column({ nullable: true })
  sku: string; // Stock Keeping Unit

  @Column({ nullable: true })
  icon: string;

  @Column()
  position: number;

  // Shipping
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  weight: number; // in kg

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  length: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  width: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  height: number;

  @OneToMany(() => ProductImage, (image) => image.product, {
    cascade: true, // Auto save/delete images with product
    eager: true, // Auto load images with product (optional)
  })
  images: ProductImage[];

  // Single main image (thumbnail)
  @Column({ nullable: true })
  thumbnail: string;

  @Column({ name: 'size_chart_image', nullable: true })
  sizeChartImage: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: false })
  isNew: boolean;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  soldCount: number;

  @Column({ name: 'meta_title', nullable: true })
  metaTitle: string;

  @Column({ name: 'meta_description', nullable: true, type: 'text' })
  metaDescription: string;

  @Column({ name: 'meta_key_words', nullable: true })
  metaKeywords: string;

  @Column({ name: 'meta_content', nullable: true, type: 'text' })
  metaContent: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}

