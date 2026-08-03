import { mat4 } from 'gl-matrix';
import { describe, expect, test } from 'vitest';
import { deserializeRune, serializeRune } from '../protocol';
import { Rune } from '../rune';

describe('rune protocol', () => {
  test('round-trips serialized rune structures', () => {
    const transformMatrix = mat4.create();
    mat4.translate(transformMatrix, transformMatrix, [0.25, 0.5, 0]);
    const childTransformMatrix = mat4.create();
    mat4.scale(childTransformMatrix, childTransformMatrix, [0.5, 0.5, 1]);

    const rune = Rune.of({
      vertices: new Float32Array([
        0, 0, 0, 1,
        1, 0, 0, 1,
        0, 1, 0, 1
      ]),
      colors: new Float32Array([
        1, 0, 0, 1,
        0, 1, 0, 1,
        0, 0, 1, 1
      ]),
      transformMatrix,
      subRunes: [
        Rune.of({
          vertices: new Float32Array([
            -1, -1, 0, 1,
            0, 1, 0, 1,
            1, -1, 0, 1
          ]),
          transformMatrix: childTransformMatrix,
          hollusionDistance: 0.3
        })
      ],
      hollusionDistance: 0.7
    });
    const serialized = serializeRune(rune);

    expect(serializeRune(deserializeRune(serialized))).toEqual(serialized);
  });
});
