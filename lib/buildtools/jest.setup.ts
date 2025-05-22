// Buildtools Jest setup
const mockChalkFunction = new Proxy((x: string) => x, {
  get: () => mockChalkFunction
});

jest.mock('chalk', () => new Proxy({}, {
  get: () => mockChalkFunction
}));

jest.mock('fs/promises', () => ({
  copyFile: jest.fn(() => Promise.resolve()),
  cp: jest.fn(() => Promise.resolve()),
  open: jest.fn(),
  mkdir: jest.fn(() => Promise.resolve()),
  writeFile: jest.fn(() => Promise.resolve()),
}));

global.process.exit = jest.fn(code => {
  throw new Error(`process.exit called with ${code}`);
});
