// eslint-disable-next-line no-use-before-define
import { MemoryHeaps, Memory, Tag, COMMAND } from './types';

// exported functions

// Global Variables
let ROW: number = 10;
const COLUMN: number = 32;
let NODE_SIZE: number = 0;
let MEMORY_SIZE: number = -99;
let TO_SPACE: number;
let memory: Memory;
// eslint-disable-next-line prefer-const
let memoryHeaps: Memory[] = [];
// eslint-disable-next-line prefer-const
let commandHeap: any[] = [];
// eslint-disable-next-line prefer-const
let operationHeaps: string[] = [];
let toMemoryMatrix: number[][];
let tags: Tag[];
let typeTag: string[];
// eslint-disable-next-line prefer-const
let flips: number[] = [];
let TAG_SLOT: number = 0;
let SIZE_SLOT: number = 1;
let FIRST_CHILD_SLOT: number = 2;
let LAST_CHILD_SLOT: number = 3;
let MARKED: number = 1;
let UNMARKED: number = 0;
let ROOTS: any[] = [];

function generateMemory(): void {
  toMemoryMatrix = [];
  for (let i = 0; i < ROW; i += 1) {
    memory = [];
    for (let j = 0; j < COLUMN && i * COLUMN + j < MEMORY_SIZE; j += 1) {
      // eslint-disable-next-line no-param-reassign
      memory.push(i * COLUMN + j);
    }
    toMemoryMatrix.push(memory);
  }

  const obj = {
    type: 'init',
    to: TO_SPACE,
    from: -1,
    heap: [],
    left: -1,
    right: -1,
    sizeLeft: 0,
    sizeRight: 0,
    desc: 'Memory initially empty.',
    leftDesc: '',
    rightDesc: '',
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
  unmarked
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

function updateMemoryHeap(ops: string, newHeap: number[]): void {
  if (newHeap) {
    memory = [];
    for (let j = 0; j < newHeap.length; j += 1) {
      // eslint-disable-next-line no-param-reassign
      memory.push(newHeap[j]);
    }
    console.log('add new ', memoryHeaps.length, ' -- ', newHeap);
    memoryHeaps.push(memory);
    operationHeaps.push(ops);
    // heapStates.push(memoryHeaps);
  }
}

function allHeap(newHeap: number[][]): void {
  memoryHeaps = newHeap;
}

function updateFlip(): void {
  flips.push(commandHeap.length - 1);
}

function resetToSpace(toSpace, heap): any {
  // eslint-disable-next-line prefer-const
  let newHeap: any[] = [];
  if (toSpace > 0) {
    for (let i = 0; i < MEMORY_SIZE / 2; i += 1) {
      newHeap.push(heap[i]);
    }
    for (let i = MEMORY_SIZE / 2; i < MEMORY_SIZE; i += 1) {
      newHeap.push(0);
    }
  } else {
    // to space between 0...M/2
    for (let i = 0; i < MEMORY_SIZE / 2; i += 1) {
      newHeap.push(0);
    }
    for (let i = MEMORY_SIZE / 2; i < MEMORY_SIZE; i += 1) {
      newHeap.push(heap[i]);
    }
  }
  return newHeap;
}

function newCommand(
  type,
  toSpace,
  fromSpace,
  left,
  right,
  sizeLeft,
  sizeRight,
  heap,
  description,
  firstDesc,
  lastDesc,
  queue = []
): void {
  const newType = type;
  const newToSpace = toSpace;
  const newFromSpace = fromSpace;
  const newLeft = left;
  const newRight = right;
  const newSizeLeft = sizeLeft;
  const newSizeRight = sizeRight;
  const newDesc = description;
  const newFirstDesc = firstDesc;
  const newLastDesc = lastDesc;

  memory = [];
  for (let j = 0; j < heap.length; j += 1) {
    // eslint-disable-next-line no-param-reassign
    memory.push(heap[j]);
  }
  // eslint-disable-next-line prefer-const
  let newQueue: number[] = [];
  for (let j = 0; j < queue.length; j += 1) {
    // eslint-disable-next-line no-param-reassign
    newQueue.push(queue[j]);
  }

  const obj = {
    type: newType,
    to: newToSpace,
    from: newFromSpace,
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
  const toSpace = 0;
  const fromSpace = 0;
  const newSizeLeft = NODE_SIZE;
  const desc = `Freeing node ${left}`;
  newCommand(
    'SWEEP',
    toSpace,
    fromSpace,
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

function newMark(left, heap, queue): void {
  const toSpace = 0;
  const fromSpace = 0;
  const newSizeLeft = NODE_SIZE;
  const desc = `Marking node ${left} to be live memory`;
  newCommand(
    'MARK',
    toSpace,
    fromSpace,
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

function addRoots(arr): void {
  for (let i = 0; i < arr.length; i += 1) {
    ROOTS.push(arr[i]);
  }
}

function showRoot(heap): void {
  const toSpace = 0;
  const fromSpace = 0;
  const desc = `All root nodes are marked`;
  newCommand(
    'Marked Roots',
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

function showRoots(heap): void {
  for (let i = 0; i < ROOTS.length; i += 1) {
    showRoot(heap);
  }
  ROOTS = [];
}

function newUpdateSweep(right, heap): void {
  const toSpace = 0;
  const fromSpace = 0;
  const desc = `Set node ${right} to freelist`;
  newCommand(
    'SWEEP RESET',
    toSpace,
    fromSpace,
    -1,
    right,
    0,
    NODE_SIZE,
    heap,
    desc,
    'free node',
    ''
  );
}

function newPush(left, right, heap): void {
  const { length } = commandHeap;
  const toSpace = commandHeap[length - 1].to;
  const fromSpace = commandHeap[length - 1].from;
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

function newPop(res, left, right, heap): void {
  const { length } = commandHeap;
  const toSpace = commandHeap[length - 1].to;
  const fromSpace = commandHeap[length - 1].from;
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

function newAssign(res, left, heap): void {
  const { length } = commandHeap;
  const toSpace = commandHeap[length - 1].to;
  const fromSpace = commandHeap[length - 1].from;
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

function newNew(left, heap): void {
  const { length } = commandHeap;
  const toSpace = commandHeap[length - 1].to;
  const fromSpace = commandHeap[length - 1].from;
  const newSizeLeft = NODE_SIZE;
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

function newGC(heap): void {
  const { length } = commandHeap;
  const toSpace = commandHeap[length - 1].to;
  const fromSpace = commandHeap[length - 1].from;
  const desc = `Memory exhausted, start Mark and Sweep Algorithm`;
  newCommand(
    'Mark and Sweep Start',
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

function endGC(heap): void {
  const { length } = commandHeap;
  const toSpace = commandHeap[length - 1].to;
  const fromSpace = commandHeap[length - 1].from;
  const desc = `Result of free memory`;
  newCommand(
    'End of Garbage Collector',
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

function updateSlotSegment(
  tag: number,
  size: number,
  first: number,
  last: number
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

function get_command(): any[] {
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

function get_to_memory_matrix(): MemoryHeaps {
  return toMemoryMatrix;
}

function get_roots(): any[] {
  return ROOTS;
}

function get_slots(): number[] {
  return [TAG_SLOT, SIZE_SLOT, FIRST_CHILD_SLOT, LAST_CHILD_SLOT];
}

function get_to_space(): number {
  return TO_SPACE;
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
    get_to_space,
    get_memory_heap,
    get_tags,
    get_types,
    get_column_size,
    get_row_size,
    get_to_memory_matrix,
    get_flips,
    get_slots,
    get_command,
    get_unmarked,
    get_marked,
    get_roots,
  };
}

export default function mark_sweep() {
  return {
    init,
    // initialisation
    initialize_memory,
    initialize_tag,
    updateMemoryHeap,
    generateMemory,
    allHeap,
    updateSlotSegment,
    resetToSpace,
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
}
