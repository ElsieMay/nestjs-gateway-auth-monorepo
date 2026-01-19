export default {
  displayName: 'gateway',
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: {
          module: 'commonjs',
          moduleResolution: 'node',
          esModuleInterop: true,
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
        },
      },
    ],
  },
  testMatch: ['<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/*.d.ts',
    '!<rootDir>/src/**/main.ts',
    '!<rootDir>/src/**/app.module.ts',
    '!<rootDir>/src/**/*.module.ts',
    '!<rootDir>/*.ts',
  ],
  coverageDirectory: '<rootDir>/coverage',
  moduleNameMapper: {
    '^@proj/core/(.*)$': '<rootDir>/../../lib/core/src/$1',
  },
};
