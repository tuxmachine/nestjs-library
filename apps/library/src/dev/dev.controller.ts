import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../auth/public.decorator';
import { DevService } from './dev.service';

@Public()
@Controller('dev')
export class DevController {
  constructor(private readonly devService: DevService) {}

  @Post('reset')
  reset() {
    return this.devService.truncate();
  }

  @Post('seed')
  seed() {
    return this.devService.seed();
  }

  @Post('token')
  async login(@Body() where: { id?: number; externalId?: string }) {
    return this.devService.login(where);
  }
}
