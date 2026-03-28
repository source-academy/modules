import { assert, describe, expect, expectTypeOf, it, test } from 'vitest';
import { hexToColor, isFunctionOfLength } from '../utilities';

describe(hexToColor, () => {
  test.each([
    ['#FFFFFF', [1, 1, 1]],
    ['ffffff', [1, 1, 1]],
    ['0088ff', [0, 0.53, 1]],
    ['#000000', [0, 0, 0]],
    ['888888', [0.53, 0.53, 0.53]]
  ])('Testing %s', (c, expected) => {
    const result = hexToColor(c);
    for (let i = 0; i < expected.length; i++) {
      expect(result[i]).toBeCloseTo(expected[i]);
    }
  });

  it('throws an error when an invalid hex string is passed', () => {
    expect(() => hexToColor('GGGGGG')).toThrowErrorMatchingInlineSnapshot('[Error: hexToColor: Invalid color hex string: GGGGGG]');
  });
});

describe(isFunctionOfLength, () => {
  it('correctly identifies functions with the specified number of parameters', () => {
    const func0 = () => { };
    assert(isFunctionOfLength(func0, 0));
    expectTypeOf(func0).toEqualTypeOf<() => void>();

    const func1 = (a: number) => a;
    assert(isFunctionOfLength(func1, 1));
    expectTypeOf(func1).toEqualTypeOf<(a: number) => number>();

    const func2 = (_a: number, _b: string) => { };
    assert(isFunctionOfLength(func2, 2));
    expectTypeOf(func2).toEqualTypeOf<(a: number, b: string) => void>();

    const func3: unknown = (_a: any) => {};
    if (isFunctionOfLength(func3, 1)) {
      expectTypeOf(func3).toEqualTypeOf<(a: unknown) => unknown>();
    } else {
      expectTypeOf(func3).toEqualTypeOf<unknown>();
      throw new Error('Type guard failed unexpectedly');
    }
  });
});
