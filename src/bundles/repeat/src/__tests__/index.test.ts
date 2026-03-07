import { describe, expect, test } from 'vitest';
import { repeat, thrice, twice } from '../functions';

describe(repeat, () => {
  test('repeat works correctly and repeats unary function n times', () => {
    expect(repeat((x: number) => x + 1, 5)(1))
      .toBe(6);
  });

  test('when n = 0, f is the identity function', () => {
    expect(repeat(x => x + 1, 0)(0)).toEqual(0);
  });

  test('throws an error when the function takes more than 1 parameter', () => {
    expect(repeat((x, y) => x + y, 2)).toThrowError();
    expect(repeat(() => 2, 2)).toThrowError('repeat: ');
  });

  test('throws an error when provided incorrect integers', () => {
    expect(repeat(x => x, -1)).toThrowError();
    expect(repeat(x => x, 1.5)).toThrowError();
  });
});

test('twice works correctly and repeats function twice', () => {
  expect(twice((x: number) => x + 1)(1))
    .toBe(3);
});

test('thrice works correctly and repeats function thrice', () => {
  expect(thrice((x: number) => x + 1)(1))
    .toBe(4);
});
