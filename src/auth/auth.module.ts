import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../transactions/transaction.model';
import { Book } from '../books/book.model';
import { Borrowing } from '../borrowing/borrowing.model';
import { JWT_SECRET } from '../constants';
import { User } from '../users/user.model';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Book, Borrowing, Transaction]),
    JwtModule.register({
      secret: JWT_SECRET,
    }),
  ],
  providers: [AuthGuard, { provide: APP_GUARD, useClass: AuthGuard }],
  exports: [JwtModule],
})
export class AuthModule {}
