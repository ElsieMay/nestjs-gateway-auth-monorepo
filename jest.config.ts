export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testEnvironmentOptions: {},
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.spec.ts',
    '!**/*.test.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/coverage/**',
    '!**/*.module.ts',
    '!**/main.ts',
    '!**/jest.config.ts',
  ],
  coverageDirectory: './coverage',
  testRegex: '.*\\.spec\\.ts$',
  projects: [
    '<rootDir>/apps/authentication/jest.config.ts',
    '<rootDir>/apps/gateway/jest.config.ts',
  ],
};
