import { InjectRepository } from '@nestjs/typeorm';
import { TransactionsService } from '../transactions/transactions.service';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatus } from './user-status';
import { User } from './user.entity';

export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly transactionsService: TransactionsService,
  ) {}

  getUsers(where?: FindOptionsWhere<User>) {
    return this.usersRepo.find({ where });
  }

  getUser(id: number) {
    return this.usersRepo.findOneByOrFail({ id });
  }

  getUserByExternalId(externalId: string) {
    return this.usersRepo.findOneByOrFail({ externalId });
  }

  async hasUserCredit(userId: number) {
    const user = await this.getUser(userId);
    return user.credit > 0 && user.status === UserStatus.active;
  }

  async addCredit(userId: number, amount: number, reference = 'add credit') {
    await this.transactionsService.createTransaction({
      userId,
      amount,
      reference,
    });
    return this.usersRepo.increment({ id: userId }, 'credit', amount);
  }

  async chargeFees(userId: number, amount: number, reference = 'charge fees') {
    await this.transactionsService.createTransaction({
      userId,
      amount,
      reference,
    });
    const user = await this.usersRepo.findOneByOrFail({ id: userId });
    user.credit -= amount;
    return this.usersRepo.save(user);
  }

  async updateUser({ id, ...update }: UpdateUserDto) {
    const user = await this.usersRepo.findOneOrFail({ where: { id } });
    Object.assign(user, update);
    return this.usersRepo.save(user);
  }

  async suspendUser(id: number) {
    const user = await this.updateUser({ id, status: UserStatus.suspended });
    return user;
  }
}
