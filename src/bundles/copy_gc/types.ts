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
  INIT = 'Initialize Memory'
}

export type CommandHeapObject = {
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
