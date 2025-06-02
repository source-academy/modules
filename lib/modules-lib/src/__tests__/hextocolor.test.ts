import { describe, expect, test } from 'vitest';
import { hexToColor } from '../utilities';

describe('Test hexToColor', () => {
  test.each([
    ['#FFFFFF', [1, 1, 1]],
    ['ffffff', [1, 1, 1]],
    ['0088ff', [0, 0.53, 1]],
    ['#000000', [0, 0, 0]],
    ['#GGGGGG', [0, 0, 0]],
    ['888888', [0.53, 0.53, 0.53]]
  ])('Testing %s', (c, expected) => {
    const result = hexToColor(c);
    for (let i = 0; i < expected.length; i++) {
      expect(result[i]).toBeCloseTo(expected[i]);
    }
  });
});
