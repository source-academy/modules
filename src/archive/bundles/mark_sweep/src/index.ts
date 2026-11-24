/**
 * @module mark_sweep
 */

import { chunk, clone, range } from 'es-toolkit';
import context from 'js-slang/context';
import { COMMAND, type CommandHeapObject, type MarkSweepGlobalState, type Memory } from './types';

function getInitialState(): MarkSweepGlobalState {
  return {
    rowCount: 10,
    columnCount: 32,
    NODE_SIZE: 0,
    MEMORY_SIZE: -99,
    memory: [],
    memoryHeaps: [],
    commandHeap: [],
    memoryMatrix: [],
    tags: [],
    typeTag: [],
    flips: [],
    TAG_SLOT: 0,
    SIZE_SLOT: 1,
    FIRST_CHILD_SLOT: 2,
    LAST_CHILD_SLOT: 3,
    MARKED: 1,
    UNMARKED: 0,
    ROOTS: [],
  };
}

/**
 * Exported for testing
 * @hidden
 */
export const globalState = getInitialState();

export function generateMemory(): void {
  globalState.memoryMatrix = chunk(
    range(globalState.MEMORY_SIZE),
    globalState.columnCount
  );

  newCommand(
    COMMAND.INIT,
    -1,
    -1,
    0,
    0,
    [],
    'Memory initially empty.',
    '',
    '',
    []
  );
}

export function updateRoots(array: number[]): void {
  globalState.ROOTS.push(...array);
}

export function initialize_memory(
  memorySize: number,
  nodeSize: number,
  marked: number,
  unmarked: number
): void {
  context.moduleContexts.mark_sweep.state = globalState;

  globalState.MEMORY_SIZE = memorySize;
  globalState.NODE_SIZE = nodeSize;
  const excess = globalState.MEMORY_SIZE % globalState.NODE_SIZE;
  globalState.MEMORY_SIZE -= excess;
  globalState.rowCount = Math.ceil(globalState.MEMORY_SIZE / globalState.columnCount);
  globalState.MARKED = marked;
  globalState.UNMARKED = unmarked;
  generateMemory();
}

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

export function newCommand(
  type: COMMAND,
  left: number,
  right: number,
  sizeLeft: number,
  sizeRight: number,
  heap: Memory,
  description: string,
  firstDesc: string,
  lastDesc: string,
  queue: number[] = []
): void {
  globalState.memory = [];
  globalState.memory.push(...heap);
  const newQueue = clone(queue);

  const obj: CommandHeapObject = {
    type,
    heap: globalState.memory,
    left,
    right,
    sizeLeft,
    sizeRight,
    desc: description,
    leftDesc: firstDesc,
    rightDesc: lastDesc,
    queue: newQueue
  };

  globalState.commandHeap.push(obj);
}

export function newSweep(left: number, heap: Memory): void {
  const newSizeLeft = globalState.NODE_SIZE;
  const desc = `Freeing node ${left}`;
  newCommand(
    COMMAND.SWEEP,
    left,
    -1,
    newSizeLeft,
    0,
    heap,
    desc,
    'freed node',
    ''
  );
}

export function newMark(left: number, heap: Memory, queue: number[]): void {
  const newSizeLeft = globalState.NODE_SIZE;
  const desc = `Marking node ${left} to be live memory`;
  newCommand(
    COMMAND.MARK,
    left,
    -1,
    newSizeLeft,
    0,
    heap,
    desc,
    'marked node',
    '',
    queue
  );
}

export function addRoots(arr: number[]): void {
  globalState.ROOTS.push(...arr);
}

export function showRoot(heap: Memory): void {
  const desc = 'All root nodes are marked';
  newCommand(COMMAND.SHOW_MARKED, -1, -1, 0, 0, heap, desc, '', '');
}

export function showRoots(heap: Memory): void {
  for (let i = 0; i < globalState.ROOTS.length; i += 1) {
    showRoot(heap);
  }
  globalState.ROOTS = [];
}

export function newUpdateSweep(right: number, heap: Memory): void {
  const desc = `Set node ${right} to freelist`;
  newCommand(
    COMMAND.RESET,
    -1,
    right,
    0,
    globalState.NODE_SIZE,
    heap,
    desc,
    'free node',
    ''
  );
}

export function newPush(left: number, right: number, heap: Memory): void {
  const desc = `Push OS update memory ${left} and ${right}.`;
  newCommand(
    COMMAND.PUSH,
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

export function newPop(res: any, left: number, right: number, heap: Memory): void {
  const newRes = res;
  const desc = `Pop OS from memory ${left}, with value ${newRes}.`;
  newCommand(
    COMMAND.POP,
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

export function newAssign(res: any, left: number, heap: Memory): void {
  const newRes = res;
  const desc = `Assign memory [${left}] with ${newRes}.`;
  newCommand(COMMAND.ASSIGN, left, -1, 1, 1, heap, desc, 'assigned memory', '');
}

export function newNew(left: number, heap: Memory): void {
  const newSizeLeft = globalState.NODE_SIZE;
  const desc = `New node starts in [${left}].`;
  newCommand(
    COMMAND.NEW,
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

export function newGC(heap: Memory): void {
  const desc = 'Memory exhausted, start Mark and Sweep Algorithm';
  newCommand(COMMAND.START, -1, -1, 0, 0, heap, desc, '', '');
  updateFlip();
}

export function endGC(heap: Memory): void {
  const desc = 'Result of free memory';
  newCommand(COMMAND.END, -1, -1, 0, 0, heap, desc, '', '');
  updateFlip();
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
