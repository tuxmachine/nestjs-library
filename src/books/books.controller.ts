import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { Admin } from '../auth/admin.decorator';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BooksController {
  private count: number = 0;

  constructor(private readonly booksService: BooksService) {}

  @Get()
  getBooks() {
    // You can check that this controller acts as a static provider
    // even though it's dependent upon a request-scoped, durable service
    //
    // If this controller were executed from within a transaction, it would _not_ be static
    console.log(this.count++);
    return this.booksService.getBooks();
  }

  @Admin()
  @Post()
  createBook(@Body() book: CreateBookDto) {
    return this.booksService.createBook(book);
  }

  @Admin()
  @Put()
  updateBook(@Body() update: UpdateBookDto) {
    return this.booksService.updateBook(update);
  }

  @Admin()
  @Delete(':id')
  deleteBook(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.deleteBook(id);
  }
}
