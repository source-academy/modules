/**
 * @module copy_gc
 */

import { GeneralRuntimeError } from '@sourceacademy/modules-lib/errors';
import { chunk, clone, last, range } from 'es-toolkit';
import context from 'js-slang/context';
import { COMMAND, type CommandHeapObject, type CopyGCGlobalState } from './types';

function getInitialState(): CopyGCGlobalState {
  // Global Variables
  return {
    ROW: 10,
    COLUMN: 32,
    MEMORY_SIZE: -99,
    TO_SPACE: -1,
    FROM_SPACE: -1,
    memory: [],
    memoryHeaps: [],
    commandHeap: [],
    toMemoryMatrix: [],
    fromMemoryMatrix: [],
    tags: [],
    typeTag: [],
    flips: [],
    TAG_SLOT: 0,
    SIZE_SLOT: 1,
    FIRST_CHILD_SLOT: 2,
    LAST_CHILD_SLOT: 3,
    ROOTS: [],
  };
}

/**
 * Exported for testing
 * @hidden
 */
export const globalState = getInitialState();

export function initialize_tag(allTag: number[], types: string[]): void {
  globalState.tags = allTag;
  globalState.typeTag = types;
}

export function allHeap(newHeap: number[][]): void {
  globalState.memoryHeaps = newHeap;
}

function updateFlip(): void {
  globalState.flips.push(globalState.commandHeap.length - 1);
}

export function generateMemory(): void {
  const rawToMemory = range(globalState.FROM_SPACE);
  const rawFromMemory = range(globalState.FROM_SPACE, globalState.MEMORY_SIZE);

  globalState.toMemoryMatrix = chunk(rawToMemory, globalState.COLUMN);
  globalState.fromMemoryMatrix = chunk(rawFromMemory, globalState.COLUMN);

  const obj: CommandHeapObject = {
    type: COMMAND.INIT,
    to: globalState.TO_SPACE,
    from: globalState.FROM_SPACE,
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
  };

  globalState.commandHeap.push(obj);
}

export function resetSpace(space: 'to' | 'from', heap: number[]): number[] {
  if (heap.length !== globalState.MEMORY_SIZE) {
    throw new GeneralRuntimeError(`${resetSpace.name}: Provided heap was of size ${heap.length}, required size ${globalState.MEMORY_SIZE}`);
  }

  const newHeap: number[] = [];
  if (space === 'to') {
    for (let i = 0; i < globalState.FROM_SPACE; i += 1) {
      newHeap.push(heap[i]);
    }
    for (let i = globalState.FROM_SPACE; i < globalState.MEMORY_SIZE; i += 1) {
      newHeap.push(0);
    }
  } else {
    // to space between 0...M/2
    for (let i = 0; i < globalState.FROM_SPACE; i += 1) {
      newHeap.push(0);
    }
    for (let i = globalState.FROM_SPACE; i < globalState.MEMORY_SIZE; i += 1) {
      newHeap.push(heap[i]);
    }
  }
  return newHeap;
}

export function initialize_memory(memorySize: number): void {
  // Round up to the nearest even number
  if (memorySize % 2 !== 0) memorySize++;

  globalState.MEMORY_SIZE = memorySize;
  globalState.ROW = Math.ceil(globalState.MEMORY_SIZE / globalState.COLUMN);
  globalState.TO_SPACE = 0;
  globalState.FROM_SPACE = globalState.MEMORY_SIZE / 2;

  context.moduleContexts.copy_gc.state = globalState;

  generateMemory();
}

export function newCommand(
  type: string,
  toSpace: number,
  fromSpace: number,
  left: number,
  right: number,
  sizeLeft: number,
  sizeRight: number,
  heap: number[],
  description: string,
  firstDesc: string,
  lastDesc: string
): void {
  globalState.memory = [];
  globalState.memory.push(...heap);

  const obj: CommandHeapObject = {
    type,
    to: toSpace,
    from: fromSpace,
    heap: globalState.memory,
    left,
    right,
    sizeLeft,
    sizeRight,
    desc: description,
    leftDesc: firstDesc,
    rightDesc: lastDesc,
    scan: -1,
    free: -1
  };

  globalState.commandHeap.push(obj);
}

export function newCopy(left: number, right: number, heap: number[]): void {
  const { from: fromSpace, to: toSpace } = last(globalState.commandHeap)!;
  const newSizeLeft = heap[left + globalState.SIZE_SLOT];
  const newSizeRight = heap[right + globalState.SIZE_SLOT];
  const desc = `Copying node ${left} to ${right}`;
  newCommand(
    COMMAND.COPY,
    toSpace,
    fromSpace,
    left,
    right,
    newSizeLeft,
    newSizeRight,
    heap,
    desc,
    'index',
    'free'
  );
}

export function endFlip(left: number, heap: number[]): void {
  const { from: fromSpace, to: toSpace } = last(globalState.commandHeap)!;
  const newSizeLeft = heap[left + globalState.SIZE_SLOT];
  const desc = 'Flip finished';
  newCommand(
    COMMAND.FLIP,
    toSpace,
    fromSpace,
    left,
    -1,
    newSizeLeft,
    0,
    heap,
    desc,
    'free',
    ''
  );
  updateFlip();
}

export function updateRoots(array: number[]): void {
  globalState.ROOTS.push(...array);
}

export function resetRoots(): void {
  globalState.ROOTS = [];
}

export function startFlip(toSpace: number, fromSpace: number, heap: number[]): void {
  const desc = 'Memory is exhausted. Start stop and copy garbage collector.';
  newCommand(
    'Start of Cheneys',
    toSpace,
    fromSpace,
    -1,
    -1,
    0,
    0,
    heap,
    desc,
    '',
    ''
  );
  updateFlip();
}

export function newPush(left: number, right: number, heap: number[]): void {
  const { from: fromSpace, to: toSpace } = last(globalState.commandHeap)!;
  const desc = `Push OS update memory ${left} and ${right}.`;
  newCommand(
    COMMAND.PUSH,
    toSpace,
    fromSpace,
    left,
    right,
    1,
    1,
    heap,
    desc,
    'last child address slot',
    'new child pushed'
  );
}

export function newPop(res: any, left: number, right: number, heap: number[]): void {
  const { from: fromSpace, to: toSpace } = last(globalState.commandHeap)!;
  const newRes = res;
  const desc = `Pop OS from memory ${left}, with value ${newRes}.`;
  newCommand(
    COMMAND.POP,
    toSpace,
    fromSpace,
    left,
    right,
    1,
    1,
    heap,
    desc,
    'popped memory',
    'last child address slot'
  );
}

export function doneShowRoot(heap: number[]): void {
  const toSpace = 0;
  const fromSpace = 0;
  const desc = 'All root nodes are copied';
  newCommand(
    'Copied Roots',
    toSpace,
    fromSpace,
    -1,
    -1,
    0,
    0,
    heap,
    desc,
    '',
    ''
  );
}

export function showRoots(left: number, heap: number[]): void {
  const { from: fromSpace, to: toSpace } = last(globalState.commandHeap)!;
  const newSizeLeft = heap[left + globalState.SIZE_SLOT];
  const desc = `Roots: node ${left}`;
  newCommand(
    'Showing Roots',
    toSpace,
    fromSpace,
    left,
    -1,
    newSizeLeft,
    0,
    heap,
    desc,
    'roots',
    ''
  );
}

export function newAssign(res: any, left: number, heap: number[]): void {
  const { from: fromSpace, to: toSpace } = last(globalState.commandHeap)!;
  const newRes = res;
  const desc = `Assign memory [${left}] with ${newRes}.`;
  newCommand(
    COMMAND.ASSIGN,
    toSpace,
    fromSpace,
    left,
    -1,
    1,
    1,
    heap,
    desc,
    'assigned memory',
    ''
  );
}

export function newNew(left: number, heap: number[]): void {
  const { from: fromSpace, to: toSpace } = last(globalState.commandHeap)!;
  const newSizeLeft = heap[left + globalState.SIZE_SLOT];
  const desc = `New node starts in [${left}].`;
  newCommand(
    COMMAND.NEW,
    toSpace,
    fromSpace,
    left,
    -1,
    newSizeLeft,
    0,
    heap,
    desc,
    'new memory allocated',
    ''
  );
}

export function scanFlip(left: number, right: number, scan: number, free: number, heap: number[]): void {
  const { from: fromSpace, to: toSpace } = last(globalState.commandHeap)!;
  globalState.memory = clone(heap);

  let newDesc = `Scanning node at ${left} for children node ${scan} and ${free}`;
  if (scan) {
    if (free) {
      newDesc = `Scanning node at ${left} for children node ${scan} and ${free}`;
    } else {
      newDesc = `Scanning node at ${left} for children node ${scan}`;
    }
  } else if (free) {
    newDesc = `Scanning node at ${left} for children node ${free}`;
  }

  const obj: CommandHeapObject = {
    type: COMMAND.SCAN,
    to: toSpace,
    from: fromSpace,
    heap: globalState.memory,
    left,
    right,
    sizeLeft: 1,
    sizeRight: 1,
    scan,
    free,
    desc: newDesc,
    leftDesc: 'scan',
    rightDesc: 'free'
  };

  globalState.commandHeap.push(obj);
}

export function updateSlotSegment(
  tag: number,
  size: number,
  first: number,
  last: number
): void {
  if (tag >= 0) {
    globalState.TAG_SLOT = tag;
  }
  if (size >= 0) {
    globalState.SIZE_SLOT = size;
  }
  if (first >= 0) {
    globalState.FIRST_CHILD_SLOT = first;
  }
  if (last >= 0) {
    globalState.LAST_CHILD_SLOT = last;
  }
}
