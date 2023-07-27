import { Controller, Post } from '@nestjs/common';
import { DevService } from './dev.service';

@Controller('dev')
export class DevController {
  constructor(private readonly devService: DevService) {}

  @Post('seed')
  async seed() {
    await this.devService.truncate();
    return this.devService.seed();
  }
}
