export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/packages'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'packages/*/src/**/*.{ts,tsx}',
    '!packages/*/src/**/*.d.ts',
    '!packages/*/src/index.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  moduleNameMapper: {
    '^@rhuds/core$': '<rootDir>/packages/core/src',
    '^@rhuds/hooks$': '<rootDir>/packages/hooks/src',
    '^@rhuds/utils$': '<rootDir>/packages/utils/src',
    '^@rhuds/sfx$': '<rootDir>/packages/sfx/src'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
}
