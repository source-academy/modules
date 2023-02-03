/**
 * A single sentence summarising the module (this sentence is displayed larger).
 *
 * Sentences describing the module. More sentences about the module.
 *
 * @module module_name
 * @author Author Name
 * @author Author Name
 */

/*
  To access things like the context or module state you can just import the context
  using the import below
 */
import { context } from 'js-slang/moduleHelpers';

/**
 * Sample function. Increments a number by 1.
 *
 * @param x The number to be incremented.
 * @returns The incremented value of the number.
 */
export function sample_function(x: number): number {
  return ++x;
} // Then any functions or variables you want to expose to the user is exported from the bundle's index.ts file
