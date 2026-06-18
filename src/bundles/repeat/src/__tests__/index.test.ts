import { stringify } from 'js-slang/dist/utils/stringify';
import { describe, expect, test, vi } from 'vitest';
import * as funcs from '../functions';

vi.spyOn(funcs, 'repeat');

describe(funcs.repeat, () => {
  test('repeat works correctly and repeats unary function n times', () => {
    expect(funcs.repeat((x: number) => x + 1, 5)(1))
      .toEqual(6);
  });

  test('returns the identity function when n = 0', () => {
    expect(funcs.repeat((x: number) => x + 1, 0)(0)).toEqual(0);
  });

  test('throws an error when the function doesn\'t take 1 parameter', () => {
    expect(() => funcs.repeat((x: number, y: number) => x + y, 2))
      .toThrow('repeat: Expected function with 1 parameter, got (x, y) => x + y.');

    expect(() => funcs.repeat(() => 2, 2))
      .toThrow('repeat: Expected function with 1 parameter, got () => 2.');
  });

  test('throws an error when provided incorrect values', () => {
    expect(() => funcs.repeat((x: number) => x, -1))
      .toThrow('repeat: Expected integer greater than 0, got -1.');

    expect(() => funcs.repeat((x: number) => x, 1.5))
      .toThrow('repeat: Expected integer greater than 0, got 1.5.');
  });

  test('repeated function has implementation hidden', () => {
    const f = funcs.repeat((x: number) => x, 1);
    expect(stringify(f)).toEqual('(x) => func(repeat_internal(func, n - 1)(x))');
  });
});

test('twice works correctly and repeats function twice', () => {
  expect(funcs.twice((x: number) => x + 1)(1))
    .toEqual(3);
  expect(funcs.repeat).not.toHaveBeenCalled();
});

test('thrice works correctly and repeats function thrice', () => {
  expect(funcs.thrice((x: number) => x + 1)(1))
    .toEqual(4);
  expect(funcs.repeat).not.toHaveBeenCalled();
});
