// eslint-disable-next-line no-use-before-define
import { MemoryHeaps, Memory, Tag } from './types';

// exported functions

// Global Variables
let ROW: number = 10;
let COLUMN: number = 32;
let MEMORY_SIZE: number = -99;
let TO_SPACE: number;
let FROM_SPACE: number;
let memory: Memory;
let memoryHeaps: Memory[];
let tags: Tag[];
let typeTag: string[];

function initialise_memory(memorySize: number): void {
  MEMORY_SIZE = memorySize;
  COLUMN = 32;
  ROW = MEMORY_SIZE / COLUMN;
  ROW /= 2;
  console.log('updating memory size ', MEMORY_SIZE);
}

function initialise_tag(allTag: Tag[], types: string[]): void {
  tags = allTag;
  typeTag = types;
}

function update(toSpace: number, fromSpace: number): void {
  TO_SPACE = toSpace;
  FROM_SPACE = fromSpace;
  console.log('updating space size ', TO_SPACE, ' ', FROM_SPACE);
}

function updateMemoryHeap(): void {
  memoryHeaps = [[2, 4, 5, 2, 8, 9]];
}

function generateMemory(): void {
  memoryHeaps = [];
  for (let i = 0; i < ROW; i += 1) {
    memory = [];
    for (let j = 0; j < COLUMN; j += 1) {
      // eslint-disable-next-line no-param-reassign
      console.log('before pushing ', memory);
      memory.push(i + j);
      console.log('after pushing ', memory);
    }
    console.log('tryiing to pushing ', memory);
    memoryHeaps.push(memory);
  }
}

function get_memory_size(): number {
  return MEMORY_SIZE;
}

function get_to_space(): number {
  return TO_SPACE;
}

function get_from_space(): number {
  return FROM_SPACE;
}

function get_memory_heap(): MemoryHeaps {
  return memoryHeaps;
}

function init() {
  return {
    toReplString: () => '<REDACTED>',
    get_memory_size,
    get_from_space,
    get_to_space,
    get_memory_heap,
  };
}

export default function copy_gc() {
  return {
    init,
    // get data
    get_memory_size,
    get_to_space,
    get_from_space,
    get_memory_heap,
    // initialisation
    initialise_memory,
    initialise_tag,
    update,
    updateMemoryHeap,
    generateMemory,
  };
}
