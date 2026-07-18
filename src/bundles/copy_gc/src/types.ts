export type Memory = number[];
export type MemoryHeaps = Memory[];
export type Tag = number;

// command type

export enum COMMAND {
  FLIP = 'Flip',
  PUSH = 'Push',
  POP = 'Pop',
  COPY = 'Copy',
  ASSIGN = 'Assign',
  NEW = 'New',
  SCAN = 'Scan',
  INIT = 'Initialize Memory',
}

export interface CommandHeapObject {
  type: string;
  to: number;
  from: number;
  heap: number[];
  left: number;
  right: number;
  sizeLeft: number;
  sizeRight: number;
  desc: string;
  scan: number;
  leftDesc: string;
  rightDesc: string;
  free: number;
};

export interface CopyGCGlobalState {
  ROW: number;
  readonly COLUMN: number;
  MEMORY_SIZE: number;
  TO_SPACE: number;
  FROM_SPACE: number;
  memory: Memory;
  memoryHeaps: Memory[];
  readonly commandHeap: CommandHeapObject[];
  toMemoryMatrix: number[][];
  fromMemoryMatrix: number[][];
  tags: Tag[];
  typeTag: string[];
  readonly flips: number[];
  TAG_SLOT: number;
  SIZE_SLOT: number;
  FIRST_CHILD_SLOT: number;
  LAST_CHILD_SLOT: number;
  ROOTS: number[];
}
