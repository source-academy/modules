/**
 * @module mark_sweep
 */

import { COMMAND, type CommandHeapObject, type MarkSweepGlobalState, type Memory, type MemoryHeaps, type Tag } from './types';

function getInitialState(): MarkSweepGlobalState {
  return {
    ROW: 10,
    COLUMN: 32,
    NODE_SIZE: 0,
    MEMORY_SIZE: -99,
    memory: [],
    // let memory: Memory;
    memoryHeaps: [],
    commandHeap: [],
    memoryMatrix: [],
    // let memoryMatrix: number[][];
    tags: [],
    typeTag: [],
    // let tags: Tag[];
    // let typeTag: string[];
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
export let globalState = getInitialState();

/**
 * Exported for testing
 * @hidden
 */
export function resetState() {
  globalState = getInitialState();
}

function generateMemory(): void {
  globalState.memoryMatrix = [];
  for (let i = 0; i < globalState.ROW; i += 1) {
    globalState.memory = [];
    for (let j = 0; j < globalState.COLUMN && i * globalState.COLUMN + j < globalState.MEMORY_SIZE; j += 1) {
      globalState.memory.push(i * globalState.COLUMN + j);
    }
    globalState.memoryMatrix.push(globalState.memory);
  }

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

function updateRoots(array: number[]): void {
  for (let i = 0; i < array.length; i += 1) {
    globalState.ROOTS.push(array[i]);
  }
}

function initialize_memory(
  memorySize: number,
  nodeSize: number,
  marked: number,
  unmarked: number
): void {
  globalState.MEMORY_SIZE = memorySize;
  globalState.NODE_SIZE = nodeSize;
  const excess = globalState.MEMORY_SIZE % globalState.NODE_SIZE;
  globalState.MEMORY_SIZE -= excess;
  globalState.ROW = Math.ceil(globalState.MEMORY_SIZE / globalState.COLUMN);
  globalState.MARKED = marked;
  globalState.UNMARKED = unmarked;
  generateMemory();
}

function initialize_tag(allTag: number[], types: string[]): void {
  globalState.tags = allTag;
  globalState.typeTag = types;
}

function allHeap(newHeap: number[][]): void {
  globalState.memoryHeaps = newHeap;
}

function updateFlip(): void {
  globalState.flips.push(globalState.commandHeap.length - 1);
}

function newCommand(
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
  for (let j = 0; j < heap.length; j += 1) {
    globalState.memory.push(heap[j]);
  }
  const newQueue: number[] = [];
  for (let j = 0; j < queue.length; j += 1) {
    newQueue.push(queue[j]);
  }

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

function newSweep(left: number, heap: Memory): void {
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

function newMark(left: number, heap: Memory, queue: number[]): void {
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

function addRoots(arr: number[]): void {
  for (let i = 0; i < arr.length; i += 1) {
    globalState.ROOTS.push(arr[i]);
  }
}

function showRoot(heap: Memory): void {
  const desc = 'All root nodes are marked';
  newCommand(COMMAND.SHOW_MARKED, -1, -1, 0, 0, heap, desc, '', '');
}

function showRoots(heap: Memory): void {
  for (let i = 0; i < globalState.ROOTS.length; i += 1) {
    showRoot(heap);
  }
  globalState.ROOTS = [];
}

function newUpdateSweep(right: number, heap: Memory): void {
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

function newPush(left: number, right: number, heap: Memory): void {
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

function newPop(res: any, left: number, right: number, heap: Memory): void {
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

function newAssign(res: any, left: number, heap: Memory): void {
  const newRes = res;
  const desc = `Assign memory [${left}] with ${newRes}.`;
  newCommand(COMMAND.ASSIGN, left, -1, 1, 1, heap, desc, 'assigned memory', '');
}

function newNew(left: number, heap: Memory): void {
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

function newGC(heap: Memory): void {
  const desc = 'Memory exhausted, start Mark and Sweep Algorithm';
  newCommand(COMMAND.START, -1, -1, 0, 0, heap, desc, '', '');
  updateFlip();
}

function endGC(heap: Memory): void {
  const desc = 'Result of free memory';
  newCommand(COMMAND.END, -1, -1, 0, 0, heap, desc, '', '');
  updateFlip();
}

function updateSlotSegment(
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

function get_memory_size(): number {
  return globalState.MEMORY_SIZE;
}

function get_tags(): Tag[] {
  return globalState.tags;
}

function get_command(): CommandHeapObject[] {
  return globalState.commandHeap;
}

function get_flips(): number[] {
  return globalState.flips;
}

function get_types(): string[] {
  return globalState.typeTag;
}

function get_memory_heap(): MemoryHeaps {
  return globalState.memoryHeaps;
}

function get_memory_matrix(): MemoryHeaps {
  return globalState.memoryMatrix;
}

function get_roots(): number[] {
  return globalState.ROOTS;
}

function get_slots(): number[] {
  return [
    globalState.TAG_SLOT,
    globalState.SIZE_SLOT,
    globalState.FIRST_CHILD_SLOT,
    globalState.LAST_CHILD_SLOT
  ];
}

function get_column_size(): number {
  return globalState.COLUMN;
}

function get_row_size(): number {
  return globalState.ROW;
}

function get_unmarked(): number {
  return globalState.UNMARKED;
}

function get_marked(): number {
  return globalState.MARKED;
}

function init() {
  return {
    toReplString: () => '<GC REDACTED>',
    get_memory_size,
    get_memory_heap,
    get_tags,
    get_types,
    get_column_size,
    get_row_size,
    get_memory_matrix,
    get_flips,
    get_slots,
    get_command,
    get_unmarked,
    get_marked,
    get_roots
  };
}

export {
  init,
  // initialisation
  initialize_memory,
  initialize_tag,
  generateMemory,
  allHeap,
  updateSlotSegment,
  newCommand,
  newMark,
  newPush,
  newPop,
  newAssign,
  newNew,
  newGC,
  newSweep,
  updateRoots,
  newUpdateSweep,
  showRoots,
  endGC,
  addRoots,
  showRoot
};
