import {
  CategorizedCharacter,
  categorizeAndSortCharacters,
  getStarWarsCharacters
} from "./service/starwars/starwars.service";
import fs from "fs";
import logger from "./service/logging/logger.service";

async function main() {
  try {
    const characters = await getStarWarsCharacters();
    const categorizedCharacters: {
      gender: string;
      characters: CategorizedCharacter[];
    }[] = categorizeAndSortCharacters(characters);
    fs.writeFileSync("./output.json", JSON.stringify(categorizedCharacters));
    logger.info("The output file is generated! Please check ./output.json");
  } catch (error) {
    logger.error("An error occurred:", error);
  }
}

main();
