export default {
  displayName: 'Modules',
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  modulePaths: [
    '<rootDir>',
  ],
  // Module Name settings required to make chalk work with jest
  moduleNameMapper: {
    '#(.*)': '<rootDir>/node_modules/$1',
    // 'lowdb': '<rootDir>/node_modules/lowdb/lib',
    // 'steno': '<rootDir>/node_modules/steno/lib',
  },
  transformIgnorePatterns: [
    'node_modules/(?!=chalk)/',
  ],
};
