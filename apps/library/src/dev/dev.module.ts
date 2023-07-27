import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { DevController } from './dev.controller';
import { DevService } from './dev.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [DevController],
  providers: [DevService],
})
export class DevModule {}
