import { getParseTree, compileParseTree, compile } from 'source-academy-wabt';
import {objectToLinkedList} from 'source-academy-utils';

/**
 * Compile stuff
 * @param program 
 * @returns 
 */
export const wcompile = (program: string) => Array.from(compile(program));

/**
 * Run stuff
 * @param buffer 
 * @returns 
 */
export const wrun = (buffer: number[] | Uint8Array) => {
  if (buffer instanceof Array) {
    buffer = new Uint8Array(buffer);
  }

  const exps = new WebAssembly.Instance(new WebAssembly.Module(buffer)).exports;
  return objectToLinkedList(exps);
};
