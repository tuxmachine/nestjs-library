import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserStatus } from './user-status';
import { UserRole } from './user-role';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', default: UserRole.user })
  role: UserRole;

  @Column({ unique: true })
  // Authentication provided by 3rd party, only store their reference
  externalId: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'int', nullable: false, default: 0 })
  // Store financials in smallest denominator (cents)
  credit: number;

  @Column({ type: 'varchar', default: UserStatus.active })
  status: UserStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
