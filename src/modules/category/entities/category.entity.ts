import { Product } from '../../product/entities/product.entity';
import { SubCategory } from '../../subCategory/entities/sub-category.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';


@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  color: string;

  @Column()
  position: number;

  @Column({ nullable: true })
  image: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  metaTitle: string;

  @Column({ nullable: true })
  metaDescription: string;

  @Column({ nullable: true })
  metaKey: string;

  @Column({ nullable: true })
  metaContent: string;

  // Relation to subcategories (if using separate table)
  @OneToMany(() => SubCategory, (subCategory) => subCategory.category, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  subCategories: SubCategory[];

  @OneToMany(() => Product, (product) => product.subCategory)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}

