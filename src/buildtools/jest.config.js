/**
 * @type {import('jest').Config}
 */
const jestConfig = {
  clearMocks: true,
  displayName: 'Build Tools',
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
  preset: 'ts-jest/presets/default-esm',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.test.ts',
  ],
};

export default jestConfig;
