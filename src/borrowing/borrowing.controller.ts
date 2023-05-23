import { Body, Controller, Post, Type } from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Admin } from '../auth/admin.decorator';
import { ReqUser } from '../auth/user.decorator';
import { User } from '../users/user.model';
import { BorrowingService } from './borrowing.service';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { ReturnBookDto } from './dto/return-book.dto';

@Controller('borrow')
export class BorrowingController {
  constructor(
    private readonly moduleRef: ModuleRef,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  @Post()
  async borrowBook(@Body() { bookId }: BorrowBookDto, @ReqUser() user: User) {
    const borrowingService = await this.getDurableTree(BorrowingService);
    return borrowingService.borrowBook(user.id, bookId);
  }

  @Post('return')
  async returnBook(@Body() { bookId }: ReturnBookDto, @ReqUser() user: User) {
    const borrowingService = await this.getDurableTree(BorrowingService);
    return borrowingService.returnBook(user.id, bookId);
  }

  @Post('scan')
  @Admin()
  async scanOutstandingBooks() {
    const borrowingService = await this.getDurableTree(BorrowingService);
    return borrowingService.scanOutstandingBooks();
  }

  private async getDurableTree<T>(provider: Type<T>): Promise<T> {
    const contextId = ContextIdFactory.create();
    const queryRunner = this.dataSource.createQueryRunner();
    this.moduleRef.registerRequestByContextId({ queryRunner }, contextId);
    return this.moduleRef.resolve(provider, contextId);
  }
}
