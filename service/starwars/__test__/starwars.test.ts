import axios from "axios";
import {
  CategorizedCharacter,
  Character,
  SWAPI_URL,
  categorizeAndSortCharacters,
  getStarWarsCharacters,
  sortCharacters
} from "../starwars.service";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(axios);

mock.onGet(new RegExp(`${SWAPI_URL}/*`)).reply(200, {
  count: 82,
  next: null,
  previous: "https://swapi.dev/api/people/?page=8",
  results: [
    {
      name: "Sly Moore",
      height: "178",
      mass: "48",
      hair_color: "none",
      skin_color: "pale",
      eye_color: "white",
      birth_year: "unknown",
      gender: "female",
      homeworld: "https://swapi.dev/api/planets/60/",
      films: [
        "https://swapi.dev/api/films/5/",
        "https://swapi.dev/api/films/6/"
      ],
      species: [],
      vehicles: [],
      starships: [],
      created: "2014-12-20T20:18:37.619000Z",
      edited: "2014-12-20T21:17:50.496000Z",
      url: "https://swapi.dev/api/people/82/"
    },
    {
      name: "Tion Medon",
      height: "206",
      mass: "80",
      hair_color: "none",
      skin_color: "grey",
      eye_color: "black",
      birth_year: "unknown",
      gender: "male",
      homeworld: "https://swapi.dev/api/planets/12/",
      films: ["https://swapi.dev/api/films/6/"],
      species: ["https://swapi.dev/api/species/37/"],
      vehicles: [],
      starships: [],
      created: "2014-12-20T20:35:04.260000Z",
      edited: "2014-12-20T21:17:50.498000Z",
      url: "https://swapi.dev/api/people/83/"
    }
  ]
});

describe("getStarWarsCharacters function", () => {
  it("should return", async () => {
    const characters = await getStarWarsCharacters();

    expect(characters).toEqual([
      { name: "Sly Moore", height: "178", gender: "female" },
      { name: "Tion Medon", height: "206", gender: "male" }
    ]);
  });
});

describe("sortCharacters function", () => {
  it("should correctly sort characters by height and alphabetically by name", () => {
    const characters: CategorizedCharacter[] = [
      { name: "Anakin Skywalker", height: "188" },
      { name: "Chewbacca", height: "228" },
      { name: "Luke Skywalker", height: "172" },
      { name: "Yoda", height: "66" }
    ];

    const sortedCharacters = sortCharacters(characters);

    expect(sortedCharacters).toEqual([
      { name: "Yoda", height: "66" },
      { name: "Luke Skywalker", height: "172" },
      { name: "Anakin Skywalker", height: "188" },
      { name: "Chewbacca", height: "228" }
    ]);
  });

  it("should handle empty array", () => {
    const characters: Character[] = [];

    const sortedCharacters = sortCharacters(characters);

    expect(sortedCharacters).toEqual([]);
  });

  it("should handle array with only characters of unknown height", () => {
    const characters = [
      { name: "Rey", height: "unknown" },
      { name: "R2-D2", height: "unknown" },
      { name: "Arvel Crynyd", height: "unknown" }
    ];

    const sortedCharacters = sortCharacters(characters);

    expect(sortedCharacters).toEqual([
      { name: "Arvel Crynyd", height: "unknown" },
      { name: "R2-D2", height: "unknown" },
      { name: "Rey", height: "unknown" }
    ]);
  });

  it("should handle array with only characters of known height", () => {
    const characters = [
      { name: "Leia Organa", height: "150", gender: "female" },
      { name: "Taun We", height: "213", gender: "female" },
      { name: "Mon Mothma", height: "150", gender: "female" },
      { name: "Padmé Amidala", height: "185", gender: "female" },
      { name: "Shmi Skywalker", height: "163", gender: "female" }
    ];

    const sortedCharacters = sortCharacters(characters);

    expect(sortedCharacters).toEqual([
      { name: "Leia Organa", height: "150", gender: "female" },
      { name: "Mon Mothma", height: "150", gender: "female" },
      { name: "Shmi Skywalker", height: "163", gender: "female" },
      { name: "Padmé Amidala", height: "185", gender: "female" },
      { name: "Taun We", height: "213", gender: "female" }
    ]);
  });
});

describe("categorizeAndSortCharacters function", () => {
  it("should correctly sort characters by height and alphabetically by name", () => {
    const characters: Character[] = [
      { name: "Anakin Skywalker", height: "188", gender: "male" },
      { name: "Chewbacca", height: "228", gender: "male" },
      { name: "Taun We", height: "213", gender: "female" },
      { name: "Leia Organa", height: "150", gender: "female" },
      { name: "Luke Skywalker", height: "172", gender: "male" },
      { name: "Yoda", height: "66", gender: "male" },
      { name: "Rey", height: "unknown", gender: "female" },
      { name: "R2-D2", height: "96", gender: "unknown" },
      { name: "Jabba Desilijic Tiure", height: "175", gender: "hermaphrodite" }
    ];

    const sortedCharacters = categorizeAndSortCharacters(characters);

    expect(sortedCharacters).toEqual([
      {
        gender: "male",
        characters: [
          { name: "Yoda", height: "66" },
          { name: "Luke Skywalker", height: "172" },
          { name: "Anakin Skywalker", height: "188" },
          { name: "Chewbacca", height: "228" }
        ]
      },
      {
        gender: "female",
        characters: [
          { name: "Leia Organa", height: "150" },
          { name: "Taun We", height: "213" },
          { name: "Rey", height: "unknown" }
        ]
      },
      { gender: "unknown", characters: [{ name: "R2-D2", height: "96" }] },
      {
        gender: "hermaphrodite",
        characters: [{ name: "Jabba Desilijic Tiure", height: "175" }]
      }
    ]);
  });

  it("should handle empty array", () => {
    const characters: Character[] = [];

    const sortedCharacters = sortCharacters(characters);

    expect(sortedCharacters).toEqual([]);
  });
});
