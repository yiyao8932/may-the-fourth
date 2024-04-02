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

// mock the first page data for axios
mock
  .onGet(`${SWAPI_URL}`)
  .replyOnce(200, {
    count: 82,
    next: "https://swapi.dev/api/people/?page=2",
    previous: null,
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
  })
  .onGet(`${SWAPI_URL}`)
  .replyOnce(500);

// mock the data for next page
mock.onGet(`${SWAPI_URL}?page=2`).reply(200, {
  count: 82,
  next: null,
  previous: SWAPI_URL,
  results: [
    {
      name: "Luke Skywalker",
      height: "172",
      mass: "77",
      hair_color: "blond",
      skin_color: "fair",
      eye_color: "blue",
      birth_year: "19BBY",
      gender: "male",
      homeworld: "https://swapi.dev/api/planets/1/",
      films: [
        "https://swapi.dev/api/films/1/",
        "https://swapi.dev/api/films/2/",
        "https://swapi.dev/api/films/3/",
        "https://swapi.dev/api/films/6/"
      ],
      species: [],
      vehicles: [
        "https://swapi.dev/api/vehicles/14/",
        "https://swapi.dev/api/vehicles/30/"
      ],
      starships: [
        "https://swapi.dev/api/starships/12/",
        "https://swapi.dev/api/starships/22/"
      ],
      created: "2014-12-09T13:50:51.644000Z",
      edited: "2014-12-20T21:17:56.891000Z",
      url: "https://swapi.dev/api/people/1/"
    },
    {
      name: "R2-D2",
      height: "96",
      mass: "32",
      hair_color: "n/a",
      skin_color: "white, blue",
      eye_color: "red",
      birth_year: "33BBY",
      gender: "n/a",
      homeworld: "https://swapi.dev/api/planets/8/",
      films: [
        "https://swapi.dev/api/films/1/",
        "https://swapi.dev/api/films/2/",
        "https://swapi.dev/api/films/3/",
        "https://swapi.dev/api/films/4/",
        "https://swapi.dev/api/films/5/",
        "https://swapi.dev/api/films/6/"
      ],
      species: ["https://swapi.dev/api/species/2/"],
      vehicles: [],
      starships: [],
      created: "2014-12-10T15:11:50.376000Z",
      edited: "2014-12-20T21:17:50.311000Z",
      url: "https://swapi.dev/api/people/3/"
    }
  ]
});

describe("getStarWarsCharacters function", () => {
  it("should return a list of characters when the response is 200", async () => {
    const characters = await getStarWarsCharacters();

    expect(characters).toEqual([
      { name: "Sly Moore", height: "178", gender: "female" },
      { name: "Tion Medon", height: "206", gender: "male" },
      { name: "Luke Skywalker", height: "172", gender: "male" },
      { name: "R2-D2", height: "96", gender: "n/a" }
    ]);
  });

  it("should return an empty list of characters when the response is 500", async () => {
    const characters = await getStarWarsCharacters();

    expect(characters).toEqual([]);
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
