/**
 * Common utility functions that can be used across bundles and tabs
 * @module Utilities
 * @title Utilities
 */

import type { DebuggerContext } from './types';

/**
 * Converts an angle in degrees into radians
 * @param degrees Angle in degrees
 * @returns Angle in radians
 */
export function degreesToRadians(degrees: number): number {
  return (degrees / 360) * (2 * Math.PI);
}

export function radiansToDegrees(radians: number): number {
  return radians / Math.PI * 180;
}

/**
 * Converts a color hex value string to its red, green and blue components, each normalized to
 * between 0 and 1. The leading `#` is optional.
 * @returns Tuple of three numbers representing the R, G and B components
 */
export function hexToColor(hex: string, func_name?: string): [number, number, number] {
  const regex = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/igu;
  const groups = regex.exec(hex);

  if (groups == undefined) {
    if (func_name === undefined) {
      throw new Error(`Invalid color hex string: ${hex}`);
    }
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

type ArrayOfLengthHelper<T extends number, U, V extends U[] = []> =
  V['length'] extends T ? V : ArrayOfLengthHelper<T, U, [...V, U]>;

/**
 * Utility type that represents a tuple of a specific length
 */
export type ArrayOfLength<T extends number, U = unknown> = ArrayOfLengthHelper<T, U>;

/**
 * Type guard for checking that a function has the specified number of parameters.
 */
export function isFunctionOfLength<T extends number>(f: unknown, l: T): f is (...args: ArrayOfLength<T>) => unknown {
  return typeof f === 'function' && f.length === l;
}
