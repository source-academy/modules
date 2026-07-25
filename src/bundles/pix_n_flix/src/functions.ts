import { EvaluatorNumberRangeError, EvaluatorParameterTypeError } from '@sourceacademy/conductor/common';

import type { ImageBuffer } from './types';

/** Creates a fresh, black (0,0,0,255) RGBA buffer of the given dimensions. */
export function makeImageBuffer(width: number, height: number): ImageBuffer {
  const view = new Uint8ClampedArray(width * height * 4);
  for (let i = 3; i < view.length; i += 4) {
    view[i] = 255;
  }
  return { view, width, height };
}

function assertInRange(value: number, min: number, max: number, funcName: string, paramName: string): void {
  if (!Number.isInteger(value) || value < min || value > max) {
    // EvaluatorNumberRangeError is the correct, student-facing error here - the
    // throw-runtime-error rule doesn't yet recognise Conductor's own error types.
    // eslint-disable-next-line @sourceacademy/throw-runtime-error
    throw new EvaluatorNumberRangeError(value, { min, max, integer: true }, funcName, paramName);
  }
}

/** Validates x/y/p are in bounds for the given buffer, throwing a student-facing error if not. */
export function assertPixelCoordinates(buffer: ImageBuffer, x: number, y: number, p: number, funcName: string): void {
  assertInRange(x, 0, buffer.width - 1, funcName, 'x');
  assertInRange(y, 0, buffer.height - 1, funcName, 'y');
  assertInRange(p, 0, 3, funcName, 'p');
}

/** Reads channel `p` (0=r,1=g,2=b,3=a) of pixel `(x,y)` from `buffer`. */
export function readChannel(buffer: ImageBuffer, x: number, y: number, p: number): number {
  return buffer.view[(y * buffer.width + x) * 4 + p];
}

/** Writes `value` into channel `p` (0=r,1=g,2=b,3=a) of pixel `(x,y)` in `buffer`. */
export function writeChannel(buffer: ImageBuffer, x: number, y: number, p: number, value: number): void {
  assertInRange(value, 0, 255, 'set_pixel_value', 'v');
  buffer.view[(y * buffer.width + x) * 4 + p] = value;
}

/** The default filter: copies `src` to `dest` unchanged. Both buffers must be the same size. */
export function copyImageBuffer(src: ImageBuffer, dest: ImageBuffer): void {
  if (src.width !== dest.width || src.height !== dest.height) {
    // EvaluatorParameterTypeError is the correct, student-facing error here - the
    // throw-runtime-error rule doesn't yet recognise Conductor's own error types.
    // eslint-disable-next-line @sourceacademy/throw-runtime-error
    throw new EvaluatorParameterTypeError('copy_image', 'dest', `an image of the same size as source (${src.width}x${src.height})`, `${dest.width}x${dest.height}`);
  }
  dest.view.set(src.view);
}
