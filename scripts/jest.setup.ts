const chalkFunction = new Proxy((x: string) => x, {
  get: () => chalkFunction
});

jest.mock('chalk', () => new Proxy({}, {
  get: () => chalkFunction
}));

jest.mock('fs/promises', () => ({
  copyFile: jest.fn(() => Promise.resolve()),
  mkdir: jest.fn(() => Promise.resolve()),
  open: jest.fn(),
  writeFile: jest.fn(() => Promise.resolve())
}));

jest.mock('./src/manifest', () => ({
  retrieveManifest: jest.fn(() => Promise.resolve({
    test0: {
      tabs: ['tab0']
    },
    test1: { tabs: [] },
    test2: {
      tabs: ['tab1']
    }
  }))
}));

global.process.exit = jest.fn(code => {
  throw new Error(`process.exit called with ${code}`);
});
