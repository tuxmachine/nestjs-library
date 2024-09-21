import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { transactionStorage } from './transaction-store';
import { firstValueFrom, of } from 'rxjs';

export class ScopedInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();

    // Cache the request in the AsyncStorage, so we can make it available
    // to our DI subtree later
    return transactionStorage.run({ request }, async () => {
      const result = await firstValueFrom(next.handle());
      return of(result);
    });
  }
}
