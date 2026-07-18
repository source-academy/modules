export type Memory = number[];
export type MemoryHeaps = Memory[];
export type Tag = number;

export enum COMMAND {
  FLIP = 'Flip',
  PUSH = 'Push',
  POP = 'Pop',
  COPY = 'Copy',
  ASSIGN = 'Assign',
  NEW = 'New',
  START = 'Mark and Sweep Start',
  END = 'End of Garbage Collector',
  RESET = 'Sweep Reset',
  SHOW_MARKED = 'Marked Roots',
  MARK = 'Mark',
  SWEEP = 'Sweep',
  INIT = 'Initialize Memory',
}

export interface CommandHeapObject {
  type: COMMAND;
  heap: number[];
  left: number;
  right: number;
  sizeLeft: number;
  sizeRight: number;
  desc: string;
  leftDesc: string;
  rightDesc: string;
  queue: number[];
}

export interface MarkSweepGlobalState {
  rowCount: number;
  readonly columnCount: number;
  NODE_SIZE: number;
  MEMORY_SIZE: number;
  memory: Memory;
  memoryHeaps: Memory[];
  readonly commandHeap: CommandHeapObject[];
  memoryMatrix: number[][];
  tags: Tag[];
  typeTag: string[];
  readonly flips: number[];
  TAG_SLOT: number;
  SIZE_SLOT: number;
  FIRST_CHILD_SLOT: number;
  LAST_CHILD_SLOT: number;
  MARKED: number;
  UNMARKED: number;
  ROOTS: number[];
}
