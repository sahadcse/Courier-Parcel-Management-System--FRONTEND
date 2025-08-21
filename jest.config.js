// jest.config.js
module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jest-environment-jsdom', // Explicitly specify jsdom
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Setup file for Jest DOM
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Map @/ to src/ for imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS imports
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json', // Reference tsconfig for JSX settings
    //   useESM: false, // Ensure CommonJS for compatibility
    }],
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.test.{ts,tsx}'],
};