import { IsInt, IsPositive, IsEnum, IsEmail } from 'class-validator';
import { UserRole } from '../user-role';
import { UserStatus } from '../user-status';

export class BaseUser {
  @IsInt()
  @IsPositive()
  id: number;

  @IsEnum(UserRole)
  role: UserRole;

  externalId: string;

  @IsEmail()
  email: string;

  @IsInt()
  credit: number;

  @IsEnum(UserStatus)
  status: UserStatus;
}
