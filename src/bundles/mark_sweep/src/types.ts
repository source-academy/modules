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

export type CommandHeapObject = {
  type: string;
  heap: number[];
  left: number;
  right: number;
  sizeLeft: number;
  sizeRight: number;
  desc: string;
  leftDesc: string;
  rightDesc: string;
  queue: number[];
};
