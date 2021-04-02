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
// eslint-disable-next-line prefer-const
let memoryHeaps: Memory[] = [];
let toMemoryMatrix: number[][];
let fromMemoryMatrix: number[][];
let tags: Tag[];
let typeTag: string[];
// eslint-disable-next-line prefer-const
let flips: number[] = [];

function initialise_tag(allTag: number[], types: string[]): void {
  tags = allTag;
  typeTag = types;
}

function update(toSpace: number, fromSpace: number): void {
  TO_SPACE = toSpace;
  FROM_SPACE = fromSpace;
  console.log('updating space size ', TO_SPACE, ' ', FROM_SPACE);
}

function updateMemoryHeap(newHeap: number[]): void {
  if (newHeap) {
    console.log('add new ', memoryHeaps.length, ' -- ', newHeap);
    memoryHeaps.push(newHeap);
  }
}

function updateFlip(): void {
  flips.push(memoryHeaps.length - 1);
}

function generateMemory(): void {
  toMemoryMatrix = [];
  for (let i = 0; i < ROW / 2; i += 1) {
    memory = [];
    for (let j = 0; j < COLUMN && i * COLUMN + j < MEMORY_SIZE; j += 1) {
      // eslint-disable-next-line no-param-reassign
      memory.push(i * COLUMN + j);
    }
    toMemoryMatrix.push(memory);
  }

  fromMemoryMatrix = [];
  for (let i = ROW / 2; i < ROW; i += 1) {
    memory = [];
    for (let j = 0; j < COLUMN && i * COLUMN + j < MEMORY_SIZE; j += 1) {
      // eslint-disable-next-line no-param-reassign
      memory.push(i * COLUMN + j);
    }
    fromMemoryMatrix.push(memory);
  }
}

function initialise_memory(memorySize: number): void {
  MEMORY_SIZE = memorySize;
  COLUMN = 32;
  ROW = MEMORY_SIZE / COLUMN;
  generateMemory();
  console.log('updating memory size ', MEMORY_SIZE);
}

function get_memory_size(): number {
  return MEMORY_SIZE;
}

function get_tags(): Tag[] {
  return tags;
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
    updateFlip,
  };
}

/*
import { 
    copy_gc, 
    update, 
    initialise_memory, 
    init, 
    updateMemoryHeap,
    initialise_tag,
    updateFlip
} from "copy_gc"; 

initialise_memory(200);
update(0, 28);
updateMemoryHeap([20,53,65,13]);
updateFlip();
updateMemoryHeap([20,5,65,23]);
updateMemoryHeap([2,523,15,143]);
updateMemoryHeap([20,53,65,23]);
updateFlip();
updateMemoryHeap([2,523,15,143]);
updateMemoryHeap([20,5,65,23]);
initialise_tag([53,23], ['hallo', 'int']);

init();
*/
