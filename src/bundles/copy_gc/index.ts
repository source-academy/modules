// eslint-disable-next-line no-use-before-define
import { MemoryHeaps, Memory } from './types';

// exported functions

// Global Variables
const ROW: number = 10;
const COLUMN: number = 15;
let MEMORY_SIZE: number = -99;
let TO_SPACE: number;
let FROM_SPACE: number;
let memory: Memory;
let memoryHeaps: MemoryHeaps;

function initialise_memory(memorySize: number): void {
  MEMORY_SIZE = memorySize;
  console.log('updating memory size ', MEMORY_SIZE);
}

function update(toSpace: number, fromSpace: number): void {
  TO_SPACE = toSpace;
  FROM_SPACE = fromSpace;
  console.log('updating space size ', TO_SPACE, ' ', FROM_SPACE);
}

function get_memory_size(): number {
  return MEMORY_SIZE;
}

export default function copy_gc() {
  return {
    initialise_memory,
    get_memory_size,
    TO_SPACE,
    FROM_SPACE,
    update,
    memoryHeaps,
    memory,
    ROW,
    COLUMN,
  };
}
