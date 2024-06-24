import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";
import { User } from "./interface/user.interface";
import { IsPublic } from "src/utils/auth/auth.utils";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @IsPublic()
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      throw new InternalServerErrorException(
        "Failed to create user. Please try again later."
      );
    }
  }

  @Get()
  async findAll(): Promise<User[]> {
    try {
      return await this.userService.findAll();
    } catch (error) {
      throw new InternalServerErrorException(
        "Failed to retrieve users. Please try again later."
      );
    }
  }

  @Get(":id")
  async findById(@Param("id") id: string): Promise<User> {
    try {
      const user = await this.userService.findById(id);
      if (!user) {
        throw new NotFoundException(`User not found.`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        "Failed to retrieve user. Please try again later."
      );
    }
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    try {
      const user = await this.userService.update(id, updateUserDto);
      if (!user) {
        throw new NotFoundException(`User not found for update.`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Failed to update user. Please try again later."
      );
    }
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<{ message: string }> {
    try {
      await this.userService.remove(id);
      return { message: "User successfully deleted." };
    } catch (error) {
      throw new InternalServerErrorException(
        "Failed to delete user. Please try again later."
      );
    }
  }
}
