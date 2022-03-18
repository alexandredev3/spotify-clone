const defaultConfig = {
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageReporters: ["text", "lcov"],
  coverageThreshold: {
    global: {
      branch: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  maxWorkers: "50%",
  watchPathIgnorePatterns: ["node_modules"],

  // transformPatterns: transform mjs into js
  // in this case the node modules will be ignore.
  transformIgnorePatterns: ["node_modules"],
};

export default {
  projects: [
    // Server tests config.
    {
      ...defaultConfig,
      testEnvironment: "node",
      displayName: "backend",

      // coverage directories
      collectCoverageFrom: [
        "server/",
        "!server/index.js", // ignoring index.js
      ],
      transformIgnorePatterns: [
        ...defaultConfig.transformIgnorePatterns,
        "public",
      ],
      testMatch: ["**/tests/**/server/**/*.test.js"],
    },

    // Frontend tests config.
    {
      ...defaultConfig,
      testEnvironment: "jsdom",
      displayName: "frontend",

      // coverage directories
      collectCoverageFrom: ["public/"],
      transformIgnorePatterns: [
        ...defaultConfig.transformIgnorePatterns,
        "server",
      ],
      testMatch: ["**/tests/**/public/**/*.test.js"],
    },
  ],
};
