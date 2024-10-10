import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@lib/auth';
import { BooksModule } from './books/books.module';
import { BorrowingModule } from './borrowing/borrowing.module';
import { DevModule } from './dev/dev.module';
import { BorrowersModule } from './borrower/borrowers.module';
import { MessengerClientsModule } from '@lib/messenger-clients';
import { BorrowersService } from './borrower/borrowers.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'books-db.sqlite',
      autoLoadEntities: true,
      // Automatically create tables, great for development but very dangerous for production
      synchronize: true,
    }),
    AuthModule.registerAsync({
      imports: [BorrowersModule],
      useFactory: (svc: BorrowersService) => ({
        getUserBySub: (id) => svc.getBorrowerBy({ id }),
      }),
      inject: [BorrowersService],
    }),
    BooksModule,
    BorrowingModule,
    BorrowersModule,
    DevModule,
    MessengerClientsModule,
  ],
})
export class BooksAppModule {}
