import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../apps/library/src/app.module';
import { DevService } from '../../apps/library/src/dev/dev.service';

describe('Update user (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
      }),
    );
    await app.init();
    const devService: DevService = app.get(DevService);
    await devService.truncate();
    await devService.seed();
  });

  it('rejects invalid payloads', () => {
    return request(app.getHttpServer())
      .put('/users')
      .send({
        id: 1,
        email: 'hello',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body).toMatchObject({
          message: ['email must be an email'],
          statusCode: 400,
        });
      });
  });

  it('updates a user', () => {
    return request(app.getHttpServer())
      .put('/users')
      .send({
        id: 1,
        email: 'hello@world.com',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toMatchObject({ email: 'hello@world.com', id: 1 });
      });
  });
});
