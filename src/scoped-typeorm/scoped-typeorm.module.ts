import { DynamicModule, Module, Provider, Scope } from '@nestjs/common';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import { transactionStorage } from './transaction-store';
import { ScopedInterceptor } from './scoped.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({})
export class ScopedTypeOrmModule {
  static forFeature(entities: any[]): DynamicModule {
    const providers = entities.map(
      (entity): Provider => ({
        // We override the TypeORM repository for backward compatibility with the Nest TypeOrmModule
        provide: getRepositoryToken(entity),
        // This effectively makes the entire app request-scoped,
        // it's required to dynamically resolve the repositories
        scope: Scope.REQUEST,
        // But the durable flag allows us to re-use repositories outside of transactions
        // using the ScopedContextIdStrategy to cache them
        durable: true,
        inject: [getDataSourceToken()],
        useFactory: (dataSource: DataSource) => {
          const queryRunner: QueryRunner | undefined =
            transactionStorage.getStore()?.queryRunner;
          if (queryRunner) {
            return queryRunner.manager.getRepository(entity);
          }
          return dataSource.getRepository(entity);
        },
      }),
    );
    return {
      module: ScopedTypeOrmModule,
      providers: providers,
      exports: providers,
    };
  }

  static forRoot(): DynamicModule {
    return {
      module: ScopedTypeOrmModule,
      providers: [
        ScopedInterceptor,
        {
          provide: APP_INTERCEPTOR,
          useClass: ScopedInterceptor,
        },
      ],
    };
  }
}
