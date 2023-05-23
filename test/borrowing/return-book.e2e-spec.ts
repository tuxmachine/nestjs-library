import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../src/users/users.service';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { DevService } from '../../src/dev/dev.service';

describe('Return book (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let activeUserToken: string;
  let indebtedUserToken: string;
  let suspendedUserToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    usersService = await app.resolve(UsersService);
    const devService: DevService = app.get(DevService);
    await devService.truncate();
    await devService.seed();
    activeUserToken = (await devService.login({ id: 2 })).token;
    indebtedUserToken = (await devService.login({ id: 3 })).token;
    suspendedUserToken = (await devService.login({ id: 4 })).token;
  });

  it('active user can return a book before dueDate and receive a refund', async () => {
    const userBefore = await usersService.getUser(2);
    const response = await request(app.getHttpServer())
      .post('/borrow/return')
      .send({
        bookId: 1,
      })
      .set('Authorization', `Bearer ${activeUserToken}`);
    expect(response.status).toEqual(201);
    const userAfter = await usersService.getUser(2);
    expect(userBefore.credit - userAfter.credit).toEqual(-2 * 5);
  });

  it('indebted user can return an overdue book and is charged a late fee', async () => {
    const userBefore = await usersService.getUser(3);
    const response = await request(app.getHttpServer())
      .post('/borrow/return')
      .send({
        bookId: 2,
      })
      .set('Authorization', `Bearer ${indebtedUserToken}`);
    expect(response.status).toEqual(201);
    const userAfter = await usersService.getUser(3);
    expect(userBefore.credit - userAfter.credit).toEqual(5 * 10);
  });

  it('a user cannot return a book after it was marked lost', async () => {
    const userBefore = await usersService.getUser(4);
    const response = await request(app.getHttpServer())
      .post('/borrow/return')
      .send({
        bookId: 1,
      })
      .set('Authorization', `Bearer ${suspendedUserToken}`);
    expect(response.status).toEqual(400);
    const userAfter = await usersService.getUser(4);
    expect(userBefore.credit).toEqual(userAfter.credit);
  });
});
