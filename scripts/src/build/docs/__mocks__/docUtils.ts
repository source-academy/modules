import chalk from 'chalk';
import type { ProjectReference } from 'typescript';

import { divideAndRound } from '../../buildUtils.js';

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

export const logTypedocTime = (elapsed: number) => console.log(
  `${chalk.cyanBright('Took')} ${divideAndRound(elapsed, 1000, 2)}s ${chalk.cyanBright('to initialize typedoc')}`,
);
