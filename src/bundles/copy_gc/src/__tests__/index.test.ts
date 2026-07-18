import { range } from 'es-toolkit';
import { beforeEach, describe, expect, it } from 'vitest';
import * as funcs from '..';
import { COMMAND } from '../types';

beforeEach(() => {
  funcs.globalState.ROW = 10;
  funcs.globalState.MEMORY_SIZE = -99;
  funcs.globalState.TO_SPACE = -1;
  funcs.globalState.FROM_SPACE = -1;
  funcs.globalState.memory = [];
  funcs.globalState.memoryHeaps = [];
  funcs.globalState.commandHeap.splice(0, funcs.globalState.commandHeap.length);
  funcs.globalState.toMemoryMatrix = [];
  funcs.globalState.fromMemoryMatrix = [];
  funcs.globalState.tags = [];
  funcs.globalState.typeTag = [];
  funcs.globalState.flips.splice(0, funcs.globalState.flips.length);
  funcs.globalState.TAG_SLOT = 0;
  funcs.globalState.SIZE_SLOT = 1;
  funcs.globalState.FIRST_CHILD_SLOT = 2;
  funcs.globalState.LAST_CHILD_SLOT = 3;
  funcs.globalState.ROOTS = [];
});

describe(funcs.initialize_memory, () => {
  it('works when memory size is a multiple of column size', () => {
    expect(funcs.initialize_memory(128)).toBeUndefined();

    expect(funcs.globalState.MEMORY_SIZE).toEqual(128);
    expect(funcs.globalState.ROW).toEqual(4);
    expect(funcs.globalState.TO_SPACE).toEqual(0);
    expect(funcs.globalState.FROM_SPACE).toEqual(64);

    expect(funcs.globalState.toMemoryMatrix[0]).toEqual(range(0, 32));
    expect(funcs.globalState.toMemoryMatrix[1]).toEqual(range(32, 64));

    expect(funcs.globalState.fromMemoryMatrix[0]).toEqual(range(64, 96));
    expect(funcs.globalState.fromMemoryMatrix[1]).toEqual(range(96, 128));

    expect(funcs.globalState.commandHeap).toHaveLength(1);
    expect(funcs.globalState.commandHeap[0]).toMatchObject({
      type: COMMAND.INIT,
      to: 0,
      from: 64,
      heap: [],
      left: -1,
      right: -1,
      sizeLeft: 0,
      sizeRight: 0,
      desc: 'Memory initially empty.',
      leftDesc: '',
      rightDesc: '',
      scan: -1,
      free: -1
    });
  });

  it('works when memory size is a not multiple of column size', () => {
    expect(funcs.initialize_memory(91)).toBeUndefined();

    expect(funcs.globalState.MEMORY_SIZE).toEqual(92);
    expect(funcs.globalState.ROW).toEqual(3);
    expect(funcs.globalState.TO_SPACE).toEqual(0);
    expect(funcs.globalState.FROM_SPACE).toEqual(46);

    expect(funcs.globalState.toMemoryMatrix[0]).toEqual(range(0, 32));
    expect(funcs.globalState.toMemoryMatrix[1]).toEqual(range(32, 46));

    expect(funcs.globalState.fromMemoryMatrix[0]).toEqual(range(46, 78));
    expect(funcs.globalState.fromMemoryMatrix[1]).toEqual(range(78, 92));

    expect(funcs.globalState.commandHeap).toHaveLength(1);
    expect(funcs.globalState.commandHeap[0]).toMatchObject({
      type: COMMAND.INIT,
      to: 0,
      from: 46,
      heap: [],
      left: -1,
      right: -1,
      sizeLeft: 0,
      sizeRight: 0,
      desc: 'Memory initially empty.',
      leftDesc: '',
      rightDesc: '',
      scan: -1,
      free: -1
    });
  });
});

describe(funcs.resetSpace, () => {
  it('resets the to space properly', () => {
    funcs.initialize_memory(50);
    const testHeap = range(50);

    const newHeap = funcs.resetSpace('to', testHeap);
    expect(newHeap).toHaveLength(50);
    expect(funcs.globalState.FROM_SPACE).toEqual(25);

    for (let i = 0; i < 25; i++) {
      expect(newHeap[i]).toEqual(i);
    }

    for (let i = 25; i < 50; i++) {
      expect(newHeap[i]).toEqual(0);
    }
  });

  it('resets the from space properly', () => {
    funcs.initialize_memory(50);
    const testHeap = range(50);

    const newHeap = funcs.resetSpace('from', testHeap);
    expect(newHeap).toHaveLength(50);
    expect(funcs.globalState.FROM_SPACE).toEqual(25);

    for (let i = 0; i < 25; i++) {
      expect(newHeap[i]).toEqual(0);
    }

    for (let i = 25; i < 50; i++) {
      expect(newHeap[i]).toEqual(i);
    }
  });

  it('throws if the provided heap isn\'t the correct size', () => {
    funcs.initialize_memory(50);
    const testHeap = range(10);

    expect(() => funcs.resetSpace('to', testHeap))
      .toThrow('resetSpace: Provided heap was of size 10, required size 50');
  });
});
