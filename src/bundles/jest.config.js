// Jest Config for bundles

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  displayName: 'Bundles',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts'],
  preset: 'ts-jest/presets/default-esm',
  moduleNameMapper: {
    '^js-slang/context': '<rootDir>/__mocks__/context.ts',
    '^three.+.js': '<rootDir>/__mocks__/emptyModule.ts',
  },
  setupFiles: [
    './jest.polyfills.js'
  ],
  testMatch: [
    '<rootDir>/**/__tests__/**/*.ts'
  ]
};
