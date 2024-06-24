import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
} from "@nestjs/common";
import { LocalAuthGuard } from "src/utils/authenticate/guards/local-auth.guard";
import { AuthService } from "./auth.service";
import { IsPublic } from "./auth.utils";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
