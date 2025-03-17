module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ['**/e2e/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  setupFilesAfterEnv: ['./jest.setup.ts'],
  globalSetup: './jest.global-setup.ts',
  globalTeardown: './jest.global-teardown.ts',
  testEnvironment: 'node',
  testTimeout: 30000,
}; 