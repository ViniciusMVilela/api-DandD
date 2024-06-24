import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Character } from "./interface/character.interface";
import { CreateCharacterDto } from "./dto/create-character.dto";
import { UpdateCharacterDto } from "./dto/update-character.dto";
import { ValidanteCharactersAPI } from "./validation/validateCharacter.service";

@Injectable()
export class CharacterService {
  constructor(
    @InjectModel("Character") private readonly characterModel: Model<Character>,
    private readonly dedValidationService: ValidanteCharactersAPI,
  ) {}

  async create(createCharacterDto: CreateCharacterDto): Promise<Character> {
    try {
      await this.dedValidationService.validateCharacter(createCharacterDto);
      const createdCharacter = new this.characterModel(createCharacterDto);
      return await createdCharacter.save();
    } catch (error) {
      throw new InternalServerErrorException(
        "Failed to create character. Please try again later.",
      );
    }
  }

  async findOne(name: string): Promise<Character | undefined> {
    try {
      return await this.characterModel.findOne({ name }).exec();
    } catch (error) {
      throw new InternalServerErrorException(
        "Failed to retrieve character. Please try again later.",
      );
    }
  }

  async findAll(): Promise<Character[]> {
    try {
      return await this.characterModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException(
        "Failed to retrieve characters. Please try again later.",
      );
    }
  }

  async findById(id: string): Promise<Character> {
    try {
      const character = await this.characterModel.findById(id).exec();
      if (!character) {
        throw new NotFoundException(`Character with ID ${id} not found.`);
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

  async update(
    id: string,
    updateCharacterDto: UpdateCharacterDto,
  ): Promise<Character> {
    try {
      await this.dedValidationService.validateCharacter(updateCharacterDto);
      const updatedCharacter = await this.characterModel
        .findByIdAndUpdate(id, updateCharacterDto, { new: true })
        .exec();
      if (!updatedCharacter) {
        throw new NotFoundException(`Character not found for update.`);
      }
      return updatedCharacter;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Failed to update character. Please try again later.",
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.characterModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`Character not found for deletion.`);
      }
    } catch (error) {
      throw new InternalServerErrorException(
        "Failed to delete character. Please try again later.",
      );
    }
  }
}
