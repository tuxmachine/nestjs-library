import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../src/users/users.service';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { DevService } from '../../src/dev/dev.service';

describe('Borrow book (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let activeUserToken: string;
  let indebtedUserToken: string;
  let suspendedUserToken: string;
  let overdueUserToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    usersService = app.get(UsersService);
    const devService: DevService = app.get(DevService);
    await devService.truncate();
    await devService.seed();
    activeUserToken = (await devService.login({ id: 2 })).token;
    indebtedUserToken = (await devService.login({ id: 3 })).token;
    suspendedUserToken = (await devService.login({ id: 4 })).token;
    overdueUserToken = (await devService.login({ id: 5 })).token;
    jest.useFakeTimers({ now: new Date(`2000-01-01T00:00:00Z`) });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('active user can borrow an available book which will cost them 5ct/day', async () => {
    const userBefore = await usersService.getUser(2);
    const response = await request(app.getHttpServer())
      .post('/borrow')
      .send({
        bookId: 3,
      })
      .set('Authorization', `Bearer ${activeUserToken}`);
    expect(response.status).toEqual(201);
    const userAfter = await usersService.getUser(2);
    expect(userBefore.credit - userAfter.credit).toEqual(31 * 5);
  });

  it('active user cannot borrow an unavailable book', async () => {
    const response = await request(app.getHttpServer())
      .post('/borrow')
      .send({
        bookId: 2,
      })
      .set('Authorization', `Bearer ${activeUserToken}`);
    expect(response.status).toEqual(400);
    expect(response.body.message).toMatch('not available');
  });

  it('active user cannot borrow with insufficient credit', async () => {
    await usersService.chargeFees(2, 990);
    const response = await request(app.getHttpServer())
      .post('/borrow')
      .send({
        bookId: 3,
      })
      .set('Authorization', `Bearer ${activeUserToken}`);
    expect(response.status).toEqual(400);
    expect(response.body.message).toMatch('insufficient credit');
  });

  it('active user cannot borrow with an overdue book', async () => {
    await usersService.chargeFees(2, 990);
    const response = await request(app.getHttpServer())
      .post('/borrow')
      .send({
        bookId: 3,
      })
      .set('Authorization', `Bearer ${overdueUserToken}`);
    expect(response.status).toEqual(403);
    expect(response.body.message).toMatch('overdue books');
  });

  it('suspended user cannot borrow an available book', async () => {
    const response = await request(app.getHttpServer())
      .post('/borrow')
      .send({
        bookId: 3,
      })
      .set('Authorization', `Bearer ${suspendedUserToken}`);
    expect(response.status).toEqual(403);
    expect(response.body.message).toMatch('not eligible');
  });

  it('indebted user cannot borrow an available book', async () => {
    const response = await request(app.getHttpServer())
      .post('/borrow')
      .send({
        bookId: 3,
      })
      .set('Authorization', `Bearer ${indebtedUserToken}`);
    expect(response.status).toEqual(403);
    expect(response.body.message).toMatch('not eligible');
  });
});
