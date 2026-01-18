export default {
  displayName: 'gateway',
  preset: 'ts-jest',
  testEnvironment: 'node',
  testEnvironmentOptions: {},
  rootDir: '.',
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|js)$': 'ts-jest',
  },
  testMatch: ['<rootDir>/**/?(*.)+(spec|test).[jt]s?(x)'],
  collectCoverageFrom: ['<rootDir>/**/*.ts', '!<rootDir>/**/*.d.ts'],
  coverageDirectory: '../../../coverage/gateway',
  moduleNameMapper: {
    '^@proj/core/(.*)$': '<rootDir>/../../../lib/core/src/$1',
  },
};
