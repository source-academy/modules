import type { ProjectReference } from 'typescript';

export const initTypedoc = jest.fn(() => {
  const proj = {
    getChildByName: () => ({
      children: [],
    }),
    path: '',
  } as ProjectReference;

  return Promise.resolve({
    elapsed: 0,
    result: [{
      convert: jest.fn()
        .mockReturnValue(proj),
      generateDocs: jest.fn(() => Promise.resolve()),
    }, proj],
  });
});
