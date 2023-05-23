import { Module } from '@nestjs/common';
import { ScopedTypeOrmModule } from '../scoped-typeorm/scoped-typeorm.module';
import { Book } from './book.model';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

@Module({
  imports: [ScopedTypeOrmModule.forFeature([Book])],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}
