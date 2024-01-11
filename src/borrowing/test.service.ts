import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

/**
 * This service is just to demonstrate that we can still use the REQUEST token
 * in our use-cases.
 */
@Injectable()
export class TestService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  getIp() {
    return this.request.ip;
  }
}
