# May The Fourth

This TypeScript script gets all characters from the Star Wars API, categorizes them based on gender, and sorts them accordingly.

## Installation

1. Make sure you have Node.js with version 20.12.0 installed on your machine.
2. Clone this repository.
3. Install dependencies by running `npm install`.
4. Install ts-node globally by running `npm install ts-node -g`.

## How to run

1. Run the script using the command `npm start`.
2. The script will get all characters from the Star Wars API, categorize them by gender, and sort them based on height.
3. The sorted characters will be output into a file named `output.json` under the root directory.

## Unit Test

1. To run unit test, run `npm run test`.

## Lint

1. typescript-eslint is setup for static code analysis. Run `npm run lint` to run the static code analysis

## Script Overview

- `getStarWarsCharacters()`: Function to get all characters from the Star Wars API using axios.
- `categorizeAndSortCharacters()`: Function to categorize characters based on gender and sort them accordingly.
- `sortCharacters()`: Function to sort characters based on height, with unknown heights sorted alphabetically by name.
- `main()`: The entry point of the script.

## Libraries used

- `axios`: A promise-based HTTP Client for node.js
- `winston`: A logging library
- `jest`: A JavaScript testing framework
- `axios-mock-adapter`: A library for mocking axios requests
- `eslint`: A static code analysis tool
- `husky`: A library for git hooks
