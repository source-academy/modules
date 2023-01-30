// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const retrieveManifest = jest.fn((_manifest: string) => Promise.resolve({
  test0: {
    tabs: ['tab0'],
  },
  test1: { tabs: [] },
  test2: {
    tabs: ['tab1'],
  },
}));
