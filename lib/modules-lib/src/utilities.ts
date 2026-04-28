/**
 * Common utility functions that can be used across bundles and tabs
 * @module Utilities
 * @title Utilities
 */

import { GeneralRuntimeError, InvalidParameterTypeError } from './errors';
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
  func_name = func_name ?? hexToColor.name;

  if (typeof hex !== 'string') {
    throw new InvalidParameterTypeError('string', hex, func_name);
  }

  const regex = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/igu;
  const groups = regex.exec(hex);

  if (!groups) {
    throw new GeneralRuntimeError(`${func_name}: Invalid color hex string: ${hex}`);
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

export {
  isNumberWithinRange,
  assertNumberWithinRange,
  isFunctionOfLength,
  assertFunctionOfLength,
} from 'js-slang/dist/utils/rttc';

export {
  callIfFuncAndRightArgs,
  wrap as wrapFunction
} from 'js-slang/dist/utils/operators';
