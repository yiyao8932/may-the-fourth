import axios from "axios";
import logger from "../logging/logger.service";

export const SWAPI_URL = "https://swapi.dev/api/people/";

export interface Character {
  name: string;
  height: string;
  gender: string;
}

export interface CategorizedCharacter {
  name: string;
  height: string;
}

// Get all Star Wars characters from swapi by looping through the pages.
export async function getStarWarsCharacters(): Promise<Character[]> {
  const allCharacters: Character[] = [];
  let hasNext: boolean = true;
  let nextUrl: string = SWAPI_URL;
  try {
    while (hasNext) {
      const { data } = await axios.get(nextUrl);
      for (let i = 0; i < data.results.length; i++) {
        const character = data.results[i];
        const mappedCharacter: Character = {
          name: character.name,
          height: character.height,
          gender: character.gender
        };
        allCharacters.push(mappedCharacter);
      }
      if (data.next) {
        nextUrl = data.next;
      } else {
        hasNext = false;
      }
    }
  } catch (error) {
    logger.error("Error fetching Star Wars characters:", error.message);
  }
  return allCharacters;
}

// Categorize Star Wars characters into genders, sort them by height.
// If no height is provided, sort it by alphabet.
export function categorizeAndSortCharacters(characters: Character[]): {
  gender: string;
  characters: CategorizedCharacter[];
}[] {
  const categorizedCharacters: {
    [key: string]: CategorizedCharacter[];
  } = {};

  for (let i = 0; i < characters.length; i++) {
    const character: Character = characters[i];

    if (!categorizedCharacters[character.gender]) {
      categorizedCharacters[character.gender] = [];
    }
    categorizedCharacters[character.gender].push({
      name: character.name,
      height: character.height
    });
  }

  const sortedCategories: {
    gender: string;
    characters: CategorizedCharacter[];
  }[] = [];

  for (const gender in categorizedCharacters) {
    const sortedCharacters = sortCharacters(categorizedCharacters[gender]);
    sortedCategories.push({ gender, characters: sortedCharacters });
  }

  return sortedCategories;
}

// Helper function for sorting characters
export function sortCharacters(
  characters: CategorizedCharacter[]
): CategorizedCharacter[] {
  const sortedCharacters: CategorizedCharacter[] = [];
  const unknownHeightCharacters: CategorizedCharacter[] = [];

  // Partition characters by height
  for (let i = 0; i < characters.length; i++) {
    const character: CategorizedCharacter = characters[i];
    if (character.height === "unknown") {
      unknownHeightCharacters.push(character);
    } else {
      let inserted: boolean = false;
      for (let j = 0; j < sortedCharacters.length; j++) {
        const heightA: number = parseInt(character.height);
        const heightB: number = parseInt(sortedCharacters[j].height);

        if (
          (!isNaN(heightA) && isNaN(heightB)) ||
          (!isNaN(heightA) && !isNaN(heightB) && heightA < heightB)
        ) {
          sortedCharacters.splice(j, 0, character);
          inserted = true;
          break;
        }
      }
      if (!inserted) {
        sortedCharacters.push(character);
      }
    }
  }

  // Sort characters with unknown height alphabetically
  for (let i = 0; i < unknownHeightCharacters.length - 1; i++) {
    for (let j = i + 1; j < unknownHeightCharacters.length; j++) {
      if (
        unknownHeightCharacters[i].name.localeCompare(
          unknownHeightCharacters[j].name
        ) > 0
      ) {
        const temp: CategorizedCharacter = unknownHeightCharacters[i];
        unknownHeightCharacters[i] = unknownHeightCharacters[j];
        unknownHeightCharacters[j] = temp;
      }
    }
  }

  return sortedCharacters.concat(unknownHeightCharacters);
}
