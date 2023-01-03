export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: [
    "<rootDir>/src",
    "<rootDir>/scripts/src"
  ],
  modulePaths:[
    '<rootDir>',
  ],
  // Module Name settings required to make chalk work with jest
  moduleNameMapper: {
    "#(.*)": "<rootDir>/node_modules/$1",
    "lowdb": "<rootDir>/node_modules/lowdb/lib",
    "steno": "<rootDir>/node_modules/steno/lib",
  },
  transformIgnorePatterns: [
    'node_modules/(?!=chalk)/'
  ],
}