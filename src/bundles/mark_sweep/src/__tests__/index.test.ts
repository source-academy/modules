import { range } from 'es-toolkit/math';
import { beforeEach, describe, expect, it } from 'vitest';
import * as funcs from '..';
import { COMMAND } from '../types';

beforeEach(() => {
  funcs.globalState.rowCount = 10;
  funcs.globalState.NODE_SIZE = 0;
  funcs.globalState.MEMORY_SIZE = -99;
  funcs.globalState.memory = [];
  funcs.globalState.memoryHeaps = [];
  funcs.globalState.commandHeap.splice(0, funcs.globalState.commandHeap.length);
  funcs.globalState.memoryMatrix = [];
  funcs.globalState.tags = [];
  funcs.globalState.typeTag = [];
  funcs.globalState.flips.splice(0, funcs.globalState.flips.length);
  funcs.globalState.TAG_SLOT = 0;
  funcs.globalState.SIZE_SLOT = 1;
  funcs.globalState.FIRST_CHILD_SLOT = 2;
  funcs.globalState.LAST_CHILD_SLOT = 3;
  funcs.globalState.MARKED = 1;
  funcs.globalState.UNMARKED = 0;
  funcs.globalState.ROOTS = [];
});

describe(funcs.addRoots, () => {
  it('works', () => {
    expect(funcs.addRoots([1, 2, 3])).toBeUndefined();
    expect(funcs.globalState.ROOTS).toEqual([1, 2, 3]);
  });
});

describe(funcs.initialize_memory, () => {
  it('works memory size is exact multiple of columns', () => {
    funcs.initialize_memory(128, 4, 1, 1);

    expect(funcs.globalState.MEMORY_SIZE).toEqual(128);
    expect(funcs.globalState.NODE_SIZE).toEqual(4);
    expect(funcs.globalState.rowCount).toEqual(4);
    expect(funcs.globalState.MARKED).toEqual(1);
    expect(funcs.globalState.UNMARKED).toEqual(1);

    expect(funcs.globalState.memoryMatrix[0]).toEqual(range(32));
    expect(funcs.globalState.memoryMatrix[1]).toEqual(range(32, 64));
    expect(funcs.globalState.memoryMatrix[2]).toEqual(range(64, 96));
    expect(funcs.globalState.memoryMatrix[3]).toEqual(range(96, 128));
  });

  it('works when memory size is not exact multiple of columns', () => {
    funcs.initialize_memory(120, 3, 1, 1);

    expect(funcs.globalState.MEMORY_SIZE).toEqual(120);
    expect(funcs.globalState.NODE_SIZE).toEqual(3);
    expect(funcs.globalState.rowCount).toEqual(4);
    expect(funcs.globalState.MARKED).toEqual(1);
    expect(funcs.globalState.UNMARKED).toEqual(1);

    expect(funcs.globalState.memoryMatrix[0]).toEqual(range(32));
    expect(funcs.globalState.memoryMatrix[1]).toEqual(range(32, 64));
    expect(funcs.globalState.memoryMatrix[2]).toEqual(range(64, 96));
    expect(funcs.globalState.memoryMatrix[3]).toEqual(range(96, 120));

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

describe(funcs.newGC, () => {
  it('works', () => {
    funcs.globalState.flips.push(1);
    expect(funcs.newGC([1, 2, 3])).toBeUndefined();
    expect(funcs.globalState.flips).toEqual([1, 0]);
    expect(funcs.globalState.commandHeap).toHaveLength(1);
    expect(funcs.globalState.commandHeap[0]).toMatchObject({
      type: COMMAND.START,
      left: -1,
      right: -1,
      sizeLeft: 0,
      sizeRight: 0,
      heap: [1, 2, 3],
      desc: 'Memory exhausted, start Mark and Sweep Algorithm',
      leftDesc: '',
      rightDesc: '',
      queue: []
    });
  });
});

describe(funcs.showRoots, () => {
  it('works', () => {
    funcs.addRoots([1, 2, 3]);
    expect(funcs.showRoots([1, 2, 3])).toBeUndefined();

    expect(funcs.globalState.commandHeap).toHaveLength(3);
    expect(funcs.globalState.ROOTS).toEqual([]);
  });
});

describe(funcs.updateRoots, () => {
  it('works', () => {
    funcs.globalState.ROOTS = [1, 2, 3];
    expect(funcs.updateRoots([4, 5, 6])).toBeUndefined();
    expect(funcs.globalState.ROOTS).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
