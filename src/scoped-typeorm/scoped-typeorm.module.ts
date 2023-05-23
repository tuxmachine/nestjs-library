import { DynamicModule, Module, Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import { Request } from 'express';

type ReqOrQueryRunner = { queryRunner: QueryRunner } | Request;

@Module({})
export class ScopedTypeOrmModule {
  static forFeature(entities: any[]): DynamicModule {
    const providers = entities.map(
      (entity): Provider => ({
        provide: getRepositoryToken(entity),
        inject: [REQUEST, getDataSourceToken()],
        useFactory: (ctx: ReqOrQueryRunner, dataSource: DataSource) => {
          if (ctx && 'queryRunner' in ctx) {
            return ctx.queryRunner.manager.getRepository(entity);
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
}
