import { SetMetadata } from "@nestjs/common";

export const KEY = "public";
export const IsPublic = () => SetMetadata(KEY, true);

export interface UserFromJwt {
  id: number;
  username: string;
}

export interface UserPayload {
  sub: number;
  username: string;
  iat?: number;
  exp?: number;
}

export const jwtConstants = {
  secret: "secret",
};
