import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserRole } from '../users/user-role';
import { UserStatus } from '../users/user-status';
import { User } from '../users/user.entity';

@Injectable()
export class DevService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async truncate() {
    await this.dataSource.synchronize(true);
  }

  async seed() {
    const admin = this.userRepo.create({
      email: 'admin@local.library',
      externalId: '1',
      credit: 0,
      role: UserRole.admin,
    });
    const activeUser = this.userRepo.create({
      email: 'john.doe@gmail.com',
      externalId: '1234',
      credit: 1000,
      role: UserRole.user,
    });
    const indebtedUser = this.userRepo.create({
      email: 'bob@gmail.com',
      externalId: '4321',
      credit: -10,
      role: UserRole.user,
      status: UserStatus.active,
    });
    const suspendedUser = this.userRepo.create({
      email: 'jane.doe@gmail.com',
      externalId: '2143',
      credit: -1780,
      role: UserRole.user,
      status: UserStatus.suspended,
    });
    const overdueUser = this.userRepo.create({
      email: 'jane.austin@gmail.com',
      externalId: '1243',
      credit: 500,
      role: UserRole.user,
      status: UserStatus.active,
    });
    await this.userRepo.save([
      admin,
      activeUser,
      indebtedUser,
      suspendedUser,
      overdueUser,
    ]);
  }
}
