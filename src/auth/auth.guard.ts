import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../users/user-role';
import { User } from '../users/user.model';
import { IS_ADMIN } from './admin.decorator';
import { IS_PUBLIC } from './public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization as string;
    const isPublic =
      this.reflector.get<boolean>(IS_PUBLIC, context.getClass()) ||
      this.reflector.get<boolean>(IS_PUBLIC, context.getHandler());

    const requiresAdmin =
      this.reflector.get<boolean>(IS_ADMIN, context.getClass()) ||
      this.reflector.get<boolean>(IS_ADMIN, context.getHandler());

    if (!authHeader) {
      return isPublic;
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer') {
      return false;
    }

    const payload = await this.jwtService.verifyAsync(token);
    request.user = await this.userRepo.findOneByOrFail({
      externalId: payload.sub,
    });

    if (request.user) {
      if (requiresAdmin && request.user.role !== UserRole.admin) {
        return false;
      }

      return true;
    }

    return false;
  }
}
