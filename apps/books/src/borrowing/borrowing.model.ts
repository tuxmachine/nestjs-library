import { Book } from '../books/book.model';
import { Borrower } from '../borrower/borrower.model';
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
  userId: string;

  @CreateDateColumn()
  borrowingDate: Date;

  @Column({ type: 'datetime' })
  dueDate: Date;

  @Column({ type: 'datetime', nullable: true })
  returnDate?: Date;

  @Column({
    enum: BorrowingStatus,
    default: BorrowingStatus.active,
    type: 'varchar',
  })
  status: BorrowingStatus;

  @ManyToOne(() => Book, (book) => book.borrowings)
  book?: Book;

  @ManyToOne(() => Borrower, (user) => user.borrowings)
  user?: Borrower;

  @UpdateDateColumn()
  updatedAt: Date;
}
