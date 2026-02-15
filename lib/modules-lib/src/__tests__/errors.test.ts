import { describe, expect, test } from 'vitest';
import { InvalidCallbackError, InvalidParameterTypeError } from '../errors';

describe(InvalidParameterTypeError, () => {
  test('constructing without parameter name', () => {
    const error = new InvalidParameterTypeError('number', 'abc', 'foo');
    expect(error.explain()).toEqual('foo: Expected number, got "abc".');
  });

  test('constructing with parameter name', () => {
    const error = new InvalidParameterTypeError('number', 'abc', 'foo', 'x');
    expect(error.explain()).toEqual('foo: Expected number for x, got "abc".');
  });
});

describe(InvalidCallbackError, () => {
  test('constructing with expected number of parameters being greater than 0', () => {
    const error = new InvalidCallbackError(2, 'abc', 'foo');
    expect(error.explain()).toEqual('foo: Expected function with 2 parameters, got "abc".');
  });

  test('constructing with expected number of parameters being 0', () => {
    const error = new InvalidCallbackError(0, 'abc', 'foo');
    expect(error.explain()).toEqual('foo: Expected function with 0 parameters, got "abc".');
  });

  test('constructing with expected callback type string', () => {
    const error = new InvalidCallbackError('Curve', 'abc', 'foo', 'callback');
    expect(error.explain()).toEqual('foo: Expected Curve for callback, got "abc".');
  });
});
