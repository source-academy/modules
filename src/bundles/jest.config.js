/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  displayName: 'Bundles',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: [".ts"],
  preset: 'ts-jest/presets/default-esm',
  // transform: {
  //   '.ts': ['ts-jest', {
  //     useESM: true,
  //     /**
  //      * ts-jest preset currently has an issue with the 'verbatimModuleSyntax' typescript option:
  //      * This whole transform bit should be removed once this is resolved:
  //      * https://github.com/kulshekhar/ts-jest/issues/4081
  //      */
  //     isolatedModules: true
  //   }]
  // },
  moduleNameMapper: {
    '#(.*)': '<rootDir>/node_modules/$1',
    '^js-slang/context': '<rootDir>/__mocks__/context.ts',
    '^three.+.js': '<rootDir>/__mocks__/emptyModule.ts',
  },
  transformIgnorePatterns: [
    'node_modules/(?!=chalk)/',
    '.+\\.js'
  ],
  setupFiles: [
    './jest.polyfills.js'
  ]
};
