import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { UserStatus } from '../user-status';
import { BaseUser } from './base-user.dto';
import { PickType } from '@nestjs/swagger';

export class UpdateUserDto extends PickType(BaseUser, ['id']) {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;
}
