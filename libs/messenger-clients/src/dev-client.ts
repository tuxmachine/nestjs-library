import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

export enum DevEvents {
  truncate = 'truncate',
  seed = 'seed',
}

@Injectable()
export class DevClient {
  constructor(
    @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
  ) {}

  async truncate() {
    return this.natsClient.emit(DevEvents.truncate, {});
  }

  async seed() {
    return this.natsClient.emit(DevEvents.seed, {});
  }
}
