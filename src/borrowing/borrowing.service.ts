import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  addMonths,
  differenceInDays,
  differenceInYears,
  subYears,
} from 'date-fns';
import { In, LessThan, Not, Repository } from 'typeorm';
import { BooksService } from '../books/books.service';
import { UserStatus } from '../users/user-status';
import { User } from '../users/user.model';
import { UsersService } from '../users/users.service';
import { BorrowingStatus } from './borrowing-status';
import { Borrowing } from './borrowing.model';

@Injectable()
export class BorrowingService {
  constructor(
    private readonly booksService: BooksService,
    private readonly usersService: UsersService,
    @InjectRepository(Borrowing)
    private readonly borrowingRepo: Repository<Borrowing>,
  ) {}

  async borrowBook(userId: number, bookId: number) {
    if (!(await this.booksService.isBookAvailable(bookId))) {
      throw new BadRequestException('Book is not available');
    }
    if (!(await this.usersService.hasUserCredit(userId))) {
      throw new ForbiddenException('User is not eligible to borrow');
    }
    if (await this.hasOverdueBooks(userId)) {
      throw new ForbiddenException('User has overdue books');
    }
    const today = new Date();
    const dueDate = addMonths(today, 1);
    const days = differenceInDays(dueDate, today);
    const fees = days * 5;
    const user = await this.usersService.getUser(userId);
    if (user.credit < fees) {
      throw new BadRequestException('User has insufficient credit');
    }
    await this.usersService.chargeFees(userId, fees, `borrow book ${bookId}`);
    const borrowing = this.borrowingRepo.create({
      userId,
      bookId,
      borrowingDate: today,
      dueDate,
      status: BorrowingStatus.active,
    });
    return this.borrowingRepo.save(borrowing);
  }

  async returnBook(userId: number, bookId: number) {
    const borrowing = await this.borrowingRepo.findOneOrFail({
      where: { userId, bookId },
    });
    if (borrowing.status === BorrowingStatus.lost) {
      throw new BadRequestException('Book is already written off');
    }
    if (borrowing.status === BorrowingStatus.returned) {
      throw new BadRequestException('Book is already returned');
    }
    const today = new Date();
    const returnDateDiff = differenceInDays(today, borrowing.dueDate);
    if (returnDateDiff < 0) {
      const refund = returnDateDiff * -5;
      await this.usersService.addCredit(
        userId,
        refund,
        `refund for book ${borrowing.id}`,
      );
    }
    if (returnDateDiff > 0) {
      const lateFee = returnDateDiff * 10;
      await this.usersService.chargeFees(
        userId,
        lateFee,
        `late fee for book ${borrowing.id}`,
      );
    }
    borrowing.status = BorrowingStatus.returned;
    borrowing.returnDate = today;
    await this.borrowingRepo.save(borrowing);
    return borrowing;
  }

  async scanOutstandingBooks() {
    const borrowings = await this.borrowingRepo.find({
      where: {
        status: Not(In([BorrowingStatus.returned, BorrowingStatus.lost])),
      },
    });
    const today = new Date();
    const updatedBorrowings: Borrowing[] = [];
    const updatedUsers: User[] = [];
    for (const borrowing of borrowings) {
      if (differenceInYears(today, borrowing.borrowingDate) >= 1) {
        borrowing.status = BorrowingStatus.lost;
        updatedBorrowings.push(borrowing);
        updatedUsers.push(
          await this.usersService.suspendUser(borrowing.userId),
        );
        await this.booksService.writeOffBook(borrowing.bookId);
      } else if (today > borrowing.dueDate) {
        borrowing.status = BorrowingStatus.overdue;
        updatedBorrowings.push(borrowing);
      }
    }
    await this.borrowingRepo.save(updatedBorrowings);
    const users = await this.usersService.getUsers({
      status: UserStatus.active,
      updatedAt: LessThan(subYears(today, 1)),
    });
    for (const user of users) {
      if (user.credit < 0) {
        await this.usersService.suspendUser(user.id);
        updatedUsers.push(user);
      }
    }

    return {
      borrowings: updatedBorrowings,
      users: updatedUsers,
    };
  }

  async hasOverdueBooks(userId: number) {
    const overdue = await this.borrowingRepo.count({
      where: { status: BorrowingStatus.overdue, userId },
    });
    return overdue > 0;
  }
}
