jest.mock('fs/promises', () => ({
  copyFile: jest.fn(() => Promise.resolve()),
  mkdir: jest.fn(() => Promise.resolve()),
  stat: jest.fn().mockResolvedValue({ size: 10 }),
  writeFile: jest.fn(() => Promise.resolve()),
}));

jest.mock('./scriptUtils', () => ({
  ...jest.requireActual('./scriptUtils'),
  retrieveManifest: jest.fn(() => Promise.resolve({
    test0: {
      tabs: ['tab0'],
    },
    test1: { tabs: [] },
    test2: {
      tabs: ['tab1'],
    },
  })),
}));

jest.mock('./build/docs/docUtils');

jest.spyOn(process, 'exit').mockImplementation(code => {
  throw new Error(`process.exit called with ${code}`)
});
