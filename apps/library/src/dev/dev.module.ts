import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Book } from '../books/book.entity';
import { Borrowing } from '../borrowing/borrowing.entity';
import { User } from '../users/user.entity';
import { DevController } from './dev.controller';
import { DevService } from './dev.service';

@Module({
  imports: [TypeOrmModule.forFeature([Book, User, Borrowing]), AuthModule],
  controllers: [DevController],
  providers: [DevService],
})
export class DevModule {}
