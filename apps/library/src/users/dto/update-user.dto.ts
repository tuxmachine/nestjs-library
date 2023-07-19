import { IsInt, IsPositive } from 'class-validator';
import { BaseUser } from './base-user.dto';
import { OmitType, PartialType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(OmitType(BaseUser, ['id'])) {
  @IsInt()
  @IsPositive()
  id: number;
}
