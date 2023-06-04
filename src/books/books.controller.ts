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
import { ReqUser } from '../auth/user.decorator';
import { UserRole } from '../users/user-role';
import { User } from '../users/user.model';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  getBooks(@ReqUser() user: User) {
    return this.booksService.getBooks(user.role === UserRole.admin);
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
