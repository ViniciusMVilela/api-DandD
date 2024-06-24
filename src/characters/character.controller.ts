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
import { CreateCharacterDto } from "./dto/create-character.dto";
import { UpdateCharacterDto } from "./dto/update-character.dto";
import { CharacterService } from "./character.service";
import { Character } from "./interface/character.interface";

@Controller("character")
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post()
  async create(
    @Body() createCharacterDto: CreateCharacterDto,
  ): Promise<Character> {
    try {
      return await this.characterService.create(createCharacterDto);
    } catch (error) {
      throw new InternalServerErrorException(
        "Failed to create character. Please try again later.",
      );
    }
  }

  @Get()
  async findAll(): Promise<Character[]> {
    try {
      return await this.characterService.findAll();
    } catch (error) {
      throw new InternalServerErrorException(
        "Failed to retrieve characters. Please try again later.",
      );
    }
  }

  @Get(":id")
  async findById(@Param("id") id: string): Promise<Character> {
    try {
      const character = await this.characterService.findById(id);
      if (!character) {
        throw new NotFoundException(`Character not found.`);
      }
      return character;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Failed to retrieve character by ID. Please try again later.",
      );
    }
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateCharacterDto: UpdateCharacterDto,
  ): Promise<Character> {
    try {
      const character = await this.characterService.update(
        id,
        updateCharacterDto,
      );
      if (!character) {
        throw new NotFoundException(`Character not found for update.`);
      }
      return character;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Failed to update character. Please try again later.",
      );
    }
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<{ message: string }> {
    try {
      await this.characterService.remove(id);
      return { message: "Character successfully deleted." };
    } catch (error) {
      throw new InternalServerErrorException(
        "Failed to delete character. Please try again later.",
      );
    }
  }
}
