module.exports = {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: [
        './setupTests.js',
    ],
    moduleNameMapper: {
        '\\.css$': '<rootDir>/styleMock.js',
      }
};
