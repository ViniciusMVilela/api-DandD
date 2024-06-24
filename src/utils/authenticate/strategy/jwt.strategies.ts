import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import {
  jwtConstants,
  UserPayload,
  UserFromJwt,
} from "src/utils/auth/auth.utils";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: UserPayload): Promise<UserFromJwt> {
    return {
      id: payload.sub,
      username: payload.username,
    };
  }
}
