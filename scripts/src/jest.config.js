import presets from 'ts-jest/presets/index.js';

const preset = presets.jsWithTsESM;
const [[transformKey, [, transforms]]] = Object.entries(preset.transform);

/**
 * @type {import('jest').config}
 */
export default {
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
    'chalk': '<rootDir>/scripts/src/__mocks__/chalk.js',
    '(.+)\\.js': '$1',
  },
  testMatch: [
    '<rootDir>/scripts/src/**/__tests__/**/*.test.ts',
  ],
};
