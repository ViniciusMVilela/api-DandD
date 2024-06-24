import { Schema } from "mongoose";

export const CharactersSchema = new Schema({
  name: { type: String, required: true },
  class: { type: String, required: true },
  abilityScore: { type: String, required: true },
  alignment: { type: String, required: true },
  feat: { type: String, required: true },
  spell: { type: String, required: true },
  level: { type: Number, required: true },
  item: { type: String, required: true },
});
