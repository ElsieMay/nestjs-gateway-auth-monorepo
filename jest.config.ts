export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testEnvironmentOptions: {},
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testRegex: '.*\\.spec\\.ts$',
  projects: [
    '<rootDir>/apps/authentication/jest.config.ts',
    '<rootDir>/apps/gateway/src/jest.config.ts',
  ],
};
