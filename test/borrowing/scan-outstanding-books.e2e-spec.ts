import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { subMonths } from 'date-fns';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { Book } from '../../src/books/book.entity';
import { BorrowingStatus } from '../../src/borrowing/borrowing-status';
import { Borrowing } from '../../src/borrowing/borrowing.entity';
import { DevService } from '../../src/dev/dev.service';
import { UserRole } from '../../src/users/user-role';
import { UserStatus } from '../../src/users/user-status';
import { User } from '../../src/users/user.entity';

describe('Scan outstanding book (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let userRepo: Repository<User>;
  let bookRepo: Repository<Book>;
  let borrowingRepo: Repository<Borrowing>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    const devService: DevService = app.get(DevService);
    await devService.truncate();
    userRepo = app.get(getRepositoryToken(User));
    bookRepo = app.get(getRepositoryToken(Book));
    borrowingRepo = app.get(getRepositoryToken(Borrowing));
    const admin = userRepo.create({
      externalId: '0',
      email: 'admin@local.library',
      credit: 0,
      status: UserStatus.active,
      role: UserRole.admin,
    });
    await userRepo.save(admin);
    await bookRepo.save({
      amount: 1,
      title: 'The Lord of the Rings',
      author: 'J. R. R. Tolkien',
      isbn: '9780007525546',
    });
    adminToken = (await devService.login({ id: admin.id })).token;
    jest.useFakeTimers({ now: new Date(`2000-01-01T00:00:00Z`) });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('suspends a user that has not settled their debt in 1 year', async () => {
    const user = userRepo.create({
      externalId: '1',
      email: 'john.doe@gmail.com',
      credit: -100,
      status: UserStatus.active,
      updatedAt: subMonths(new Date(), 13),
      createdAt: subMonths(new Date(), 14),
      role: UserRole.user,
    });
    await userRepo.save(user);
    const response = await request(app.getHttpServer())
      .post('/borrow/scan')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).toBe(201);
    await expect(
      userRepo.findOneByOrFail({ id: user.id }),
    ).resolves.toMatchObject({
      status: UserStatus.suspended,
    });
  });

  it('suspends a user that has has an overdue book of 1 year', async () => {
    const user = userRepo.create({
      externalId: '1',
      email: 'john.doe@gmail.com',
      credit: 0,
      status: UserStatus.active,
      updatedAt: subMonths(new Date(), 14),
      createdAt: subMonths(new Date(), 15),
      role: UserRole.user,
    });
    await userRepo.save(user);
    const borrowing = borrowingRepo.create({
      bookId: 1,
      userId: user.id,
      dueDate: subMonths(new Date(), 13),
      borrowingDate: subMonths(new Date(), 14),
      status: BorrowingStatus.active,
    });
    await borrowingRepo.save(borrowing);
    const response = await request(app.getHttpServer())
      .post('/borrow/scan')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).toBe(201);

    await expect(
      userRepo.findOneByOrFail({ id: user.id }),
    ).resolves.toMatchObject({
      status: UserStatus.suspended,
    });
  });

  it('marks a borrowing as overdue if it is past its return date', async () => {
    const user = userRepo.create({
      externalId: '1',
      email: 'john.doe@gmail.com',
      credit: 0,
      status: UserStatus.active,
      updatedAt: subMonths(new Date(), 2),
      createdAt: subMonths(new Date(), 8),
      role: UserRole.user,
    });
    await userRepo.save(user);
    const borrowing = borrowingRepo.create({
      bookId: 1,
      userId: user.id,
      dueDate: subMonths(new Date(), 1),
      borrowingDate: subMonths(new Date(), 2),
      status: BorrowingStatus.active,
    });
    await borrowingRepo.save(borrowing);
    const response = await request(app.getHttpServer())
      .post('/borrow/scan')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).toBe(201);

    await expect(
      borrowingRepo.findOneByOrFail({ id: borrowing.id }),
    ).resolves.toMatchObject({
      status: BorrowingStatus.overdue,
    });
  });

  it('marks a book as lost if it is overdue book for 1 year', async () => {
    const user = userRepo.create({
      externalId: '1',
      email: 'john.doe@gmail.com',
      credit: 0,
      status: UserStatus.active,
      updatedAt: subMonths(new Date(), 14),
      createdAt: subMonths(new Date(), 15),
      role: UserRole.user,
    });
    await userRepo.save(user);
    const borrowing = borrowingRepo.create({
      bookId: 1,
      userId: user.id,
      dueDate: subMonths(new Date(), 13),
      borrowingDate: subMonths(new Date(), 14),
      status: BorrowingStatus.active,
    });
    await borrowingRepo.save(borrowing);
    const response = await request(app.getHttpServer())
      .post('/borrow/scan')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).toBe(201);

    await expect(
      borrowingRepo.findOneByOrFail({ id: borrowing.id }),
    ).resolves.toMatchObject({
      status: BorrowingStatus.lost,
    });

    await expect(bookRepo.findOneByOrFail({ id: 1 })).resolves.toMatchObject({
      amount: 0,
    });
  });
});
