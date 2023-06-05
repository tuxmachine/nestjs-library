import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { OpenTelemetryInterceptor } from './opentelemetry.interceptor';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: OpenTelemetryInterceptor,
    },
  ],
})
export class OpenTelemetryModule {}
