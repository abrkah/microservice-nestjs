import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { IsEmail } from 'class-validator';


@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  @IsEmail()
  email: string;

  @Column({ type: 'varchar', nullable: true })
  password: string;
  @Column({ type: 'varchar', nullable: true })
  phone: string;

  @Column({ type: 'varchar', nullable: true })
  address: string;

  @Column({ type: 'enum', enum: ['male', 'female', 'other'], nullable: true })
  sex: 'male' | 'female' | 'other';

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ nullable: false })
  roleId: string;
}
