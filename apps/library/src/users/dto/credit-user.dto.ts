import { IsInt, IsPositive } from 'class-validator';

export class CreditUserDto {
  @IsInt()
  @IsPositive()
  id: number;

  @IsPositive()
  @IsInt()
  amount: number;
}
