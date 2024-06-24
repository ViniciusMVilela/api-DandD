import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { KEY } from "./auth.utils";
import { Observable } from "rxjs";
import { isObservable, lastValueFrom } from "rxjs";
import { isPromise } from "util/types";

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw new UnauthorizedException(info?.message);
    }
    return user;
  }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const result = super.canActivate(context);

    if (isPromise(result)) {
      return result;
    }

    if (isObservable(result)) {
      return lastValueFrom(result);
    }

    return result;
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw new UnauthorizedException(info?.message);
    }
    return user;
  }
}
