import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./users/user.module";
import { AuthModule } from "./utils/auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./utils/authenticate/guards/jwt-auth.guards";
import { RequestLogSchema } from "./utils/log/request-log.schema";
import { RequestLogService } from "./utils/log/request-log.service";
import { LoggerMiddleware } from "./utils/log/logger.middleware";
import { CharacterModule } from "./characters/character.module";
import { LogModule } from "./utils/log/log.module";

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://localhost/apiDeD"),
    MongooseModule.forFeature([
      { name: "RequestLog", schema: RequestLogSchema },
    ]),
    UserModule,
    CharacterModule,
    AuthModule,
    LogModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    RequestLogService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
