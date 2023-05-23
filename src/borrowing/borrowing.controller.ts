import { Body, Controller, Post } from '@nestjs/common';
import { Admin } from '../auth/admin.decorator';
import { ReqUser } from '../auth/user.decorator';
import { User } from '../users/user.model';
import { BorrowingService } from './borrowing.service';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { ReturnBookDto } from './dto/return-book.dto';
import { ScopedController } from '../scoped-typeorm/scoped-controller';

@Controller('borrow')
export class BorrowingController extends ScopedController {
  @Post()
  async borrowBook(@Body() { bookId }: BorrowBookDto, @ReqUser() user: User) {
    return this.runInTransaction(async (resolver) =>
      (await resolver(BorrowingService)).borrowBook(user.id, bookId),
    );
  }

  @Post('return')
  async returnBook(@Body() { bookId }: ReturnBookDto, @ReqUser() user: User) {
    return this.runInTransaction(async (resolver) =>
      (await resolver(BorrowingService)).returnBook(user.id, bookId),
    );
  }

  @Post('scan')
  @Admin()
  async scanOutstandingBooks() {
    return this.runInTransaction(async (resolver) =>
      (await resolver(BorrowingService)).scanOutstandingBooks(),
    );
  }
}
