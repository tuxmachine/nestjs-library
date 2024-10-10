import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../books/book.model';
import { BooksModule } from '../books/books.module';
import { Borrower } from '../borrower/borrower.model';
import { BorrowersModule } from '../borrower/borrowers.module';
import { BorrowingController } from './borrowing.controller';
import { Borrowing } from './borrowing.model';
import { BorrowingService } from './borrowing.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Borrowing, Borrower, Book]),
    BorrowersModule,
    BooksModule,
  ],
  controllers: [BorrowingController],
  providers: [BorrowingService],
})
export class BorrowingModule {}
