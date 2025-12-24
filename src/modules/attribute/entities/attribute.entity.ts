import { Product } from '../../product/entities/product.entity';
import { Variant } from '../../variant/entities/variant.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToMany
} from 'typeorm';


@Entity('attributes')
export class Attribute {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  name: string;

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

  // Relation to subcategories (if using separate table)
  @OneToMany(() => Variant, (variant) => variant.attribute, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  variants: Variant[];

  @ManyToMany(() => Product, (product) => product.attributes)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}

