import { Body, Controller, Post } from '@nestjs/common';
import { Admin } from '../auth/admin.decorator';
import { ReqUser } from '../auth/user.decorator';
import { User } from '../users/user.model';
import { BorrowingService } from './borrowing.service';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { ReturnBookDto } from './dto/return-book.dto';

@Controller('borrow')
export class BorrowingController {
  constructor(private readonly borrowingService: BorrowingService) {}

  @Post()
  borrowBook(@Body() { bookId }: BorrowBookDto, @ReqUser() user: User) {
    return this.borrowingService.borrowBook(user.id, bookId);
  }

  @Post('return')
  returnBook(@Body() { bookId }: ReturnBookDto, @ReqUser() user: User) {
    return this.borrowingService.returnBook(user.id, bookId);
  }

  @Post('scan')
  @Admin()
  scanOutstandingBooks() {
    return this.borrowingService.scanOutstandingBooks();
  }
}
