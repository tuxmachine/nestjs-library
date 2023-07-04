import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
    }),
  );

  // @Kamil, any tips on bootstrapping the metadata.ts file?
  // Since it's a generated file, it makes sense to add to gitignore, but
  // running `pnpm run swagger` without this file throws a error:
  // >> Cannot find module './metadata' or its corresponding type declarations
  await SwaggerModule.loadPluginMetadata((await import('./metadata')).default);
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
