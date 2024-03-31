import {
  CategorizedCharacter,
  categorizeAndSortCharacters,
  getStarWarsCharacters,
} from "./service/starwars.service";
import fs from "fs";

async function main() {
  try {
    const characters = await getStarWarsCharacters();
    const categorizedCharacters: {
      gender: string;
      characters: CategorizedCharacter[];
    }[] = categorizeAndSortCharacters(characters);
    fs.writeFileSync("./output.json", JSON.stringify(categorizedCharacters));
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
