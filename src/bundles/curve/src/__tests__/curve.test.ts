import { stringify } from 'js-slang/dist/utils/stringify';
import { describe, expect, it, test } from 'vitest';
import type { Color, Curve } from '../curves_webgl';
import * as funcs from '../functions';

/**
 * Evaluates the curve at 200 points, then
 * returns those points as an array of tuples of numbers
 */
function evaluatePoints(curve: Curve) {
  const points: [number, number, number, Color][] = [];
  for (let i = 0; i < 200; i++) {
    const t = i / 200;
    const { x, y, z, color } = curve(t);
    points.push([x, y, z, color]);
  }

  return points;
}

test('Ensure that invalid curves error gracefully', () => {
  expect(() => funcs.draw_connected(200)(() => 1 as any))
    .toThrow('Expected curve to return a point, got \'1\' at t=0');
});

test('Using 3D render functions with animate_curve should throw errors', () => {
  expect(() => funcs.animate_curve(1, 60, funcs.draw_3D_connected(200), (t0) => (t1) => funcs.make_point(t0, t1)))
    .toThrow('animate_curve cannot be used with 3D draw function!');
});

test('Using 2D render functions with animate_3D_curve should throw errors', () => {
  expect(() => funcs.animate_3D_curve(1, 60, funcs.draw_connected(200), (t0) => (t1) => funcs.make_point(t0, t1)))
    .toThrow('animate_3D_curve cannot be used with 2D draw function!');
});

test('Render functions have nice string representations', () => {
  expect(stringify(funcs.draw_connected(200))).toEqual('<RenderFunction(200)>');
  expect(stringify(funcs.draw_connected_full_view_proportional(400))).toEqual('<RenderFunction(400)>');
  expect(stringify(funcs.draw_3D_connected(400))).toEqual('<3DRenderFunction(400)>');
});

describe('Coloured Points', () => {
  test('make_3D_color_point clamps values', () => {
    const point = funcs.make_3D_color_point(0, 0, 0, 300, -100, 0);
    expect(point.color[0]).toEqual(1);
    expect(point.color[1]).toEqual(0);
    expect(point.color[2]).toEqual(0);
  });

  describe(funcs.r_of, () => {
    it('returns an integer', () => {
      const point = funcs.make_3D_color_point(0, 0, 0, 131, 0, 0);
      expect(funcs.r_of(point)).toEqual(131);
    });

    it('throws when argument is not a point', () => {
      expect(() => funcs.r_of(0 as any)).toThrowError('r_of expects a point as argument');
    });
  });

  describe(funcs.g_of, () => {
    it('returns an integer', () => {
      const point = funcs.make_3D_color_point(0, 0, 0, 0, 20, 0);
      expect(funcs.g_of(point)).toEqual(20);
    });

    it('throws when argument is not a point', () => {
      expect(() => funcs.g_of(0 as any)).toThrowError('g_of expects a point as argument');
    });
  });

  describe(funcs.b_of, () => {
    it('returns an integer', () => {
      const point = funcs.make_3D_color_point(0, 0, 0, 0, 0, 67);
      expect(funcs.b_of(point)).toEqual(67);
    });

    it('throws when argument is not a point', () => {
      expect(() => funcs.b_of(0 as any)).toThrowError('b_of expects a point as argument');
    });
  });
});

describe(funcs.unit_line_at, () => {
  const curve = funcs.unit_line_at(0.5);

  it('actually works', () => {
    const points = evaluatePoints(curve);
    for (const [, y] of points) {
      expect(y).toEqual(0.5);
    }
  });
});

describe(funcs.translate, () => {
  const original = funcs.unit_line_at(0.5);

  test('translation in the x direction', () => {
    const curve = funcs.translate(0.5, 0, 0)(original);
    const points = evaluatePoints(curve);
    for (let i = 0; i < points.length; i++) {
      const [x, y] = points[i];
      expect(x).toBeCloseTo(i / points.length + 0.5);
      expect(y).toEqual(0.5);
    }
  });

  test('translation in the y direction', () => {
    const curve = funcs.translate(0, -0.5, 0)(original);
    const points = evaluatePoints(curve);
    for (const [, y] of points) {
      expect(y).toEqual(0);
    }
  });

  test('points retain colour', () => {
    const curve: Curve = t => funcs.make_color_point(t, 0.5, 255, 127, 0);
    const newCurve = funcs.translate(0.5, 0.5, 0)(curve);

    const points = evaluatePoints(newCurve);
    for (let i = 0; i < points.length; i++) {
      const [x, y,,[r, g]] = points[i];
      expect(x).toBeCloseTo(i / points.length + 0.5);
      expect(y).toEqual(1);

      expect(r).toEqual(1);
      expect(g).toBeCloseTo(0.5);
    }
  });
});

describe(funcs.scale, () => {
  const original = funcs.unit_line_at(0.5);

  test('scaling in the x direction', () => {
    const curve = funcs.scale(0.5, 1, 0)(original);
    const points = evaluatePoints(curve);
    for (let i = 0; i < points.length; i++) {
      const [x, y] = points[i];
      expect(x).toBeCloseTo(i / points.length * 0.5);
      expect(y).toEqual(0.5);
    }
  });

  test('points retain colour', () => {
    const curve: Curve = t => funcs.make_color_point(t, 0.5, 255, 127, 0);
    const newCurve = funcs.scale(1, 1, 0)(curve);

    const points = evaluatePoints(newCurve);
    for (let i = 0; i < points.length; i++) {
      const [x, y,,[r, g]] = points[i];
      expect(x).toBeCloseTo(i / points.length);
      expect(y).toEqual(0.5);

      expect(r).toEqual(1);
      expect(g).toBeCloseTo(0.5);
    }
  });
});

describe(funcs.put_in_standard_position, () => {
  it('actually works', () => {
    const curve: Curve = t => funcs.make_point(-2000 + t, 2000 + t);
    const newCurve = funcs.put_in_standard_position(curve);
    const points = evaluatePoints(newCurve);

    const [x0, y0] = points[0];
    expect(x0).toBeCloseTo(0);
    expect(y0).toBeCloseTo(0);

    const [xn, yn] = points[points.length - 1];
    expect(xn).toBeCloseTo(1, 1);
    expect(yn).toBeCloseTo(0, 1);
  });
});
