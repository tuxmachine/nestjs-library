import { Book } from '../books/book.model';
import { User } from '../users/user.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BorrowingStatus } from './borrowing-status';

@Entity()
export class Borrowing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bookId: number;

  @Column()
  userId: number;

  @CreateDateColumn()
  borrowingDate: Date;

  @Column({ type: 'datetime' })
  dueDate: Date;

  @Column({ type: 'datetime', nullable: true })
  returnDate?: Date;

  @Column({ enum: BorrowingStatus, default: BorrowingStatus.active })
  status: BorrowingStatus;

  @ManyToOne(() => Book, (book) => book.borrowings)
  book?: Book;

  @ManyToOne(() => User, (user) => user.borrowings)
  user?: User;

  @UpdateDateColumn()
  updatedAt: Date;
}
