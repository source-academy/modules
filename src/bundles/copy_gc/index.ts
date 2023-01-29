import { COMMAND, type CommandHeapObject, type Memory, type MemoryHeaps, type Tag } from './types';

// Global Variables
let ROW: number = 10;
const COLUMN: number = 32;
let MEMORY_SIZE: number = -99;
let TO_SPACE: number;
let FROM_SPACE: number;
let memory: Memory;
let memoryHeaps: Memory[] = [];
const commandHeap: CommandHeapObject[] = [];
let toMemoryMatrix: number[][];
let fromMemoryMatrix: number[][];
let tags: Tag[];
let typeTag: string[];
const flips: number[] = [];
let TAG_SLOT: number = 0;
let SIZE_SLOT: number = 1;
let FIRST_CHILD_SLOT: number = 2;
let LAST_CHILD_SLOT: number = 3;
let ROOTS: number[] = [];

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

function generateMemory(): void {
  toMemoryMatrix = [];
  for (let i = 0; i < ROW / 2; i += 1) {
    memory = [];
    for (let j = 0; j < COLUMN && i * COLUMN + j < MEMORY_SIZE / 2; j += 1) {
      memory.push(i * COLUMN + j);
    }
    toMemoryMatrix.push(memory);
  }

  fromMemoryMatrix = [];
  for (let i = ROW / 2; i < ROW; i += 1) {
    memory = [];
    for (let j = 0; j < COLUMN && i * COLUMN + j < MEMORY_SIZE; j += 1) {
      memory.push(i * COLUMN + j);
    }
    fromMemoryMatrix.push(memory);
  }

  const obj: CommandHeapObject = {
    type: COMMAND.INIT,
    to: TO_SPACE,
    from: FROM_SPACE,
    heap: [],
    left: -1,
    right: -1,
    sizeLeft: 0,
    sizeRight: 0,
    desc: 'Memory initially empty.',
    leftDesc: '',
    rightDesc: '',
    scan: -1,
    free: -1,
  };

  commandHeap.push(obj);
}

function resetFromSpace(fromSpace, heap): number[] {
  const newHeap: number[] = [];
  if (fromSpace > 0) {
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

function initialize_memory(memorySize: number): void {
  MEMORY_SIZE = memorySize;
  ROW = MEMORY_SIZE / COLUMN;
  TO_SPACE = 0;
  FROM_SPACE = MEMORY_SIZE / 2;
  generateMemory();
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
    memory.push(heap[j]);
  }

  const obj: CommandHeapObject = {
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
    scan: -1,
    free: -1,
  };

  commandHeap.push(obj);
}

function newCopy(left, right, heap): void {
  const { length } = commandHeap;
  const toSpace = commandHeap[length - 1].to;
  const fromSpace = commandHeap[length - 1].from;
  const newSizeLeft = heap[left + SIZE_SLOT];
  const newSizeRight = heap[right + SIZE_SLOT];
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
    'free',
  );
}

function endFlip(left, heap): void {
  const { length } = commandHeap;
  const fromSpace = commandHeap[length - 1].from;
  const toSpace = commandHeap[length - 1].to;
  const newSizeLeft = heap[left + SIZE_SLOT];
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
    '',
  );
  updateFlip();
}

function updateRoots(array): void {
  for (let i = 0; i < array.length; i += 1) {
    ROOTS.push(array[i]);
  }
}

function resetRoots(): void {
  ROOTS = [];
}

function startFlip(toSpace, fromSpace, heap): void {
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
    '',
  );
  updateFlip();
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
    'new child pushed',
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
    'last child address slot',
  );
}

function doneShowRoot(heap): void {
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
    '',
  );
}

function showRoots(left, heap): void {
  const { length } = commandHeap;
  const toSpace = commandHeap[length - 1].to;
  const fromSpace = commandHeap[length - 1].from;
  const newSizeLeft = heap[left + SIZE_SLOT];
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
    '',
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
    '',
  );
}

function newNew(left, heap): void {
  const { length } = commandHeap;
  const toSpace = commandHeap[length - 1].to;
  const fromSpace = commandHeap[length - 1].from;
  const newSizeLeft = heap[left + SIZE_SLOT];
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
    '',
  );
}

function scanFlip(left, right, scan, free, heap): void {
  const { length } = commandHeap;
  const toSpace = commandHeap[length - 1].to;
  const fromSpace = commandHeap[length - 1].from;
  memory = [];
  for (let j = 0; j < heap.length; j += 1) {
    memory.push(heap[j]);
  }

  const newLeft = left;
  const newRight = right;
  const newScan = scan;
  const newFree = free;
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
    heap: memory,
    left: newLeft,
    right: newRight,
    sizeLeft: 1,
    sizeRight: 1,
    scan: newScan,
    free: newFree,
    desc: newDesc,
    leftDesc: 'scan',
    rightDesc: 'free',
  };

  commandHeap.push(obj);
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

function get_from_space(): number {
  return FROM_SPACE;
}

function get_memory_heap(): MemoryHeaps {
  return memoryHeaps;
}

function get_to_memory_matrix(): MemoryHeaps {
  return toMemoryMatrix;
}

function get_from_memory_matrix(): MemoryHeaps {
  return fromMemoryMatrix;
}

function get_roots(): number[] {
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

function init() {
  return {
    toReplString: () => '<REDACTED>',
    get_memory_size,
    get_from_space,
    get_to_space,
    get_memory_heap,
    get_tags,
    get_types,
    get_column_size,
    get_row_size,
    get_from_memory_matrix,
    get_to_memory_matrix,
    get_flips,
    get_slots,
    get_command,
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
  resetFromSpace,
  newCommand,
  newCopy,
  endFlip,
  newPush,
  newPop,
  newAssign,
  newNew,
  scanFlip,
  startFlip,
  updateRoots,
  resetRoots,
  showRoots,
  doneShowRoot,
};
