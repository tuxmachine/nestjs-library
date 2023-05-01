import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { DevService } from '../../src/dev/dev.service';

describe('Delete book (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    const devService: DevService = app.get(DevService);
    await devService.truncate();
    await devService.seed();
    token = (await devService.login({ id: 1 })).token;
  });

  it('sets amount to zero', () => {
    return request(app.getHttpServer())
      .delete('/books/3')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            amount: 0,
          }),
        );
      });
  });

  it('throws an error if the book is lent out', async () => {
    const response = await request(app.getHttpServer())
      .delete('/books/1')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch('lent out');
  });
});
