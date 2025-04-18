/** @type {import('jest').Config} */
const config = {
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
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
  moduleNameMapper: {
    '\\.css$': '<rootDir>/tests/__mocks__/styles-mock.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^quick-lru$': '<rootDir>/tests/__mocks__/quick-lru.ts'
  },
  roots: ['<rootDir>/src', '<rootDir>/tests'],
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
    '<rootDir>/src/**/*.ts',
    '<rootDir>/src/**/*.tsx',
    '!<rootDir>/src/**/*.d.ts'
  ]
}

module.exports = config 
