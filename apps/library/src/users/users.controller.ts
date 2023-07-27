import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { CreditUserDto } from './dto/credit-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Put()
  updateUser(@Body() update: UpdateUserDto) {
    return this.usersService.updateUser(update);
  }

  @Post()
  creditUser(@Body() { id, amount }: CreditUserDto) {
    return this.usersService.addCredit(id, amount);
  }
}
