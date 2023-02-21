import { type MemoryHeaps, type Memory, type Tag, COMMAND, type CommandHeapObject } from './types';

// Global Variables
let ROW: number = 10;
const COLUMN: number = 32;
let NODE_SIZE: number = 0;
let MEMORY_SIZE: number = -99;
let memory: Memory;
let memoryHeaps: Memory[] = [];
const commandHeap: CommandHeapObject[] = [];
let memoryMatrix: number[][];
let tags: Tag[];
let typeTag: string[];
const flips: number[] = [];
let TAG_SLOT: number = 0;
let SIZE_SLOT: number = 1;
let FIRST_CHILD_SLOT: number = 2;
let LAST_CHILD_SLOT: number = 3;
let MARKED: number = 1;
let UNMARKED: number = 0;
let ROOTS: number[] = [];

function generateMemory(): void {
  memoryMatrix = [];
  for (let i = 0; i < ROW; i += 1) {
    memory = [];
    for (let j = 0; j < COLUMN && i * COLUMN + j < MEMORY_SIZE; j += 1) {
      memory.push(i * COLUMN + j);
    }
    memoryMatrix.push(memory);
  }

  const obj: CommandHeapObject = {
    type: COMMAND.INIT,
    heap: [],
    left: -1,
    right: -1,
    sizeLeft: 0,
    sizeRight: 0,
    desc: 'Memory initially empty.',
    leftDesc: '',
    rightDesc: '',
    queue: [],
  };

  commandHeap.push(obj);
}

function updateRoots(array): void {
  for (let i = 0; i < array.length; i += 1) {
    ROOTS.push(array[i]);
  }
}

function initialize_memory(
  memorySize: number,
  nodeSize,
  marked,
  unmarked,
): void {
  MEMORY_SIZE = memorySize;
  NODE_SIZE = nodeSize;
  const excess = MEMORY_SIZE % NODE_SIZE;
  MEMORY_SIZE -= excess;
  ROW = MEMORY_SIZE / COLUMN;
  MARKED = marked;
  UNMARKED = unmarked;
  generateMemory();
}

function initialize_tag(allTag: number[], types: string[]): void {
  tags = allTag;
  typeTag = types;
}

function allHeap(newHeap: number[][]): void {
  memoryHeaps = newHeap;
}

function updateFlip(): void {
  flips.push(commandHeap.length - 1);
}

function newCommand(
  type,
  left,
  right,
  sizeLeft,
  sizeRight,
  heap,
  description,
  firstDesc,
  lastDesc,
  queue = [],
): void {
  const newType = type;
  const newLeft = left;
  const newRight = right;
  const newSizeLeft = sizeLeft;
  const newSizeRight = sizeRight;
  const newDesc = description;
  const newFirstDesc = firstDesc;
  const newLastDesc = lastDesc;

  memory = [];
  for (let j = 0; j < heap.length; j += 1) {
    memory.push(heap[j]);
  }
  const newQueue: number[] = [];
  for (let j = 0; j < queue.length; j += 1) {
    newQueue.push(queue[j]);
  }

  const obj: CommandHeapObject = {
    type: newType,
    heap: memory,
    left: newLeft,
    right: newRight,
    sizeLeft: newSizeLeft,
    sizeRight: newSizeRight,
    desc: newDesc,
    leftDesc: newFirstDesc,
    rightDesc: newLastDesc,
    queue: newQueue,
  };

  commandHeap.push(obj);
}

function newSweep(left, heap): void {
  const newSizeLeft = NODE_SIZE;
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
    '',
  );
}

function newMark(left, heap, queue): void {
  const newSizeLeft = NODE_SIZE;
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
    queue,
  );
}

function addRoots(arr): void {
  for (let i = 0; i < arr.length; i += 1) {
    ROOTS.push(arr[i]);
  }
}

function showRoot(heap): void {
  const desc = 'All root nodes are marked';
  newCommand(COMMAND.SHOW_MARKED, -1, -1, 0, 0, heap, desc, '', '');
}

function showRoots(heap): void {
  for (let i = 0; i < ROOTS.length; i += 1) {
    showRoot(heap);
  }
  ROOTS = [];
}

function newUpdateSweep(right, heap): void {
  const desc = `Set node ${right} to freelist`;
  newCommand(
    COMMAND.RESET,
    -1,
    right,
    0,
    NODE_SIZE,
    heap,
    desc,
    'free node',
    '',
  );
}

function newPush(left, right, heap): void {
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
    'new child pushed',
  );
}

function newPop(res, left, right, heap): void {
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
    'last child address slot',
  );
}

function newAssign(res, left, heap): void {
  const newRes = res;
  const desc = `Assign memory [${left}] with ${newRes}.`;
  newCommand(COMMAND.ASSIGN, left, -1, 1, 1, heap, desc, 'assigned memory', '');
}

function newNew(left, heap): void {
  const newSizeLeft = NODE_SIZE;
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
    '',
  );
}

function newGC(heap): void {
  const desc = 'Memory exhausted, start Mark and Sweep Algorithm';
  newCommand(COMMAND.START, -1, -1, 0, 0, heap, desc, '', '');
  updateFlip();
}

function endGC(heap): void {
  const desc = 'Result of free memory';
  newCommand(COMMAND.END, -1, -1, 0, 0, heap, desc, '', '');
  updateFlip();
}

function updateSlotSegment(
  tag: number,
  size: number,
  first: number,
  last: number,
): void {
  if (tag >= 0) {
    TAG_SLOT = tag;
  }
  if (size >= 0) {
    SIZE_SLOT = size;
  }
  if (first >= 0) {
    FIRST_CHILD_SLOT = first;
  }
  if (last >= 0) {
    LAST_CHILD_SLOT = last;
  }
}

function get_memory_size(): number {
  return MEMORY_SIZE;
}

function get_tags(): Tag[] {
  return tags;
}

function get_command(): CommandHeapObject[] {
  return commandHeap;
}

function get_flips(): number[] {
  return flips;
}

function get_types(): String[] {
  return typeTag;
}

function get_memory_heap(): MemoryHeaps {
  return memoryHeaps;
}

function get_memory_matrix(): MemoryHeaps {
  return memoryMatrix;
}

function get_roots(): number[] {
  return ROOTS;
}

function get_slots(): number[] {
  return [TAG_SLOT, SIZE_SLOT, FIRST_CHILD_SLOT, LAST_CHILD_SLOT];
}

function get_column_size(): number {
  return COLUMN;
}

function get_row_size(): number {
  return ROW;
}

function get_unmarked(): number {
  return UNMARKED;
}

function get_marked(): number {
  return MARKED;
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
    get_roots,
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
  showRoot,
};
