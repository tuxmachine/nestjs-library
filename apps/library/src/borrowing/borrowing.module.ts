import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../books/book.entity';
import { BooksModule } from '../books/books.module';
import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { BorrowingController } from './borrowing.controller';
import { Borrowing } from './borrowing.entity';
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
