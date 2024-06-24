import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserModule } from "src/users/user.module";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { jwtConstants } from "./auth.utils";
import { LocalStrategyService, JwtStrategyService } from "./auth.strategy";
import { CharacterModule } from "src/characters/character.module";

@Module({
  imports: [
    UserModule,
    CharacterModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "5h" },
    }),
  ],
  providers: [AuthService, LocalStrategyService, JwtStrategyService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
