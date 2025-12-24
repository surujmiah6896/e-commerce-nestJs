import { Product } from 'src/modules/product/entities/product.entity';
import { Attribute } from '../../attribute/entities/attribute.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';


@Entity('variants')
export class Variant {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Attribute, (attribute) => attribute.variants, {
    onDelete: 'CASCADE', // Delete variant if attribute is deleted
  })
  @JoinColumn({ name: 'attribute_id' })
  attribute: Attribute;

  @Column({ unique: true })
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  sku: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  icon: string;

  @Column()
  position: number;

  @Column({ nullable: true })
  image: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Product, (product) => product.variants)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}

