import { Exclude } from 'class-transformer';
import { hashPassword } from 'src/utils/hash';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  hashPasswordInsert() {
    this.password = hashPassword(this.password);
  }

  @BeforeInsert()
  lowercaseEmail() {
    this.email = this.email.toLowerCase();
  }
}
