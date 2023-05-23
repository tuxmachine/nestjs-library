import { Module } from '@nestjs/common';
import { ScopedTypeOrmModule } from '../scoped-typeorm/scoped-typeorm.module';
import { Book } from '../books/book.model';
import { BooksModule } from '../books/books.module';
import { User } from '../users/user.model';
import { UsersModule } from '../users/users.module';
import { BorrowingController } from './borrowing.controller';
import { Borrowing } from './borrowing.model';
import { BorrowingService } from './borrowing.service';
import { Transaction } from '../transactions/transaction.model';

@Module({
  imports: [
    ScopedTypeOrmModule.forFeature([Borrowing, User, Book, Transaction]),
    UsersModule,
    BooksModule,
  ],
  controllers: [BorrowingController],
  providers: [BorrowingService],
})
export class BorrowingModule {}
