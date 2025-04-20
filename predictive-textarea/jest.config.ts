import type { Config } from 'jest'


const config: Config = {
  maxWorkers: '75%', // Use 75% of available CPU cores
  workerIdleMemoryLimit: '1024MB', // Prevent memory leaks in workers
  cache: true, // Enable caching
  cacheDirectory: '.jest-cache', // Specify cache location

  runner: 'jest-runner',
  fakeTimers: {
    enableGlobally: true,
    now: 1483228800000, // 2017-01-01
  },

  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/predictive-textarea/tests/jest.setup.ts'],
  moduleNameMapper: {
    '\\.css$': '<rootDir>/predictive-textarea/tests/__mocks__/styles-mock.ts',
    '^@/(.*)$': '<rootDir>/predictive-textarea/src/$1',
    '^quick-lru$': '<rootDir>/predictive-textarea/tests/__mocks__/quick-lru.ts'
  },
  roots: ['<rootDir>/predictive-textarea/src', '<rootDir>/predictive-textarea/tests'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  preset: 'ts-jest',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.jest.json',
      useESM: true
    }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@vercel/analytics))'
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '\\.d\\.ts$',
  ],
  collectCoverageFrom: [
    '<rootDir>/predictive-textarea/src/**/*.ts',
    '<rootDir>/predictive-textarea/src/**/*.tsx',
    '!<rootDir>/predictive-textarea/src/**/*.d.ts'
  ]
}

export default config
