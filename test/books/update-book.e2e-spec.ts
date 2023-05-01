import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { DevService } from '../../src/dev/dev.service';

describe('Update book (e2e)', () => {
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

  it('performs partial update', () => {
    const book = {
      id: 1,
      amount: 3,
    };
    return request(app.getHttpServer())
      .put('/books')
      .send(book)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(expect.objectContaining(book));
      });
  });
});
