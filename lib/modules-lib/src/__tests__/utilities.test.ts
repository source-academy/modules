/* @vitest browser: false */

import { describe, expect, it, test } from 'vitest';
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
