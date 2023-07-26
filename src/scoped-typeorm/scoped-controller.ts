import { Inject, Type } from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { transactionStorage } from './transaction-store';

export type Resolver = <T>(token: Type<T> | string | symbol) => Promise<T>;

export abstract class ScopedController {
  @Inject(ModuleRef)
  protected readonly moduleRef: ModuleRef;

  @InjectDataSource()
  protected readonly dataSource: DataSource;

  /**
   * Construct a DI subtree with transaction scoped TypeORM repositories
   */
  protected async runInTransaction<R>(
    fn: (resolve: Resolver) => Promise<R>,
  ): Promise<R> {
    const store = transactionStorage.getStore();
    const contextId = ContextIdFactory.create();
    const queryRunner = this.dataSource.createQueryRunner();

    const resolver: Resolver = (token) =>
      this.moduleRef.resolve(token, contextId);

    // Make queryRunner available to our ScopedTypeOrmModule
    // to construct the transaction-scoped repositories
    store.queryRunner = queryRunner;

    // Make the REQUEST available to our DI subtree
    this.moduleRef.registerRequestByContextId(store.request, contextId);

    await queryRunner.startTransaction();
    let result: R;
    try {
      result = await fn(resolver);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
    return result;
  }
}
