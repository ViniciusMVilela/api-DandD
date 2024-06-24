import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { KEY } from "src/utils/auth/auth.utils";
import { Observable, lastValueFrom } from "rxjs";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    try {
      const canActivate = super.canActivate(context);

      if (typeof canActivate === "boolean") {
        return canActivate;
      }

      if (canActivate instanceof Promise) {
        return await canActivate;
      }

      if (canActivate instanceof Observable) {
        return await lastValueFrom(canActivate);
      }

      return false;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(error.message);
      }
      throw new UnauthorizedException();
    }
  }
}
