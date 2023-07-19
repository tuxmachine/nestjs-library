import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class BaseUser {
  @IsInt()
  @IsPositive()
  @ApiProperty({ type: 'number' })
  id: number;
}
