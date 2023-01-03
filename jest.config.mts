export default {
  roots: [
    "<rootDir>/src/bundles",
    "<rootDir>/src/tabs",
    "<rootDir>/src/scripts"
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