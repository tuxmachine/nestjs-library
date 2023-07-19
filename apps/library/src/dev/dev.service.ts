import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { addDays, subDays, subMonths } from 'date-fns';
import { DataSource, Repository } from 'typeorm';
import { Book } from '../books/book.entity';
import { BorrowingStatus } from '../borrowing/borrowing-status';
import { Borrowing } from '../borrowing/borrowing.entity';
import { UserRole } from '../users/user-role';
import { UserStatus } from '../users/user-status';
import { User } from '../users/user.entity';

@Injectable()
export class DevService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
    @InjectRepository(Borrowing)
    private readonly borrowingRepo: Repository<Borrowing>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
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

    const book = this.bookRepo.create([
      {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        isbn: '9780544003415',
        amount: 1,
      },
      {
        title: 'The Lion, the Witch and the Wardrobe',
        author: 'C.S. Lewis',
        isbn: '9780064471046',
        amount: 1,
      },
      {
        title: 'Hyperion',
        author: 'Dan Simmons',
        isbn: '9780553283686',
        amount: 1,
      },
      {
        title: 'Dune',
        author: 'Frank Herbert',
        isbn: '9780441172719',
        amount: 1,
      },
    ]);
    await this.bookRepo.save(book);

    const borrowing = this.borrowingRepo.create([
      {
        userId: activeUser.id,
        bookId: book[0].id,
        status: BorrowingStatus.active,
        borrowingDate: subDays(new Date(), 3),
        dueDate: addDays(new Date(), 3),
      },
      {
        userId: indebtedUser.id,
        bookId: book[1].id,
        status: BorrowingStatus.overdue,
        borrowingDate: subMonths(new Date(), 1),
        dueDate: subDays(new Date(), 5),
      },
      {
        userId: activeUser.id,
        bookId: book[2].id,
        status: BorrowingStatus.returned,
        borrowingDate: subMonths(new Date(), 1),
        dueDate: new Date(),
      },
      {
        userId: suspendedUser.id,
        bookId: book[0].id,
        status: BorrowingStatus.lost,
        borrowingDate: subMonths(new Date(), 14),
        dueDate: subMonths(new Date(), 13),
      },
      {
        userId: overdueUser.id,
        bookId: book[3].id,
        status: BorrowingStatus.overdue,
        borrowingDate: subMonths(new Date(), 2),
        dueDate: subMonths(new Date(), 1),
      },
    ]);
    await this.borrowingRepo.save(borrowing);
  }

  async login(filter: { id?: number; externalId?: string }) {
    const user = await this.userRepo.findOneOrFail({ where: filter });
    const token = await this.jwtService.signAsync(
      {},
      { subject: user.externalId },
    );
    return { token };
  }
}
