module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: [
    '<rootDir>/setup-jest.ts',
  ],
  globalSetup: 'jest-preset-angular/global-setup',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1'
  },
  transform: {
    '^.+\\.(ts|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$'
      }
    ]
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment'
  ],
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/src/test.ts',
    '/src/polyfills.ts',
    '/src/.*\\.module\\.ts$',
    '/src/.*\\.routing\\.ts$',
    '/src/.*\\.spec\\.ts$'
  ],
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs']
}; 