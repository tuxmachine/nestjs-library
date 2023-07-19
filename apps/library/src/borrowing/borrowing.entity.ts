import { Book } from '../books/book.entity';
import { User } from '../users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
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

  @Column({ type: 'varchar', default: BorrowingStatus.active })
  status: BorrowingStatus;

  @ManyToOne(() => Book, (book) => book.borrowings)
  book?: Relation<Book>;

  @ManyToOne(() => User, (user) => user.borrowings)
  user?: Relation<User>;

  @UpdateDateColumn()
  updatedAt: Date;
}
