import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevModule } from './dev/dev.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      autoLoadEntities: true,
      // Automatically create tables, great for development but very dangerous for production
      synchronize: true,
    }),
    UsersModule,
    DevModule,
  ],
})
export class AppModule {}
