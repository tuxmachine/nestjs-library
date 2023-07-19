import { PickType } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';
import { BaseUser } from './base-user.dto';

export class CreditUserDto extends PickType(BaseUser, ['id']) {
  @IsPositive()
  @IsInt()
  amount: number;
}
