// @ts-check

/**
 * Buildtools Jest configuration
 * @type {import('jest').Config}
 */
const jestConfig = {
  clearMocks: true,
  displayName: 'Build Tools',
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
  transform: {
    '.ts': ['ts-jest', {
      useESM: true,
    }]
  },
  transformIgnorePatterns: [
    '/node_modules/(?!typedoc/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.test.ts',
  ],
};

export default jestConfig;
