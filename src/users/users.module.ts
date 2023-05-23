import { Module } from '@nestjs/common';
import { Book } from '../books/book.model';
import { Borrowing } from '../borrowing/borrowing.model';
import { Transaction } from '../transactions/transaction.model';
import { ScopedTypeOrmModule } from '../scoped-typeorm/scoped-typeorm.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { User } from './user.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    ScopedTypeOrmModule.forFeature([User, Transaction, Borrowing, Book]),
    TransactionsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
