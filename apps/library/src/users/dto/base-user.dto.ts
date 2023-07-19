import { IsInt, IsPositive } from 'class-validator';

export class BaseUser {
  @IsInt()
  @IsPositive()
  id: number;
}
