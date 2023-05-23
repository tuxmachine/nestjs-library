import { Inject, Type } from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export type Resolver = <T>(token: Type<T> | string | symbol) => Promise<T>;

export abstract class ScopedController {
  @Inject(ModuleRef)
  protected readonly moduleRef: ModuleRef;

  @InjectDataSource()
  protected readonly dataSource: DataSource;

  protected async runInTransaction<R>(
    fn: (resolve: Resolver) => Promise<R>,
  ): Promise<R> {
    const contextId = ContextIdFactory.create();
    const queryRunner = this.dataSource.createQueryRunner();
    this.moduleRef.registerRequestByContextId({ queryRunner }, contextId);
    const resolver: Resolver = (token) =>
      this.moduleRef.resolve(token, contextId);
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
