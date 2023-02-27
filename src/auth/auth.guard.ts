import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { IS_PUBLIC } from './decorators/is-public.decorator';
import { IS_REFRESH } from './decorators/is-refresh.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC,
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    const isRefresh = this.reflector.get<boolean>(
      IS_REFRESH,
      context.getHandler(),
    );

    try {
      const req = context.switchToHttp().getRequest();
      const [bearer, token] = req.headers.authorization.split(' ');

      if (!token || bearer !== 'Bearer') {
        throw new Error();
      }

      const secret = isRefresh
        ? process.env.JWT_SECRET_REFRESH_KEY
        : process.env.JWT_SECRET_KEY;
      const user = this.jwtService.verify(token, { secret });

      req.user = user;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
