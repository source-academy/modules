// Need to disable because stringify produces tab characters?
/* eslint-disable @stylistic/no-tabs */
import { stringify } from 'js-slang/dist/utils/stringify';
import { describe, expect, it, test as baseTest, vi } from 'vitest';
import { Point, type Color, type Curve } from '../curves_webgl';
import * as drawers from '../drawers';
import * as funcs from '../functions';
import type { CurveTransformer, RenderFunctionCreator } from '../types';
import { DataType, type IDataHandler, type IFunctionSignature, type TypedValue } from '@sourceacademy/conductor/types';
import { TestDataHandler, callClosure, runAsyncGenerator } from '@sourceacademy/modules-testplugin';
/**
 * Evaluates the curve at 200 points, then
 * returns those points as an array of tuples of numbers
 */
async function* evaluatePoints(evaluator: IDataHandler, curve: Curve) {
  const points: [number, number, number, Color][] = [];
  for (let i = 0; i < 200; i++) {
    const t = i / 200;
    const pointId = yield* evaluator.closure_call(curve, [{ value: t, type: DataType.NUMBER }], DataType.OPAQUE);
    const point = await evaluator.opaque_get(pointId as TypedValue<DataType.OPAQUE>);
    const { x, y, z, color } = point;
    points.push([x, y, z, color]);
  }

  return points;
}

const getSanitizedError = vi.defineHelper((f: () => any) => {
  try {
    f();
  } catch (error: any) {
    return (error.message as string).replaceAll(/__vite_ssr_import_\d+__\./g, '');
  }
  expect.fail(`${f} did not throw!`);
});

const test = baseTest.extend('handler', () => new TestDataHandler());
const invalidCurveMessage =
  'The provided curve is not a valid Curve function. ' +
  'A Curve function must take exactly one parameter (a number t between 0 and 1) ' +
  'and return a Point or 3D Point depending on whether it is a 2D or 3D curve.';

describe('Ensure that invalid curves and animations error gracefully', () => {
  test('Curve that returns non-point should throw error', async ({ handler }) => {
    const fakeCurve = await handler.closure_make(
      { args: [DataType.NUMBER] as const, returnType: DataType.OPAQUE },
      async function* (_t) {
        return await handler.opaque_make(Math.random());
      }
    );
    await expect(runAsyncGenerator(drawers.draw_connected(handler, 200)(fakeCurve)))
      .rejects.toThrow('Expected curve to return a point');
  });

  test('Curve that takes multiple parameters should throw error', async ({ handler }) => {
    const fakeCurve = await handler.closure_make(
      {
        args: [DataType.NUMBER, DataType.NUMBER] as const,
        returnType: DataType.OPAQUE
      },
      async function* (_t, _u) {
        return await handler.opaque_make(funcs.make_point(0, 0));
      }
    );

    await expect(runAsyncGenerator(drawers.draw_connected(handler, 200)(fakeCurve as Curve)))
      .rejects.toThrow(invalidCurveMessage);
  });

  test('CurveAnimation that doesn\'t return a curve should throw error', async ({ handler }) => {
    const anim = await handler.closure_make(
      { args: [DataType.NUMBER] as const, returnType: DataType.CLOSURE },
      async function* (t0) {
        return await handler.closure_make(
          { args: [DataType.NUMBER] as const, returnType: DataType.OPAQUE },
          async function* (_t1) {
            return await handler.opaque_make(Math.random());
          }
        );
      }
    );
    await expect(runAsyncGenerator(
      drawers.animate_curve(handler, 1, 60, drawers.draw_connected(handler, 200), anim)
    )).rejects.toThrow('Expected curve to return a point');
  });

  test('Using 3D render functions with animate_curve should throw errors', async ({ handler }) => {
    const anim = await handler.closure_make(
      { args: [DataType.NUMBER] as const, returnType: DataType.CLOSURE },
      async function* (t0: TypedValue<DataType.NUMBER>) {
        return await handler.closure_make(
          { args: [DataType.NUMBER] as const, returnType: DataType.CLOSURE },
          async function* (t1: TypedValue<DataType.NUMBER>) {
            return await handler.opaque_make(
              { type: DataType.OPAQUE, value: funcs.make_3D_point(t0.value, t1.value, 0) }
            );
          }
        );
      });

    await expect(runAsyncGenerator(
      drawers.animate_curve(handler, 1, 60, drawers.draw_3D_connected(handler, 200), anim)
    ))
      .rejects.toThrow('animate_curve cannot be used with 3D draw function!');
  });

  test('Using 2D render functions with animate_3D_curve should throw errors', async ({ handler }) => {
    const anim = await handler.closure_make(
      { args: [DataType.NUMBER] as const, returnType: DataType.CLOSURE },
      async function* (t0: TypedValue<DataType.NUMBER>) {
        return await handler.closure_make(
          { args: [DataType.NUMBER] as const, returnType: DataType.CLOSURE },
          async function* (t1: TypedValue<DataType.NUMBER>) {
            return await handler.opaque_make(
              { type: DataType.OPAQUE, value: funcs.make_3D_point(t0.value, t1.value, 0) }
            );
          }
        );
      });

    await expect(runAsyncGenerator(
      drawers.animate_3D_curve(handler, 1, 60, drawers.draw_connected(handler, 200), anim)
    ))
      .rejects.toThrow('animate_3D_curve cannot be used with 2D draw function!');
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

    test('throws when numPoints is less than 0', ({ handler }) => {
      expect(() => func(handler, -1)).toThrow(
        `${name}: The number of points must be a positive integer less than or equal to 65535. Got: -1`
      );
    });

    test('throws when numPoints is greater than 65535', ({ handler }) => {
      expect(() => func(handler, 70000)).toThrow(
        `${name}: The number of points must be a positive integer less than or equal to 65535. Got: 70000`
      );
    });

    test('throws when numPoints is not an integer', ({ handler }) => {
      expect(() => func(handler, 3.14)).toThrow(
        `${name}: The number of points must be a positive integer less than or equal to 65535. Got: 3.14`
      );
    });

    test('returned render function throws when called with an invalid curve', async ({ handler }) => {
      const creator = func(handler, 200);
      await expect(runAsyncGenerator(creator(0 as any))).rejects.toThrow(invalidCurveMessage);
    });

    test('returned render functions have nice string representations', ({ handler }) => {
      const renderFunc = func(handler, 250);
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

describe(funcs.unit_line_at, async () => {
  const handler = new TestDataHandler();
  const curve = await runAsyncGenerator(funcs.unit_line_at(handler, { type: DataType.NUMBER, value: 0.5 }));

  it('actually works', async () => {
    const points = await runAsyncGenerator(evaluatePoints(handler, curve));
    for (const [, y] of points) {
      expect(y).toEqual(0.5);
    }
  });

});

describe('Curve transformers', () => {
  type TransformerFactory = (handler: TestDataHandler) => Promise<CurveTransformer>;
  type TransformerFunction = (
    evaluator: IDataHandler,
    curve: Curve
  ) => AsyncGenerator<void, Curve, undefined>;

  const transformerSignature = {
    args: [DataType.CLOSURE] as const,
    returnType: DataType.CLOSURE
  } satisfies IFunctionSignature<[DataType.CLOSURE], DataType.CLOSURE>;

  function makeCurve(handler: TestDataHandler, func: (t: number) => Point) {
    return handler.closure_make(
      { args: [DataType.NUMBER] as const, returnType: DataType.OPAQUE },
      async function* (t) {
        return await handler.opaque_make(func(t.value));
      }
    );
  }

  function makeTransformer(handler: TestDataHandler, func: TransformerFunction) {
    return handler.closure_make(
      transformerSignature,
      (curve: Curve) => func(handler, curve)
    );
  }

  async function applyTransformer(
    handler: TestDataHandler,
    transformer: CurveTransformer,
    curve: Curve
  ): Promise<Curve> {
    return await callClosure(
      handler,
      transformer as TypedValue<DataType.CLOSURE, DataType.CLOSURE>,
      [curve],
      DataType.CLOSURE
    );
  }

  async function pointAt(handler: TestDataHandler, curve: Curve, t: number): Promise<Point> {
    const point = await callClosure(
      handler,
      curve as TypedValue<DataType.CLOSURE, DataType.OPAQUE>,
      [{ type: DataType.NUMBER, value: t }],
      DataType.OPAQUE
    );
    return await handler.opaque_get(point) as Point;
  }

  function testTransformer(createTransformer: TransformerFactory, checkColour = true) {
    test('is a unary closure', async ({ handler }) => {
      const transformer = await createTransformer(handler);
      expect(await handler.closure_arity(transformer)).toEqual(1);
    });

    test.skipIf(!checkColour)('points retain colour', async ({ handler }) => {
      const transformer = await createTransformer(handler);
      const curve = await makeCurve(
        handler,
        () => funcs.make_color_point(0.5, 0.5, 255, 127, 0)
      );
      const newCurve = await applyTransformer(handler, transformer, curve);
      const points = await runAsyncGenerator(evaluatePoints(handler, newCurve));

      for (const [, , , [r, g, b]] of points) {
        expect(r).toEqual(1);
        expect(g).toBeCloseTo(0.5);
        expect(b).toEqual(0);
      }
    });
  }

  describe(funcs.compose, () => {
    testTransformer(async handler => {
      const inverted = await makeTransformer(handler, funcs.invert);
      return await runAsyncGenerator(funcs.compose(handler, [inverted]));
    });

    test('composes three transformers in left-to-right order', async ({ handler }) => {
      const curve = await makeCurve(handler, t => funcs.make_color_point(t, 0, 255, 0, 0));
      const translated = await runAsyncGenerator(funcs.translate(handler, 1, 0, 0));
      const inverted = await makeTransformer(handler, funcs.invert);
      const translatedBack = await runAsyncGenerator(funcs.translate(handler, -1, 0, 0));
      const composedThree = await runAsyncGenerator(
        funcs.compose(handler, [translated, inverted, translatedBack])
      );

      const composedCurve = await applyTransformer(handler, composedThree, curve);
      const pointA = await pointAt(handler, composedCurve, 0);
      const translatedCurve = await applyTransformer(handler, translated, curve);
      const invertedCurve = await applyTransformer(handler, inverted, translatedCurve);
      const translatedBackCurve = await applyTransformer(handler, translatedBack, invertedCurve);
      const pointB = await pointAt(handler, translatedBackCurve, 0);

      expect(pointA.x).toEqual(pointB.x);
      expect(pointA.y).toEqual(pointB.y);
      expect(pointA.z).toEqual(pointB.z);
      expect(pointA.color).toEqual(pointB.color);
    });

    test('returns identity transformer when called with no arguments', async ({ handler }) => {
      const curve = await makeCurve(handler, t => funcs.make_color_point(t, t, 255, 0, 0));
      const identity = await runAsyncGenerator(funcs.compose(handler, []));
      const newCurve = await applyTransformer(handler, identity, curve);

      const oldPoints = await runAsyncGenerator(evaluatePoints(handler, curve));
      const newPoints = await runAsyncGenerator(evaluatePoints(handler, newCurve));

      expect(newPoints).toEqual(oldPoints);
    });
  });

  describe(funcs.invert, () => {
    testTransformer(handler => makeTransformer(handler, funcs.invert));

    test('actually works', async ({ handler }) => {
      const curve = await runAsyncGenerator(
        funcs.unit_line_at(handler, { type: DataType.NUMBER, value: 0.5 })
      );
      const newCurve = await runAsyncGenerator(funcs.invert(handler, curve));

      expect(await pointAt(handler, newCurve, 0)).toMatchObject({ x: 1, y: 0.5 });
      expect(await pointAt(handler, newCurve, 1)).toMatchObject({ x: 0, y: 0.5 });
    });
  });

  describe(funcs.put_in_standard_position, () => {
    testTransformer(handler => makeTransformer(handler, funcs.put_in_standard_position));

    test('actually works', async ({ handler }) => {
      const curve = await makeCurve(handler, t => funcs.make_point(-2000 + t, 2000 + t));
      const newCurve = await runAsyncGenerator(funcs.put_in_standard_position(handler, curve));
      const points = await runAsyncGenerator(evaluatePoints(handler, newCurve));

      const [x0, y0] = points[0];
      expect(x0).toBeCloseTo(0);
      expect(y0).toBeCloseTo(0);

      const [xn, yn] = points[points.length - 1];
      expect(xn).toBeCloseTo(1, 1);
      expect(yn).toBeCloseTo(0, 1);
    });
  });

  describe(funcs.rotate_around_origin_3D, () => {
    testTransformer(handler => runAsyncGenerator(
      funcs.rotate_around_origin_3D(handler, 0, 0, Math.PI)
    ));

    test('actually works', async ({ handler }) => {
      const curve = await makeCurve(handler, t => funcs.make_3D_point(t, t, t));
      const transformer = await runAsyncGenerator(
        funcs.rotate_around_origin_3D(handler, 0, 0, Math.PI)
      );
      const newCurve = await applyTransformer(handler, transformer, curve);
      const points = await runAsyncGenerator(evaluatePoints(handler, newCurve));

      const [x0, y0, z0] = points[0];

      expect(x0).toBeCloseTo(0);
      expect(y0).toBeCloseTo(0);
      expect(z0).toBeCloseTo(0);

      const [x1, y1, z1] = points[199];

      expect(x1).toBeCloseTo(-1, 1);
      expect(y1).toBeCloseTo(-1, 1);
      expect(z1).toBeCloseTo(1, 1);
    });
  });

  describe(funcs.rotate_around_origin, () => {
    testTransformer(handler => runAsyncGenerator(funcs.rotate_around_origin(handler, Math.PI)));

    test('actually works', async ({ handler }) => {
      const curve = await makeCurve(handler, t => funcs.make_point(t, t));
      const transformer = await runAsyncGenerator(funcs.rotate_around_origin(handler, Math.PI));
      const newCurve = await applyTransformer(handler, transformer, curve);
      const points = await runAsyncGenerator(evaluatePoints(handler, newCurve));

      const [x0, y0, z0] = points[0];

      expect(x0).toBeCloseTo(0);
      expect(y0).toBeCloseTo(0);
      expect(z0).toEqual(0);

      const [x1, y1, z1] = points[199];

      expect(x1).toBeCloseTo(-1, 1);
      expect(y1).toBeCloseTo(-1, 1);
      expect(z1).toEqual(0);
    });
  });

  describe(funcs.scale, () => {
    testTransformer(handler => runAsyncGenerator(funcs.scale(handler, 1, 2, 3)));

    test('actually works', async ({ handler }) => {
      const curve = await makeCurve(handler, t => funcs.make_3D_point(t, t, t));
      const transformer = await runAsyncGenerator(funcs.scale(handler, 1, 2, 3));
      const newCurve = await applyTransformer(handler, transformer, curve);
      const oldPoints = await runAsyncGenerator(evaluatePoints(handler, curve));
      const newPoints = await runAsyncGenerator(evaluatePoints(handler, newCurve));

      for (let i = 0; i < 200; i += 10) {
        const [x_old, y_old, z_old] = oldPoints[i];
        const [x_new, y_new, z_new] = newPoints[i];

        expect(x_new).toEqual(x_old);
        expect(y_new).toEqual(y_old * 2);
        expect(z_new).toEqual(z_old * 3);
      }
    });
  });

  describe(funcs.scale_proportional, () => {
    testTransformer(handler => runAsyncGenerator(funcs.scale_proportional(handler, 2)));

    test('actually works', async ({ handler }) => {
      const curve = await makeCurve(handler, t => funcs.make_3D_point(t, t, t));
      const transformer = await runAsyncGenerator(funcs.scale_proportional(handler, 2));
      const newCurve = await applyTransformer(handler, transformer, curve);
      const oldPoints = await runAsyncGenerator(evaluatePoints(handler, curve));
      const newPoints = await runAsyncGenerator(evaluatePoints(handler, newCurve));

      for (let i = 0; i < 200; i += 10) {
        const [x_old, y_old, z_old] = oldPoints[i];
        const [x_new, y_new, z_new] = newPoints[i];

        expect(x_new).toEqual(x_old * 2);
        expect(y_new).toEqual(y_old * 2);
        expect(z_new).toEqual(z_old * 2);
      }
    });
  });

  describe(funcs.translate, () => {
    testTransformer(handler => runAsyncGenerator(funcs.translate(handler, 1, 1, 1)));

    test('actually works', async ({ handler }) => {
      const curve = await makeCurve(handler, t => funcs.make_3D_point(t, t, t));
      const transformer = await runAsyncGenerator(funcs.translate(handler, 1, 1, 1));
      const newCurve = await applyTransformer(handler, transformer, curve);
      const oldPoints = await runAsyncGenerator(evaluatePoints(handler, curve));
      const newPoints = await runAsyncGenerator(evaluatePoints(handler, newCurve));

      for (let i = 0; i < 200; i += 10) {
        const [x_old, y_old, z_old] = oldPoints[i];
        const [x_new, y_new, z_new] = newPoints[i];

        expect(x_old + 1).toBeCloseTo(x_new);
        expect(y_old + 1).toBeCloseTo(y_new);
        expect(z_old + 1).toBeCloseTo(z_new);
      }
    });
  });

  describe(funcs.rainbow, () => {
    testTransformer(handler => runAsyncGenerator(funcs.rainbow(handler, 2, 0)), false);

    test('actually works', async ({ handler }) => {
      const transformer = await runAsyncGenerator(funcs.rainbow(handler, 2, 0));
      const curve = await makeCurve(
        handler,
        () => funcs.make_3D_color_point(0, 0, 0, 255, 255, 255)
      );
      const newCurve = await applyTransformer(handler, transformer, curve);
      const c0 = (await pointAt(handler, newCurve, 0)).color;
      const c25 = (await pointAt(handler, newCurve, 0.25)).color;
      const c5 = (await pointAt(handler, newCurve, 0.5)).color;

      expect(c0).not.toEqual(c25);
      expect(c25).not.toEqual(c5);
    });

    test('supports a phase offset', async ({ handler }) => {
      const transformer = await runAsyncGenerator(funcs.rainbow(handler, 1, 0.5));
      const curve = await makeCurve(
        handler,
        () => funcs.make_3D_color_point(0, 0, 0, 255, 255, 255)
      );
      const newCurve = await applyTransformer(handler, transformer, curve);
      const c0 = (await pointAt(handler, newCurve, 0)).color;
      const c5 = (await pointAt(handler, newCurve, 0.5)).color;

      expect(c0).not.toEqual(c5);
    });

    test('throws when repeats is not a number', async ({ handler }) => {
      await expect(runAsyncGenerator(funcs.rainbow(handler, 'a' as any, 0)))
        .rejects.toThrow('rainbow: Expected number ≥ 0 for repeats, got "a".');
    });

    test('throws when phase is not a number', async ({ handler }) => {
      await expect(runAsyncGenerator(funcs.rainbow(handler, 1, 'a' as any)))
        .rejects.toThrow('rainbow: Expected number for phase, got "a".');
    });
  });
});
