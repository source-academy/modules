// Need to disable because stringify produces tab characters?
/* eslint-disable @stylistic/no-tabs */
import { callWithoutMetadata } from '@sourceacademy/modules-lib/utilities';
import { stringify } from 'js-slang/dist/utils/stringify';
import { describe, expect, it, test, vi } from 'vitest';
import type { Color, Curve } from '../curves_webgl';
import * as drawers from '../drawers';
import * as funcs from '../functions';
import { AnimatedCurve, type CurveTransformer, type RenderFunctionCreator } from '../types';

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

function sanitizeStringify(value: Curve) {
  const result = stringify(value);
  return result.replaceAll(/__vite_ssr_import_\d+__\./g, '');
};

const getSanitizedError = vi.defineHelper((f: () => any) => {
  try {
    f();
  } catch (error: any) {
    return (error.message as string).replaceAll(/__vite_ssr_import_\d+__\./g, '');
  }
  expect.fail(`${f} did not throw!`);
});

describe('Ensure that invalid curves and animations error gracefully', () => {
  test('Curve that returns non-point should throw error', () => {
    expect(() => drawers.draw_connected(200)(_x => 1 as any))
      .toThrow('Expected curve to return a point, got \'1\' at t=0');
  });

  test('Curve that takes multiple parameters should throw error', () => {
    const error = getSanitizedError(() => drawers.draw_connected(200)(((t: number, u: number) => funcs.make_point(t, u)) as any));
    expect(error).toEqual('RenderFunction: Expected Curve, got (t, u) => make_point(t, u).');
  });

  test('CurveAnimation that doesn\'t return a curve should throw error', () => {
    const anim = new AnimatedCurve(1, 30, ((_t: number) => 0) as any, drawers.draw_connected(200), false);
    expect(() => anim.getFrame(0)).toThrow('CurveAnimation did not return a Curve at timestamp 0');
  });

  test('Using 3D render functions with animate_curve should throw errors', () => {
    expect(() => drawers.animate_curve(1, 60, drawers.draw_3D_connected(200), (t0) => (t1) => funcs.make_point(t0, t1)))
      .toThrow('animate_curve cannot be used with 3D draw function!');
  });

  test('Using 2D render functions with animate_3D_curve should throw errors', () => {
    expect(() => drawers.animate_3D_curve(1, 60, drawers.draw_connected(200), (t0) => (t1) => funcs.make_point(t0, t1)))
      .toThrow('animate_3D_curve cannot be used with 2D draw function!');
  });
});

describe('Render function creators', () => {
  type FunctionNames = keyof (typeof drawers.RenderFunctionCreators);

  const names = Object.getOwnPropertyNames(drawers.RenderFunctionCreators) as FunctionNames[];
  const renderFuncCreators = names.reduce<[FunctionNames, RenderFunctionCreator][]>((res, name) => {
    const value = drawers.RenderFunctionCreators[name];
    if (typeof value !== 'function') return res;
    return [...res, [name, value] as [FunctionNames, RenderFunctionCreator]];
  }, []);

  describe.each(renderFuncCreators)('%s', (name, func) => {
    test('name property is correct', () => {
      expect(func.name).toEqual(name);

      expect(func.isFullView).toEqual(func.name.includes('full_view'));

      if (func.name.includes('full_view_proportional')) {
        expect(func.scaleMode).toEqual('fit');
      } else if (func.name.includes('full_view')) {
        expect(func.scaleMode).toEqual('stretch');
      } else {
        expect(func.scaleMode).toEqual('none');
      }

      if (func.name.includes('points')) {
        expect(func.drawMode).toEqual('points');
      } else if (func.name.includes('connected')) {
        expect(func.drawMode).toEqual('lines');
      } else {
        expect.fail(`Unknown draw mode for render function creator: ${func.name}`);
      }
    });

    it('throws when numPoints is less than 0', () => {
      expect(() => func(-1)).toThrow(
        `${name}: Expected integer ∈ [0, 65535], got -1.`
      );
    });

    it('throws when numPoints is greater than 65535', () => {
      expect(() => func(70000)).toThrow(
        `${name}: Expected integer ∈ [0, 65535], got 70000.`
      );
    });

    it('throws when numPoints is not an integer', () => {
      expect(() => func(3.14)).toThrow(
        `${name}: Expected integer ∈ [0, 65535], got 3.14.`
      );
    });

    test('returned render function throws when called with an invalid curve', () => {
      const creator = func(200);
      expect(() => creator(0 as any)).toThrow('RenderFunction: Expected Curve, got 0.');
    });

    test('returned render functions have nice string representations', () => {
      const renderFunc = func(250);
      if (renderFunc.is3D) {
        expect(stringify(renderFunc)).toEqual('<3DRenderFunction(250)>');
      } else {
        expect(stringify(renderFunc)).toEqual('<RenderFunction(250)>');
      }
    });
  });
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
      const error = getSanitizedError(() => funcs.r_of(0 as any));
      expect(error).toEqual('r_of: Expected Point, got 0.');
    });
  });

  describe(funcs.g_of, () => {
    it('returns an integer', () => {
      const point = funcs.make_3D_color_point(0, 0, 0, 0, 20, 0);
      expect(funcs.g_of(point)).toEqual(20);
    });

    it('throws when argument is not a point', () => {
      const error = getSanitizedError(() => funcs.g_of(0 as any));
      expect(error).toEqual('g_of: Expected Point, got 0.');
    });
  });

  describe(funcs.b_of, () => {
    it('returns an integer', () => {
      const point = funcs.make_3D_color_point(0, 0, 0, 0, 0, 67);
      expect(funcs.b_of(point)).toEqual(67);
    });

    it('throws when argument is not a point', () => {
      const error = getSanitizedError(() => funcs.b_of(0 as any));
      expect(error).toEqual('b_of: Expected Point, got 0.');
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

  it('throws an error when argument is not a number', () => {
    expect(() => funcs.unit_line_at('a' as any))
      .toThrowError('unit_line_at: Expected number, got "a".');
  });

  test('toReplString representation', () => {
    const transformer = funcs.translate(1, 1, 1);
    expect(stringify(transformer)).toEqual('<CurveTransformer>');
  });
});

describe('Curve transformers', () => {
  function testTransformer(f: CurveTransformer, name?: string, checkColour = true) {
    test('toReplString representation', () => {
      expect(stringify(f)).toEqual('<CurveTransformer>');
    });

    test.skipIf(name === undefined)('name', () => {
      expect(f.name).toEqual(name);
    });

    test.skipIf(!checkColour)('points retain colour', () => {
      const curve: Curve = _t => funcs.make_color_point(0.5, 0.5, 255, 127, 0);
      const newCurve = f(curve);

      const points = evaluatePoints(newCurve);
      for (let i = 0; i < points.length; i++) {
        const [, , , [r, g, b]] = points[i];
        expect(r).toEqual(1);
        expect(g).toBeCloseTo(0.5);
        expect(b).toEqual(0);
      }
    });

    it('throws when given not a curve', () => {
      name ??= 'CurveTransformer';

      expect(() => f(0 as any)).toThrow(`${name}: Expected Curve, got 0.`);

      const invalid: any = (x: number, y: number) => x + y;
      expect(() => f(invalid)).toThrow(`${name}: Expected Curve, got (x, y) => x + y.`);
    });
  }

  describe(funcs.compose, () => {
    const composed = funcs.compose(funcs.invert);
    testTransformer(composed);

    it('composes three transformers in left-to-right order', () => {
      const curve: Curve = t => funcs.make_color_point(t, 0, 255, 0, 0);
      const translated = funcs.translate(1, 0, 0);
      const inverted = funcs.invert;
      const translatedBack = funcs.translate(-1, 0, 0);
      const composedThree = callWithoutMetadata(funcs.compose, translated, inverted, translatedBack);

      const pointA = composedThree(curve)(0);
      const pointB = translatedBack(inverted(translated(curve)))(0);

      expect(pointA.x).toEqual(pointB.x);
      expect(pointA.y).toEqual(pointB.y);
      expect(pointA.z).toEqual(pointB.z);
      expect(pointA.color).toEqual(pointB.color);
    });

    it('throws when passed a non-transformer argument', () => {
      expect(() => funcs.compose(0 as any)).toThrow('compose: Expected CurveTransformer for arg 0, got 0.');
    });

    it('returns identity transformer when called with no arguments', () => {
      const curve: Curve = t => funcs.make_color_point(t, t, 255, 0, 0);
      const newCurve = funcs.compose()(curve);

      const oldPoints = evaluatePoints(curve);
      const newPoints = evaluatePoints(newCurve);

      for (let i = 0; i < oldPoints.length; i++) {
        expect(oldPoints[i]).toEqual(newPoints[i]);
      }
    });
  });

  describe(funcs.invert, () => {
    testTransformer(funcs.invert, 'invert');

    it('actually works', () => {
      const curve = funcs.unit_line_at(0.5);
      const newCurve = funcs.invert(curve);

      expect(sanitizeStringify(newCurve)).toEqual('(t) => curve(1 - t)');
    });
  });

  describe(funcs.put_in_standard_position, () => {
    testTransformer(funcs.put_in_standard_position, 'put_in_standard_position');

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

      expect(sanitizeStringify(newCurve)).toMatchInlineSnapshot(`
        "(t) => {
        			const pt = curve(t);
        			return make_3D_color_point(x * x_of(pt), y * y_of(pt), z * z_of(pt), r_of(pt), g_of(pt), b_of(pt));
        		}"
      `);
    });
  });

  describe(funcs.rotate_around_origin_3D, () => {
    const curve: Curve = t => funcs.make_3D_point(t, t, t);
    const transformer = funcs.rotate_around_origin_3D(0, 0, Math.PI);

    testTransformer(transformer);

    it('actually works', () => {
      const newCurve = transformer(curve);
      const points = evaluatePoints(newCurve);

      const [x0, y0, z0] = points[0];

      expect(x0).toBeCloseTo(0);
      expect(y0).toBeCloseTo(0);
      expect(z0).toBeCloseTo(0);

      const [x1, y1, z1] = points[199];

      expect(x1).toBeCloseTo(-1, 1);
      expect(y1).toBeCloseTo(-1, 1);
      expect(z1).toBeCloseTo(1, 1);

      expect(sanitizeStringify(newCurve)).toMatchInlineSnapshot(`
        "(t) => {
        			const pt = curve(t);
        			const coord = [
        				pt.x,
        				pt.y,
        				pt.z
        			];
        			let xf = 0;
        			let yf = 0;
        			let zf = 0;
        			for (let i = 0; i < 3; i += 1) {
        				xf += mat[0][i] * coord[i];
        				yf += mat[1][i] * coord[i];
        				zf += mat[2][i] * coord[i];
        			};
        			return make_3D_color_point(xf, yf, zf, r_of(pt), g_of(pt), z_of(pt));
        		}"
      `);
    });
  });

  describe(funcs.rotate_around_origin, () => {
    const curve: Curve = t => funcs.make_point(t, t);
    const transformer = funcs.rotate_around_origin(Math.PI);

    testTransformer(transformer);

    it('actually works', () => {
      const newCurve = transformer(curve);

      const points = evaluatePoints(newCurve);

      const [x0, y0, z0] = points[0];

      expect(x0).toBeCloseTo(0);
      expect(y0).toBeCloseTo(0);
      expect(z0).toEqual(0);

      const [x1, y1, z1] = points[199];

      expect(x1).toBeCloseTo(-1, 1);
      expect(y1).toBeCloseTo(-1, 1);
      expect(z1).toEqual(0);

      expect(sanitizeStringify(newCurve)).toMatchInlineSnapshot(`
        "(t) => {
        			const pt = curve(t);
        			const pt_x = x_of(pt);
        			const pt_y = y_of(pt);
        			return make_3D_color_point(cth * pt_x - sth * pt_y, sth * pt_x + cth * pt_y, z_of(pt), r_of(pt), g_of(pt), b_of(pt));
        		}"
      `);
    });
  });

  describe(funcs.scale, () => {
    const curve: Curve = t => funcs.make_3D_point(t, t, t);
    const transformer = funcs.scale(1, 2, 3);

    testTransformer(transformer);

    it('actually works', () => {
      const newCurve = transformer(curve);

      const oldPoints = evaluatePoints(curve);
      const newPoints = evaluatePoints(newCurve);

      for (let i = 0; i < 200; i += 10) {
        const [x_old, y_old, z_old] = oldPoints[i];
        const [x_new, y_new, z_new] = newPoints[i];

        expect(x_new).toEqual(x_old);
        expect(y_new).toEqual(y_old * 2);
        expect(z_new).toEqual(z_old * 3);
      }

      expect(sanitizeStringify(newCurve)).toMatchInlineSnapshot(`
        "(t) => {
        			const pt = curve(t);
        			return make_3D_color_point(x * x_of(pt), y * y_of(pt), z * z_of(pt), r_of(pt), g_of(pt), b_of(pt));
        		}"
      `);
    });
  });

  describe(funcs.scale_proportional, () => {
    const curve: Curve = t => funcs.make_3D_point(t, t, t);
    const transformer = funcs.scale_proportional(2);

    testTransformer(transformer);

    it('actually works', () => {
      const newCurve = transformer(curve);

      const oldPoints = evaluatePoints(curve);
      const newPoints = evaluatePoints(newCurve);

      for (let i = 0; i < 200; i += 10) {
        const [x_old, y_old, z_old] = oldPoints[i];
        const [x_new, y_new, z_new] = newPoints[i];

        expect(x_new).toEqual(x_old * 2);
        expect(y_new).toEqual(y_old * 2);
        expect(z_new).toEqual(z_old * 2);
      }

      expect(sanitizeStringify(newCurve)).toMatchInlineSnapshot(`
        "(t) => {
        			const pt = curve(t);
        			return make_3D_color_point(x * x_of(pt), y * y_of(pt), z * z_of(pt), r_of(pt), g_of(pt), b_of(pt));
        		}"
      `);
    });
  });

  describe(funcs.translate, () => {
    const curve: Curve = t => funcs.make_3D_point(t, t, t);
    const transformer = funcs.translate(1, 1, 1);

    testTransformer(transformer);

    it('actually works', () => {
      const newCurve = transformer(curve);

      const oldPoints = evaluatePoints(curve);
      const newPoints = evaluatePoints(newCurve);

      for (let i = 0; i < 200; i += 10) {
        const [x_old, y_old, z_old] = oldPoints[i];
        const [x_new, y_new, z_new] = newPoints[i];

        expect(x_old + 1).toBeCloseTo(x_new);
        expect(y_old + 1).toBeCloseTo(y_new);
        expect(z_old + 1).toBeCloseTo(z_new);
      }

      expect(sanitizeStringify(newCurve)).toMatchInlineSnapshot(`
        "(t) => {
        			const pt = curve(t);
        			return make_3D_color_point(x0 + x_of(pt), y0 + y_of(pt), z0 + z_of(pt), r_of(pt), g_of(pt), b_of(pt));
        		}"
      `);
    });
  });

  describe(funcs.rainbow, () => {
    const transformer = funcs.rainbow(2, 0);

    testTransformer(transformer, 'rainbow', false);

    it('actually works', () => {
      const curve: Curve = _t => funcs.make_3D_color_point(0, 0, 0, 255, 255, 255);
      const newCurve = transformer(curve);

      const c0 = newCurve(0).color;
      const c25 = newCurve(0.25).color;
      const c5 = newCurve(0.5).color;

      expect(c0).not.toEqual(c25);
      expect(c25).not.toEqual(c5);
    });

    it('supports a phase offset', () => {
      const curve: Curve = _t => funcs.make_3D_color_point(0, 0, 0, 255, 255, 255);
      const newCurve = funcs.rainbow(1, 0.5)(curve);

      const c0 = newCurve(0).color;
      const c5 = newCurve(0.5).color;

      expect(c0).not.toEqual(c5);
    });

    it('throws when repeats is not a number', () => {
      expect(() => funcs.rainbow('a' as any, 0)).toThrow('rainbow: Expected number ≥ 0 for repeats, got "a".');
    });

    it('throws when phase is not a number', () => {
      expect(() => funcs.rainbow(1, 'a' as any)).toThrow('rainbow: Expected number for phase, got "a".');
    });
  });

  test('toReplString representation', () => {
    const transformer = funcs.put_in_standard_position;
    expect(stringify(transformer)).toEqual('<CurveTransformer>');
  });

  test('name', () => {
    expect(funcs.put_in_standard_position.name).toEqual('put_in_standard_position');
  });
});
