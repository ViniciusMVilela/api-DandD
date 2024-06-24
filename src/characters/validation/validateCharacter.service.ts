import { Injectable, BadRequestException } from "@nestjs/common";
import axios from "axios";
import { CreateCharacterDto } from "../dto/create-character.dto";

@Injectable()
export class ValidanteCharactersAPI {
  private readonly URL_DD = "https://www.dnd5eapi.co/api";

  private async validateResource(
    resource: string,
    value: string,
  ): Promise<string | null> {
    try {
      const {
        data: { results },
      } = await axios.get(`${this.URL_DD}/${resource}`);
      const validResources = results.map((item) => item.index);

      if (!validResources.includes(value)) {
        const validValues = validResources.join(", ");
        return `Invalid ${resource.slice(0, -1)}: ${value}. Valid values are: ${validValues}`;
      }

      return null;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return `Resource ${resource} not found in the API.`;
      } else {
        const errorMessage = error.message || "Unknown error";
        return `Error validating ${resource.slice(0, -1)}: ${value}. ${errorMessage}`;
      }
    }
  }

  public async validateCharacter(
    createCharacterDto: CreateCharacterDto,
  ): Promise<void> {
    const {
      level,
      abilityScore,
      class: characterClass,
      feat,
      alignment,
      spell,
      item,
    } = createCharacterDto;

    const validationTasks = [
      this.validateResource("ability-scores", abilityScore),
      this.validateResource("classes", characterClass),
      this.validateResource("feats", feat),
      this.validateResource("alignments", alignment),
      this.validateSpell(spell, level),
      this.validateResource("equipment", item),
    ];

    const validationResults = await Promise.all(validationTasks);

    const errors = validationResults.filter((error) => error !== null);

    if (errors.length > 0) {
      throw new BadRequestException(errors.join("; "));
    }
  }

  private async validateSpell(
    spellName: string,
    level: number,
  ): Promise<string | null> {
    try {
      const response = await axios.get(`${this.URL_DD}/spells/${spellName}`);
      const spellDetails = response.data;

      if (spellDetails.level > level) {
        return `Character of level ${level} cannot use spell "${spellName}" which requires level ${spellDetails.level}.`;
      }

      return null;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return `Spell "${spellName}" not found in the API.`;
      } else {
        return `Error validating spell "${spellName}": ${error.message}`;
      }
    }
  }
}
