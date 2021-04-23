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

export type CommandHeapObject = {
  type: String;
  to: number;
  from: number;
  heap: number[];
  left: number;
  right: number;
  sizeLeft: number;
  sizeRight: number;
  desc: String;
  scan: number;
  leftDesc: String;
  rightDesc: String;
  free: number;
};
