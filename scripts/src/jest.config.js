import presets from 'ts-jest/presets/index.js';

/* For some reason, using the preset and giving the tsconfig as a config option
 * doesn't work, hence the very complicated code here for configuring jest
 */
const preset = presets.jsWithTsESM;
const [[transformKey, [, transforms]]] = Object.entries(preset.transform);

/**
 * @type {import('jest').config}
 */
export default {
  clearMocks: true,
  displayName: 'Scripts',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  rootDir: '../../',
  modulePaths: [
    '<rootDir>/scripts/src',
  ],
  moduleDirectories: [
    '<rootDir>/node_modules',
    '<rootDir>/scripts/src',
  ],
  transform: {
    [transformKey]: ['ts-jest', {
      ...transforms,
      // tsconfig: '<rootDir>/scripts/src/tsconfig.json',
      tsconfig: {
        allowSyntheticDefaultImports: true,
        allowJs: true,
        esModuleInterop: true,
        module: 'es2022',
        moduleResolution: 'node',
        resolveJsonModule: true,
        target: 'es2022',
      },
    }],
  },
  // Module Name settings required to make chalk work with jest
  moduleNameMapper: {
    'chalk': '<rootDir>/scripts/src/__mocks__/chalk.cjs',
    '(.+)\\.js': '$1',
  },
  testMatch: [
    '<rootDir>/scripts/src/**/__tests__/**/*.test.ts',
  ],
  setupFilesAfterEnv: ["<rootDir>/scripts/src/jest.setup.ts"]
};
