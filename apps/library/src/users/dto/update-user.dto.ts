import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { UserStatus } from '../user-status';

export class UpdateUserDto {
  @IsInt()
  @IsPositive()
  id: number;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;
}
