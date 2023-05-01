import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DevService } from '../src/dev/dev.service';

describe('Authentication', () => {
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
    token = (await devService.login({ id: 2 })).token;
  });

  it('guards against unauthenticated access', () => {
    return request(app.getHttpServer()).get('/users/self').expect(403);
  });

  it('guards against unauthorized access', () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });
});
