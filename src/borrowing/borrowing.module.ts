import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../books/book.model';
import { BooksModule } from '../books/books.module';
import { User } from '../users/user.model';
import { UsersModule } from '../users/users.module';
import { BorrowingController } from './borrowing.controller';
import { Borrowing } from './borrowing.model';
import { BorrowingService } from './borrowing.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Borrowing, User, Book]),
    UsersModule,
    BooksModule,
  ],
  controllers: [BorrowingController],
  providers: [BorrowingService],
})
export class BorrowingModule {}
