/**
 * This module defines custom error classes for handling errors that occur in Source bundles.
 * @module Errors
 * @title Errors
 */

import { RuntimeSourceError } from 'js-slang/dist/errors/runtimeSourceError';
import { stringify } from 'js-slang/dist/utils/stringify';

/**
 * A specific {@link RuntimeSourceError|RuntimeSourceError} that is thrown when a function receives a parameter of the wrong type.
 *
 * @example
 * ```
 * function play_sound(sound: unknown): asserts sound is Sound {
 *   if (!is_sound(sound)) {
 *     throw new InvalidParameterTypeError('Sound', sound, play_sound.name, 'sound');
 *   }
 * }
 * ```
 */
export class InvalidParameterTypeError extends RuntimeSourceError {
  constructor(
    /**
     * String representation of the expected type. Examples include "number", "string", or "Point".
     */
    public readonly expectedType: string,

    /**
     * The actual value that was received.
     */
    public readonly actualValue: unknown,

    /**
     * The name of the function that received the invalid parameter.
     */
    public readonly func_name: string,

    /**
     * The name of the parameter that received the invalid value, if available.
     */
    public readonly param_name?: string
  ) {
    super();
  }

  public override explain(): string {
    const paramString = this.param_name ? ` for ${this.param_name}` : '';
    return `${this.func_name}: Expected ${this.expectedType}${paramString}, got ${stringify(this.actualValue)}.`;
  }

  public get message() {
    return this.explain();
  }

  public override toString() {
    return this.explain();
  }
}

/**
 * A subclass of the {@link InvalidParameterTypeError|InvalidParameterTypeError} that is thrown when a function receives a callback parameter
 * that is not a function or does not have the expected number of parameters.
 *
 * @example
 * ```
 * function call_callback(callback: (x: number, y: number) => number) {
 *   if (!isFunctionOfLength(callback, 2)) {
 *     throw new InvalidCallbackError(2, callback, call_callback.name, 'callback');
 *   }
 * }
 * ```
 */
export class InvalidCallbackError extends InvalidParameterTypeError {
  constructor(
    /**
     * Either the expected number of parameters of the callback function, or a string describing the expected callback type.
     */
    expected: number | string,
    actualValue: unknown,
    func_name: string,
    param_name?: string
  ) {
    const expectedStr = typeof expected === 'number' ? `function with ${expected} parameter${expected !== 1 ? 's' : ''}` : expected;
    super(
      expectedStr,
      actualValue,
      func_name,
      param_name
    );
  }
}
