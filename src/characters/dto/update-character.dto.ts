import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class UpdateCharacterDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  class: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  abilityScore: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  feat: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  alignment: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  spell: string;

  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  @Min(1)
  level: number;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  item: string;
}
