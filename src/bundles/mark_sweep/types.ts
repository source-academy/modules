export type Memory = number[];
export type MemoryHeaps = Memory[];
export type Tag = number;
export const COMMAND = {
  FLIP: 'Flip',
  PUSH: 'Push',
  POP: 'Pop',
  COPY: 'Copy',
  ASSIGN: 'Assign',
  NEW: 'New',
  SCAN: 'Scan',
};

export type CommandHeapObject = {
  type: String;
  heap: number[];
  left: number;
  right: number;
  sizeLeft: number;
  sizeRight: number;
  desc: String;
  leftDesc: String;
  rightDesc: String;
  queue: number[];
};
