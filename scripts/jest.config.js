import { pathsToModuleNameMapper } from 'ts-jest'
import tsconfig from './tsconfig.json' assert { type: 'json' }

/**
 * @type {import('jest').Config}
 */
const jestConfig = {
  clearMocks: true,
  displayName: 'Scripts',
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, { prefix: "<rootDir>/" }),
  preset: 'ts-jest/presets/default-esm',
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.test.ts',
  ],
}

export default jestConfig