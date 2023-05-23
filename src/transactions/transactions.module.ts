import { Module } from '@nestjs/common';
import { ScopedTypeOrmModule } from '../scoped-typeorm/scoped-typeorm.module';
import { Transaction } from './transaction.model';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [ScopedTypeOrmModule.forFeature([Transaction])],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
