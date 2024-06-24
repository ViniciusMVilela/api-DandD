import { IsString, IsNotEmpty, IsNumber, Min } from "class-validator";

export class CreateCharacterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  class: string;

  @IsString()
  @IsNotEmpty()
  abilityScore: string;

  @IsString()
  @IsNotEmpty()
  feat: string;

  @IsString()
  @IsNotEmpty()
  alignment: string;

  @IsString()
  @IsNotEmpty()
  spell: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  level: number;

  @IsString()
  @IsNotEmpty()
  item: string;
}
