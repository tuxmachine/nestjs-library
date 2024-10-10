import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@lib/auth';
import { DevModule } from './dev/dev.module';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { MessengerClientsModule } from '@lib/messenger-clients';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'users-db.sqlite',
      autoLoadEntities: true,
      // Automatically create tables, great for development but very dangerous for production
      synchronize: true,
    }),
    AuthModule.registerAsync({
      imports: [UsersModule],
      useFactory: (usersService: UsersService) => ({
        getUserBySub: (id) => usersService.getUser(id),
      }),
      inject: [UsersService],
    }),
    UsersModule,
    DevModule,
    MessengerClientsModule,
  ],
})
export class UsersAppModule {}
