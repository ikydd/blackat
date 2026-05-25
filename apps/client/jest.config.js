export default {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./setupTests.js"],
  moduleNameMapper: {
    "\\.css$": "<rootDir>/styleMock.js",
  },
};
