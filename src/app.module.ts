import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { BorrowingModule } from './borrowing/borrowing.module';
import { DevModule } from './dev/dev.module';
import { UsersModule } from './users/users.module';
import { ScopedTypeOrmModule } from './scoped-typeorm/scoped-typeorm.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      autoLoadEntities: true,
      // Automatically create tables, great for development but very dangerous for production
      synchronize: true,
    }),
    ScopedTypeOrmModule.forRoot(),
    AuthModule,
    BooksModule,
    BorrowingModule,
    UsersModule,
    DevModule,
  ],
})
export class AppModule {}
