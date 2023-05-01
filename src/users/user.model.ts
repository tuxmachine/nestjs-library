import { Borrowing } from '../borrowing/borrowing.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserStatus } from './user-status';
import { UserRole } from './user-role';
import { Transaction } from '../transactions/transaction.model';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: UserRole, default: UserRole.user })
  role: UserRole;

  @Column({ unique: true })
  // Authentication provided by 3rd party, only store their reference
  externalId: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'int', nullable: false, default: 0 })
  // Store financials in smallest denominator (cents)
  credit: number;

  @Column({ enum: UserStatus, default: UserStatus.active })
  status: UserStatus;

  @OneToMany(() => Borrowing, (borrowing) => borrowing.user)
  borrowings?: Borrowing[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions?: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
