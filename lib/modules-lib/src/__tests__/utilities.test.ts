/* @vitest browser: false */

import { assert, describe, expect, expectTypeOf, it, test } from 'vitest';
import * as funcs from '../utilities';

describe(funcs.hexToColor, () => {
  test.each([
    ['#FFFFFF', [1, 1, 1]],
    ['ffffff', [1, 1, 1]],
    ['0088ff', [0, 0.53, 1]],
    ['#000000', [0, 0, 0]],
    ['888888', [0.53, 0.53, 0.53]]
  ])('Testing %s', (c, expected) => {
    const result = funcs.hexToColor(c);
    for (let i = 0; i < expected.length; i++) {
      expect(result[i]).toBeCloseTo(expected[i]);
    }
  });

  it('throws an error when an invalid hex string is passed', () => {
    expect(() => funcs.hexToColor('GGGGGG')).toThrowErrorMatchingInlineSnapshot('[Error: hexToColor: Invalid color hex string: GGGGGG]');
  });

  it('throws an error when a non-string is passed', () => {
    expect(() => funcs.hexToColor(123 as any)).toThrowErrorMatchingInlineSnapshot('[Error: hexToColor: Expected a string, got number]');
  });
});

describe(funcs.isFunctionOfLength, () => {
  it('correctly identifies functions with the specified number of parameters', () => {
    const func0 = () => { };
    assert(funcs.isFunctionOfLength(func0, 0));
    expectTypeOf(func0).toEqualTypeOf<() => void>();

    const func1 = (a: number) => a;
    assert(funcs.isFunctionOfLength(func1, 1));
    expectTypeOf(func1).toEqualTypeOf<(a: number) => number>();

    const func2 = (_a: number, _b: string) => { };
    assert(funcs.isFunctionOfLength(func2, 2));
    expectTypeOf(func2).toEqualTypeOf<(a: number, b: string) => void>();

    const func3: unknown = (_a: any) => {};
    if (funcs.isFunctionOfLength(func3, 1)) {
      expectTypeOf(func3).toEqualTypeOf<(a: unknown) => unknown>();
    } else {
      expectTypeOf(func3).toEqualTypeOf<unknown>();
      throw new Error('Type guard failed unexpectedly');
    }
  });
});

describe(funcs.assertFunctionOfLength, () => {
  test('throws InvalidCallbackError', () => {
    expect(() => funcs.assertFunctionOfLength(() => 0, 1, 'foo'))
      .toThrowError('foo: Expected function with 0 parameters, got () => 0.');
  });
});

describe(funcs.isNumberWithinRange, () => {
  describe('non-options overload', () => {
    describe('integer with maximum and minimum', () => {
      const cases: [string, number, boolean][] = [
        ['includes min', 0, true],
        ['includes max', 2, true],
        ['doesn\'t include fractions', 1.5, false],
        ['doesn\'t include NaN', NaN, false],
      ];

      test.each(cases)('%s', (_, val, expected) => {
        expect(funcs.isNumberWithinRange(val, 0, 2)).toEqual(expected);
      });
    });

    describe('integer with minimum only', () => {
      const cases: [string, number, boolean][] = [
        ['includes min', 0, true],
        ['doesn\'t include fractions', 1.5, false],
        ['doesn\'t include NaN', NaN, false],
      ];

      test.each(cases)('%s', (_, val, expected) => {
        expect(funcs.isNumberWithinRange(val, 0)).toEqual(expected);
      });
    });

    describe('number with maximum and minimum', () => {
      const cases: [string, number, boolean][] = [
        ['includes min', 0, true],
        ['includes max', 2, true],
        ['includes fractions', 1.5, true],
        ['doesn\'t include NaN', NaN, false],
      ];

      test.each(cases)('%s', (_, val, expected) => {
        expect(funcs.isNumberWithinRange(val, 0, 2, false)).toEqual(expected);
      });
    });
  });

  describe('options overload', () => {
    describe('integer with maximum and minimum', () => {
      const cases: [string, number, boolean][] = [
        ['includes min', 0, true],
        ['includes max', 2, true],
        ['doesn\'t include fractions', 1.5, false],
        ['doesn\'t include NaN', NaN, false],
      ];

      test.each(cases)('%s', (_, val, expected) => {
        expect(funcs.isNumberWithinRange(val, { min: 0, max: 2 })).toEqual(expected);
      });
    });

    describe('integer with minimum only', () => {
      const cases: [string, number, boolean][] = [
        ['includes min', 0, true],
        ['doesn\'t include fractions', 1.5, false],
        ['doesn\'t include NaN', NaN, false],
      ];

      test.each(cases)('%s', (_, val, expected) => {
        expect(funcs.isNumberWithinRange(val, { min: 0 })).toEqual(expected);
      });
    });

    describe('integer with maximum only', () => {
      const cases: [string, number, boolean][] = [
        ['includes max', 2, true],
        ['doesn\'t include fractions', 1.5, false],
        ['doesn\'t include NaN', NaN, false],
      ];

      test.each(cases)('%s', (_, val, expected) => {
        expect(funcs.isNumberWithinRange(val, { max: 2 })).toEqual(expected);
      });
    });

    describe('number with maximum and minimum', () => {
      const cases: [string, number, boolean][] = [
        ['includes min', 0, true],
        ['includes max', 2, true],
        ['includes fractions', 1.5, true],
        ['doesn\'t include NaN', NaN, false],
      ];

      test.each(cases)('%s', (_, val, expected) => {
        expect(funcs.isNumberWithinRange(val, { min: 0, max: 2, integer: false })).toEqual(expected);
      });
    });
  });
});
