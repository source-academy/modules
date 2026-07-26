import { measureBoundingBox } from '@jscad/modeling/src/measurements';
import { describe, expect, test } from 'vitest';
import { crimson, cube, silver, sphere, torus, union } from '../functions';
import { deserializeSolid, serializeSolid, type SerializedSolid } from '../protocol';
import type { Shape } from '../utilities';

/**
 * Round-tripping through JSON is what actually proves the wire format is plain
 * data: structured clone (what the Conductor channel really uses) accepts a few
 * things JSON does not, so passing this is the stricter result.
 */
function throughTheWire(shape: Shape): SerializedSolid {
  return JSON.parse(JSON.stringify(serializeSolid(shape.solid))) as SerializedSolid;
}

describe('serializeSolid/deserializeSolid', () => {
  const cases = {
    cube: () => cube(silver),
    sphere: () => sphere(silver),
    torus: () => torus(silver),
    union: () => union(cube(silver), sphere(crimson))
  };

  test.for(Object.entries(cases))('%s survives the round trip', ([, makeShape]) => {
    const original = makeShape().solid;
    const restored = deserializeSolid(throughTheWire({ solid: original } as Shape));

    expect(restored.polygons).toHaveLength(original.polygons.length);
    expect(restored.transforms).toStrictEqual([...original.transforms]);
    expect(measureBoundingBox(restored)).toStrictEqual(measureBoundingBox(original));
  });

  test('preserves the geometry-level colour set by the primitives', () => {
    const original = cube(crimson).solid;
    const restored = deserializeSolid(throughTheWire({ solid: original } as Shape));

    // crimson is #AA0000, and colorize normalises RGB to RGBA
    expect(restored.color).toStrictEqual(original.color);
    expect(restored.color).toHaveLength(4);
  });

  test('preserves per-polygon colours produced by boolean operations', () => {
    const original = union(cube(silver), sphere(crimson)).solid;
    const restored = deserializeSolid(throughTheWire({ solid: original } as Shape));

    const originalColours = original.polygons.map(polygon => polygon.color);
    expect(restored.polygons.map(polygon => polygon.color)).toStrictEqual(originalColours);
  });

  test('deep-copies rather than sharing vertex arrays with the Shape', () => {
    const shape = cube(silver);
    const restored = deserializeSolid(serializeSolid(shape.solid));

    expect(restored.polygons[0].vertices[0]).toStrictEqual(shape.solid.polygons[0].vertices[0]);
    expect(restored.polygons[0].vertices[0]).not.toBe(shape.solid.polygons[0].vertices[0]);
    expect(restored.transforms).not.toBe(shape.solid.transforms);
  });

  test('handles a solid with no polygons', () => {
    const empty = deserializeSolid(serializeSolid({
      polygons: [],
      transforms: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    } as unknown as Shape['solid']));

    expect(empty.polygons).toStrictEqual([]);
    expect(empty.color).toBeUndefined();
  });
});
