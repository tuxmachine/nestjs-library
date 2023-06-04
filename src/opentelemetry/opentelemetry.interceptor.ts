import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import opentelemetry, { Span, SpanStatusCode } from '@opentelemetry/api';
import { finalize, Observable, tap } from 'rxjs';

@Injectable()
export class OpenTelemetryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const routeName = `${context.getClass().name}.${context.getHandler().name}`;
    const tracer = opentelemetry.trace.getTracer('nest-app');
    return tracer.startActiveSpan(
      routeName,
      { attributes: { 'nest.controller_method': routeName } },
      (span) => {
        return next.handle().pipe(
          tap({
            next: () => {
              span.setStatus({ code: SpanStatusCode.OK });
            },
            error: (error: unknown) => {
              span.setStatus({ code: SpanStatusCode.ERROR });
              this.reportError(span, error);
            },
          }),
          finalize(() => {
            span.end();
          }),
        );
      },
    );
  }

  private reportError(span: Span, exception: any) {
    if (exception instanceof Error) {
      span.recordException(exception);
    } else {
      span.recordException(new InternalServerErrorException(exception));
    }
  }
}
