import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CharacterService } from "./character.service";
import { CharactersSchema } from "./schema/character.schema";
import { CharacterController } from "./character.controller";
import { ValidanteCharactersAPI } from "./validation/validateCharacter.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "Character", schema: CharactersSchema },
    ]),
  ],
  providers: [CharacterService, ValidanteCharactersAPI],
  controllers: [CharacterController],
  exports: [CharacterService, ValidanteCharactersAPI],
})
export class CharacterModule {}
