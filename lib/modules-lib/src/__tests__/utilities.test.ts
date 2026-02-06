import { describe, expect, it, test } from 'vitest';
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
    expect(() => hexToColor('GGGGGG')).toThrowErrorMatchingInlineSnapshot('[Error: Invalid color hex string: GGGGGG]');
  });
});

describe(isFunctionOfLength, () => {
  it('correctly identifies functions with the specified number of parameters', () => {
    const func0 = () => { };
    expect(isFunctionOfLength(func0, 0)).toBe(true);

    const func1 = (_a: number) => { };
    expect(isFunctionOfLength(func1, 1)).toBe(true);

    const func2 = (_a: number, _b: string) => { };
    expect(isFunctionOfLength(func2, 2)).toBe(true);
  });
});
