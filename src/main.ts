import { ValidationPipe } from '@nestjs/common';
import { ContextIdFactory } from '@nestjs/core';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ScopedContextIdStrategy } from './scoped-typeorm/context-id-strategy';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  ContextIdFactory.apply(new ScopedContextIdStrategy());

  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
