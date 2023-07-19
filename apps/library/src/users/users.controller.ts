import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { Admin } from '../auth/admin.decorator';
import { ReqUser } from '../auth/user.decorator';
import { CreditUserDto } from './dto/credit-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('self')
  getSelf(@ReqUser() user: User) {
    return user;
  }

  @Admin()
  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Admin()
  @Put()
  updateUser(@Body() update: UpdateUserDto) {
    return this.usersService.updateUser(update);
  }

  @Admin()
  @Post()
  creditUser(@Body() { id, amount }: CreditUserDto) {
    return this.usersService.addCredit(id, amount);
  }
}
