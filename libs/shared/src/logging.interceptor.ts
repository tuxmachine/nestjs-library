import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const type = context.getType();
    const target = [context.getClass().name, context.getHandler().name].join(
      ':',
    );
    this.logger.log(`[${type.toUpperCase()}][${target}]`);
    return next.handle();
  }
}
