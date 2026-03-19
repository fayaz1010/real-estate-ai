/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          module: "commonjs",
          esModuleInterop: true,
          strict: false,
          noImplicitAny: false,
          strictNullChecks: false,
          baseUrl: ".",
          paths: { "@/*": ["./backend/src/*"] },
        },
        diagnostics: false,
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/backend/src/$1",
    "^stripe$": "<rootDir>/backend/node_modules/stripe",
  },
  testMatch: ["<rootDir>/tests/integration/**/*.test.{ts,tsx}"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  modulePaths: ["<rootDir>/backend/node_modules", "<rootDir>/node_modules"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  collectCoverageFrom: [
    "backend/src/modules/auth/**/*.ts",
    "backend/src/modules/payments/**/*.ts",
    "backend/src/modules/applications/**/*.ts",
    "!backend/src/**/*.d.ts",
  ],
  clearMocks: true,
};
