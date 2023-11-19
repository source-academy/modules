import { compile } from 'source-academy-wabt';
import { objectToLinkedList } from 'source-academy-utils';

/**
 * Compile a (hopefully valid) WebAssembly Text module to binary.
 * @param program program to compile
 * @returns an array of 8-bit unsigned integers.
 */
export const wcompile = (program: string) => Array.from(compile(program));

/**
 * Run a compiled WebAssembly Binary Buffer.
 * @param buffer an array of 8-bit unsigned integers to run
 * @returns a linked list of exports that the relevant WebAssembly Module exports
 */
export const wrun = (buffer: number[] | Uint8Array) => {
  if (buffer instanceof Array) {
    buffer = new Uint8Array(buffer);
  }

  const exps = new WebAssembly.Instance(new WebAssembly.Module(buffer)).exports;
  return objectToLinkedList(exps);
};
