import { NestFactory } from '@nestjs/core';
import { UsersAppModule } from './users-app.module';
import { NatsOptions, Transport } from '@nestjs/microservices';
import { NATS_OPTIONS } from '@lib/shared';
import { LoggingInterceptor } from '@lib/shared/logging.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(UsersAppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(new LoggingInterceptor());

  app.connectMicroservice<NatsOptions>(
    {
      transport: Transport.NATS,
      options: {
        ...NATS_OPTIONS,
        queue: 'users',
      },
    },
    { inheritAppConfig: true },
  );

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
