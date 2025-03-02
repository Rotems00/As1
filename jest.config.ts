/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/controllers/**/*.{js,ts}",
    "src/routes/**/*.{js,ts}",
    "src/modules/**/*.{js,ts}",
  ],
  coverageDirectory: "./coverage",
  coverageReporters: ["text", "lcov"],
};
