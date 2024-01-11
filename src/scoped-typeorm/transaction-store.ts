import { Request } from 'express';
import { AsyncLocalStorage } from 'node:async_hooks';
import { QueryRunner } from 'typeorm';

type TransactionStore = {
  request: Request;
  queryRunner?: QueryRunner;
};
export const transactionStorage = new AsyncLocalStorage<TransactionStore>();
