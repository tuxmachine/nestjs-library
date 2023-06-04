import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { BorrowingModule } from './borrowing/borrowing.module';
import { DevModule } from './dev/dev.module';
import { OpenTelemetryModule } from './opentelemetry/opentelemetry.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      autoLoadEntities: true,
      // Automatically create tables, great for development but very dangerous for production
      synchronize: true,
    }),
    OpenTelemetryModule,
    AuthModule,
    BooksModule,
    BorrowingModule,
    UsersModule,
    DevModule,
  ],
})
export class AppModule {}
