import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./interface/user.interface";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(@InjectModel("User") private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = {
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, 10),
      };
      const createdUser = new this.userModel(user);
      return await createdUser.save();
    } catch (error) {
      throw new InternalServerErrorException(
        "Failed to create user. Please try again later.",
      );
    }
  }

  async findByName(username: string): Promise<User | undefined> {
    try {
      const user = await this.userModel.findOne({ username }).exec();
      if (!user) {
        throw new NotFoundException(`User with username ${username} not found`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        "Failed to retrieve user by username. Please try again later.",
      );
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException(
        "Failed to retrieve users. Please try again later.",
      );
    }
  }

  async findById(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        "Failed to retrieve user by ID. Please try again later.",
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();
      if (!updatedUser) {
        throw new NotFoundException(`User not found for update.`);
      }
      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Failed to update user. Please try again later.",
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.userModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`User not found for deletion.`);
      }
    } catch (error) {
      throw new InternalServerErrorException(
        "Failed to delete user. Please try again later.",
      );
    }
  }
}
