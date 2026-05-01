import { range } from 'es-toolkit';
import { beforeEach, describe, expect, it } from 'vitest';
import * as funcs from '..';
import { COMMAND } from '../types';

beforeEach(() => {
  funcs.resetState();
});

describe(funcs.initialize_memory, () => {
  it('works', () => {
    funcs.initialize_memory(35, 3, 1, 1);

    expect(funcs.globalState.MEMORY_SIZE).toEqual(33);
    expect(funcs.globalState.NODE_SIZE).toEqual(3);
    expect(funcs.globalState.ROW).toEqual(2);
    expect(funcs.globalState.MARKED).toEqual(1);
    expect(funcs.globalState.UNMARKED).toEqual(1);

    expect(funcs.globalState.memoryMatrix[0]).toEqual(range(0, 32));
    expect(funcs.globalState.memoryMatrix[1]).toEqual([32]);

    expect(funcs.globalState.commandHeap).toHaveLength(1);
    expect(funcs.globalState.commandHeap[0]).toMatchObject({
      type: COMMAND.INIT,
      heap: [],
      left: -1,
      right: -1,
      sizeLeft: 0,
      sizeRight: 0,
      desc: 'Memory initially empty.',
      leftDesc: '',
      rightDesc: '',
      queue: []
    });
  });
});

describe(funcs.updateRoots, () => {
  it('works', () => {
    funcs.globalState.ROOTS = [1,2,3];
    expect(funcs.updateRoots([4, 5, 6])).toBeUndefined();
    expect(funcs.globalState.ROOTS).toEqual([1,2,3,4,5,6]);
  });
});

describe(funcs.showRoots, () => {
  it('works', () => {
    funcs.globalState.ROOTS = [1,2,3];

    expect(funcs.showRoots([1, 2, 3])).toBeUndefined();

    // expect(funcs.showRoot).toHaveBeenCalledTimes(3);
    expect(funcs.globalState.commandHeap).toHaveLength(3);
    expect(funcs.globalState.ROOTS).toEqual([]);
  });
});
