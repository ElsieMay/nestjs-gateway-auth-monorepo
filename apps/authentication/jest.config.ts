export default {
  displayName: 'authentication',
  preset: 'ts-jest',
  testEnvironment: 'node',
  testEnvironmentOptions: {},
  rootDir: '.',
  transform: {
    '^.+\\.(ts|js)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/**/*.d.ts'],
  coverageDirectory: '<rootDir>/coverage',
  moduleNameMapper: {
    '^@proj/core/(.*)$': '<rootDir>/../../lib/core/src/$1',
  },
};
