/**
 * Common utility functions that can be used across bundles and tabs
 * @module Utilities
 * @title Utilities
 */

import { InvalidCallbackError, InvalidNumberParameterError, type InvalidNumberParameterErrorOptions } from './errors';
import type { DebuggerContext } from './types';

/**
 * Converts an angle in degrees into radians
 * @param degrees Angle in degrees
 * @returns Angle in radians
 */
export function degreesToRadians(degrees: number): number {
  return (degrees / 360) * (2 * Math.PI);
}

/**
 * Converts an angle in radians into degrees
 * @param radians Angle in radians
 * @returns Angle in degrees
 */
export function radiansToDegrees(radians: number): number {
  return radians / Math.PI * 180;
}

/**
 * Converts a color hex value string to its red, green and blue components, each normalized to
 * between 0 and 1. The leading `#` is optional.
 * @returns Tuple of three numbers representing the R, G and B components
 */
export function hexToColor(hex: string, func_name?: string): [r: number, g: number, b: number] {
  if (typeof hex !== 'string') {
    func_name = func_name ?? hexToColor.name;
    throw new Error(`${func_name}: Expected a string, got ${typeof hex}`);
  }

  const regex = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/igu;
  const groups = regex.exec(hex);

  if (groups == undefined) {
    func_name = func_name ?? hexToColor.name;
    throw new Error(`${func_name}: Invalid color hex string: ${hex}`);
  };

  return [
    parseInt(groups[1], 16) / 0xff,
    parseInt(groups[2], 16) / 0xff,
    parseInt(groups[3], 16) / 0xff
  ];
}

/**
 * Returns a partial {@link DebuggerContext} object that contains a context which contains the mocked
 * module state for the given module.
 * Function intended for testing use only.
 */
export function mockDebuggerContext<T>(moduleState: T, name: string) {
  return {
    context: {
      moduleContexts: {
        [name]: {
          state: moduleState,
          tabs: []
        }
      }
    }
  } as unknown as DebuggerContext;
}

type TupleOfLengthHelper<T extends number, U, V extends U[] = []> =
  V['length'] extends T ? V : TupleOfLengthHelper<T, U, [...V, U]>;

/**
 * Utility type that represents a tuple of a specific length
 */
export type TupleOfLength<T extends number, U = unknown> = TupleOfLengthHelper<T, U>;

/**
 * Type guard for checking that the provided value is a function and that it has the specified number of parameters.
 * Of course at runtime parameter types are not checked, so this is only useful when combined with TypeScript types.
 *
 * If the function's length property is undefined, the parameter count check is skipped.
 */
export function isFunctionOfLength<T extends (...args: any[]) => any>(f: (...args: any) => any, l: Parameters<T>['length']): f is T;
export function isFunctionOfLength<T extends number>(f: unknown, l: T): f is (...args: TupleOfLength<T>) => unknown;
export function isFunctionOfLength(f: unknown, l: number) {
  // TODO: Need a variation for rest parameters
  return typeof f === 'function' && f.length === l;
}

/**
 * Assertion version of {@link isFunctionOfLength}
 *
 * @param f Value to validate
 * @param l Number of parameters that `f` is expected to have
 * @param func_name Function within which the validation is occurring
 * @param type_name Optional alias for the function type
 * @param param_name Name of the parameter that's being validated
 */
export function assertFunctionOfLength<T extends (...args: any[]) => any>(
  f: (...args: any) => any,
  l: Parameters<T>['length'],
  func_name: string,
  type_name?: string,
  param_name?: string
): asserts f is T;
export function assertFunctionOfLength<T extends number>(
  f: unknown,
  l: T,
  func_name: string,
  type_name?: string,
  param_name?: string
): asserts f is (...args: TupleOfLength<T>) => unknown;
export function assertFunctionOfLength(
  f: unknown,
  l: number,
  func_name: string,
  type_name?: string,
  param_name?: string
) {
  if (!isFunctionOfLength(f, l)) {
    throw new InvalidCallbackError(type_name ?? l, f, func_name, param_name);
  }
}

/**
 * Function for checking if a given value is a number and that it also potentially satisfies a bunch of other criteria:
 * - Within a given range of [min, max]
 * - Is an integer
 * - Is not NaN
 */
export function isNumberWithinRange(value: unknown, min?: number, max?: number, integer?: boolean): value is number;
export function isNumberWithinRange(value: unknown, options: InvalidNumberParameterErrorOptions): value is number;
export function isNumberWithinRange(
  value: unknown,
  arg0?: InvalidNumberParameterErrorOptions | number,
  max?: number,
  integer: boolean = true
): value is number {
  let options: InvalidNumberParameterErrorOptions;

  if (typeof arg0 === 'number' || typeof arg0 === 'undefined') {
    options = {
      min: arg0,
      max,
      integer,
    };
  } else {
    options = arg0;
    options.integer = arg0.integer ?? true;
  }

  if (typeof value !== 'number' || Number.isNaN(value)) return false;

  if (options.max !== undefined && value > options.max) return false;
  if (options.min !== undefined && value < options.min) return false;

  return !options.integer || Number.isInteger(value);
}

interface AssertNumberWithinRangeOptions extends InvalidNumberParameterErrorOptions {
  func_name: string;
  param_name?: string;
}

/**
 * Assertion version of {@link isNumberWithinRange}
 */
export function assertNumberWithinRange(
  value: unknown,
  func_name: string,
  min?: number,
  max?: number,
  integer?: boolean,
  param_name?: string
): asserts value is number;
export function assertNumberWithinRange(value: unknown, options: AssertNumberWithinRangeOptions): asserts value is number;
export function assertNumberWithinRange(
  value: unknown,
  arg0: AssertNumberWithinRangeOptions | string,
  min?: number,
  max?: number,
  integer?: boolean,
  param_name?: string
): asserts value is number {
  let options: AssertNumberWithinRangeOptions;

  if (typeof arg0 === 'string') {
    options = {
      func_name: arg0,
      min,
      max,
      integer: integer ?? true,
      param_name
    };
  } else {
    options = arg0;
  }

  if (!isNumberWithinRange(value, options)) {
    throw new InvalidNumberParameterError(value, options, options.func_name, options.param_name);
  }
}
