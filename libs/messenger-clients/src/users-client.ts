import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  AddCreditParams,
  AddCreditResult,
  ChargeFeesParams,
  ChargeFeesResult,
  CheckUserCreditParams,
  CheckUserCreditResult,
  SuspendUserParams,
  SuspendUserResult,
  UserCreatedPayload,
  UserEvents,
  UserPatterns,
  UserResult,
  UserUpdatedPayload,
} from './user.types';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsersClient {
  constructor(
    @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
  ) {}

  suspendUser(params: SuspendUserParams): Promise<SuspendUserResult> {
    const result$ = this.natsClient.send<SuspendUserResult, SuspendUserParams>(
      UserPatterns.suspendUser,
      params,
    );
    return firstValueFrom(result$);
  }

  checkCredit(params: CheckUserCreditParams): Promise<CheckUserCreditResult> {
    const result$ = this.natsClient.send<
      CheckUserCreditResult,
      CheckUserCreditParams
    >(UserPatterns.checkCredit, params);
    return firstValueFrom(result$);
  }

  addCredit(params: AddCreditParams): Promise<AddCreditResult> {
    const result$ = this.natsClient.send<AddCreditResult, AddCreditParams>(
      UserPatterns.addCredit,
      params,
    );
    return firstValueFrom(result$);
  }

  chargeFees(params: ChargeFeesParams): Promise<ChargeFeesResult> {
    const result$ = this.natsClient.send<ChargeFeesResult, ChargeFeesParams>(
      UserPatterns.chargeFees,
      params,
    );
    return firstValueFrom(result$);
  }

  userCreated(user: UserCreatedPayload): Promise<void> {
    return firstValueFrom(this.natsClient.emit(UserEvents.created, user));
  }

  userUpdated(user: UserUpdatedPayload): Promise<void> {
    return firstValueFrom(this.natsClient.emit(UserEvents.updated, user));
  }

  getUsers(): Promise<UserResult[]> {
    const result$ = this.natsClient.send<UserResult[], {}>(
      UserPatterns.getUsers,
      {},
    );
    return firstValueFrom(result$);
  }
}
