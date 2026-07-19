import { DataType, type IDataHandler, type TypedValue } from '@sourceacademy/conductor/types';
import { clamp } from 'es-toolkit';
import { Point, type Curve } from './curves_webgl';
import type { CurveTransformer } from './types';
import { assertNumberWithinRange, hueToRgb, wrapFunction } from '@sourceacademy/modules-lib/utilities';
import { InvalidParameterTypeError } from '@sourceacademy/modules-lib/errors';

function throwIfNotPoint(obj: unknown, func_name: string): asserts obj is Point {
  if (!(obj instanceof Point)) {
    throw new InvalidParameterTypeError('Point', obj, func_name);
  }
}

async function defineCurveTransformer(evaluator: IDataHandler, f: (arg: Point, t: number) => AsyncGenerator<void, Point, unknown>, name?: string): Promise<CurveTransformer> {
  return await evaluator.closure_make(
    { args: [DataType.CLOSURE] as const, returnType: DataType.CLOSURE },
    async function* (curve) {
      return await evaluator.closure_make(
        { args: [DataType.NUMBER] as const, returnType: DataType.OPAQUE },
        async function* (t) {
          const pointId = yield* evaluator.closure_call(curve, [t], DataType.OPAQUE);
          const point = await evaluator.opaque_get(pointId as TypedValue<DataType.OPAQUE>);
          return await evaluator.opaque_make(yield* f(point, t.value));
        }
      );
    }
  );
}

class CurveFunctions {
  static make_point(x: number, y: number): Point {
    assertNumberWithinRange(x, { func_name: CurveFunctions.make_point.name, param_name: 'x', integer: false });
    assertNumberWithinRange(y, { func_name: CurveFunctions.make_point.name, param_name: 'y', integer: false });

    return new Point(x, y, 0, [0, 0, 0, 1]);
  }

  static make_3D_point(x: number, y: number, z: number): Point {
    assertNumberWithinRange(x, { func_name: CurveFunctions.make_3D_point.name, param_name: 'x', integer: false });
    assertNumberWithinRange(y, { func_name: CurveFunctions.make_3D_point.name, param_name: 'y', integer: false });
    assertNumberWithinRange(z, { func_name: CurveFunctions.make_3D_point.name, param_name: 'z', integer: false });

    return new Point(x, y, z, [0, 0, 0, 1]);
  }

  static make_color_point(
    x: number,
    y: number,
    r: number,
    g: number,
    b: number
  ): Point {
    r = clamp(r, 0, 255);
    g = clamp(g, 0, 255);
    b = clamp(b, 0, 255);

    return new Point(x, y, 0, [r / 255, g / 255, b / 255, 1]);
  }

  static make_3D_color_point(
    x: number,
    y: number,
    z: number,
    r: number,
    g: number,
    b: number
  ): Point {
    r = clamp(r, 0, 255);
    g = clamp(g, 0, 255);
    b = clamp(b, 0, 255);

    return new Point(x, y, z, [r / 255, g / 255, b / 255, 1]);
  }

  static async* connect_ends(evaluator: IDataHandler, curve1: Curve, curve2: Curve): AsyncGenerator<void, Curve, undefined> {
    const startPointOfCurve2Id = (yield* evaluator.closure_call(curve2, [{ type: DataType.NUMBER, value: 0 }], DataType.OPAQUE)) as TypedValue<DataType.OPAQUE>;
    const endPointOfCurve1Id = (yield* evaluator.closure_call(curve1, [{ type: DataType.NUMBER, value: 1 }], DataType.OPAQUE)) as TypedValue<DataType.OPAQUE>;

    const startPointOfCurve2 = await evaluator.opaque_get(startPointOfCurve2Id);
    const endPointOfCurve1 = await evaluator.opaque_get(endPointOfCurve1Id);

    return yield* connect_rigidly(
      evaluator,
      curve1,
      (yield* evaluator.closure_call(yield* translate(
        evaluator,
        x_of(endPointOfCurve1) - x_of(startPointOfCurve2),
        y_of(endPointOfCurve1) - y_of(startPointOfCurve2),
        z_of(endPointOfCurve1) - z_of(startPointOfCurve2)
      ), [curve2], DataType.CLOSURE)) as TypedValue<DataType.CLOSURE>
    );
  }

  static async* connect_rigidly(evaluator: IDataHandler, curve1: Curve, curve2: Curve): AsyncGenerator<void, Curve, undefined> {
    return await evaluator.closure_make(
      { args: [DataType.NUMBER] as const, returnType: DataType.OPAQUE },
      async function* (t) {
        return t.value < 1 / 2
          ? yield* evaluator.closure_call(curve1, [{ type: DataType.NUMBER, value: 2 * t.value }], DataType.OPAQUE)
          : yield* evaluator.closure_call(curve2, [{ type: DataType.NUMBER, value: 2 * t.value - 1 }], DataType.OPAQUE);
      }
    );
  }

  static async* translate(evaluator: IDataHandler, x0: number, y0: number, z0: number): AsyncGenerator<void, CurveTransformer, undefined> {
    return await evaluator.closure_make(
      { args: [DataType.CLOSURE] as const, returnType: DataType.CLOSURE },
      async function* (curve) {
        return await evaluator.closure_make(
          { args: [DataType.NUMBER] as const, returnType: DataType.OPAQUE },
          async function* (t) {
            const ctId = yield* evaluator.closure_call(curve, [t], DataType.OPAQUE);
            const ct = await evaluator.opaque_get(ctId as TypedValue<DataType.OPAQUE>);
            throwIfNotPoint(ct, translate.name);
            return await evaluator.opaque_make(new Point(
              x0 + ct.x,
              y0 + ct.y,
              z0 + ct.z,
              [ct.color[0], ct.color[1], ct.color[2], 1]
            ));
          }
        );
      }
    );
  }

  static async* rainbow(evaluator: IDataHandler, repeats: number, phase: number): AsyncGenerator<void, CurveTransformer, undefined> {
    assertNumberWithinRange(repeats, CurveFunctions.rainbow.name, 0, undefined, false, 'repeats');
    assertNumberWithinRange(phase, CurveFunctions.rainbow.name, undefined, undefined, false, 'phase');

    return defineCurveTransformer(evaluator, async function* (pt, t) {
      const [r, g, b] = hueToRgb((t * repeats + phase) % 1);

      return make_3D_color_point(
        x_of(pt),
        y_of(pt),
        z_of(pt),
        r,
        g,
        b
      );
    });
  }

  static async* invert(evaluator: IDataHandler, original: Curve): AsyncGenerator<void, Curve, undefined> {
    return await evaluator.closure_make(
      { args: [DataType.NUMBER] as const, returnType: DataType.OPAQUE },
      async function* (t) {
        return yield* evaluator.closure_call(original, [{ type: DataType.NUMBER, value: 1 - t.value }], DataType.OPAQUE);
      }
    );
  }

  static async* put_in_standard_position(evaluator: IDataHandler, curve: Curve): AsyncGenerator<void, Curve, undefined> {
    const start_point_id = yield* evaluator.closure_call(curve, [{ type: DataType.NUMBER, value: 0 }], DataType.OPAQUE);
    const start_point = await evaluator.opaque_get(start_point_id as TypedValue<DataType.OPAQUE>);
    const curve_started_at_origin = (yield* evaluator.closure_call(yield* translate(
      evaluator,
      -x_of(start_point),
      -y_of(start_point),
      0
    ), [curve], DataType.CLOSURE)) as TypedValue<DataType.CLOSURE>;
    const new_end_point_id = yield* evaluator.closure_call(curve_started_at_origin, [{ type: DataType.NUMBER, value: 1 }], DataType.OPAQUE);
    const new_end_point = await evaluator.opaque_get(new_end_point_id as TypedValue<DataType.OPAQUE>);
    const theta = Math.atan2(y_of(new_end_point), x_of(new_end_point));
    const curve_ended_at_x_axis = (yield* evaluator.closure_call(yield* rotate_around_origin_3D(
      evaluator,
      0,
      0,
      -theta
    ), [curve_started_at_origin], DataType.CLOSURE)) as TypedValue<DataType.CLOSURE>;
    const end_point_id = (yield* evaluator.closure_call(curve_ended_at_x_axis, [{ type: DataType.NUMBER, value: 1 }], DataType.OPAQUE)) as TypedValue<DataType.OPAQUE>;
    const end_point_on_x_axis = x_of(await evaluator.opaque_get(end_point_id));
    return (yield* evaluator.closure_call(yield* scale_proportional(evaluator, 1 / end_point_on_x_axis), [curve_ended_at_x_axis], DataType.CLOSURE)) as TypedValue<DataType.CLOSURE>;
  };

  static async* rotate_around_origin_3D(evaluator: IDataHandler, a: number, b: number, c: number): AsyncGenerator<void, CurveTransformer, undefined> {
    const cthx = Math.cos(a);
    const sthx = Math.sin(a);

    assertNumberWithinRange(b, { func_name: CurveFunctions.rotate_around_origin_3D.name, integer: false, param_name: 'b' });
    const cthy = Math.cos(b);
    const sthy = Math.sin(b);

    assertNumberWithinRange(c, { func_name: CurveFunctions.rotate_around_origin_3D.name, integer: false, param_name: 'c' });
    const cthz = Math.cos(c);
    const sthz = Math.sin(c);
    const mat = [
      [
        cthz * cthy,
        cthz * sthy * sthx - sthz * cthx,
        cthz * sthy * cthx + sthz * sthx
      ],
      [
        sthz * cthy,
        sthz * sthy * sthx + cthz * cthx,
        sthz * sthy * cthx - cthz * sthx
      ],
      [-sthy, cthy * sthx, cthy * cthx]
    ];


    return defineCurveTransformer(evaluator, async function* (ct) {
      throwIfNotPoint(ct, rotate_around_origin_3D.name);
      const coord = [ct.x, ct.y, ct.z];
      let xf = 0;
      let yf = 0;
      let zf = 0;
      for (let i = 0; i < 3; i += 1) {
        xf += mat[0][i] * coord[i];
        yf += mat[1][i] * coord[i];
        zf += mat[2][i] * coord[i];
      }
      const newPoint = new Point(xf, yf, zf, [ct.color[0], ct.color[1], ct.color[2], 1]);
      return newPoint;
    }
    );
  }

  static async* rotate_around_origin(evaluator: IDataHandler, a: number): AsyncGenerator<void, CurveTransformer, undefined> {
    // 1 args
    const cth = Math.cos(a);
    const sth = Math.sin(a);

    return defineCurveTransformer(
      evaluator,
      async function* (ct) {
        throwIfNotPoint(ct, rotate_around_origin.name);
        return new Point(
          cth * ct.x - sth * ct.y,
          sth * ct.x + cth * ct.y,
          ct.z,
          [ct.color[0], ct.color[1], ct.color[2], 1]
        );
      }
    );
  }

  static async* scale(evaluator: IDataHandler, x: number, y: number, z: number): AsyncGenerator<void, CurveTransformer, undefined> {
    return defineCurveTransformer(evaluator, async function* (ct) {
      throwIfNotPoint(ct, scale.name);
      return new Point(
        x * ct.x,
        y * ct.y,
        z * ct.z,
        [ct.color[0], ct.color[1], ct.color[2], 1]
      );
    });
  }

  static async* scale_proportional(evaluator: IDataHandler, s: number): AsyncGenerator<void, CurveTransformer, undefined> {
    return yield* scale(evaluator, s, s, s);
  }

  static async* compose(evaluator: IDataHandler, transformers: CurveTransformer[]): AsyncGenerator<void, CurveTransformer, undefined> {
    return await evaluator.closure_make(
      { args: [DataType.CLOSURE] as const, returnType: DataType.CLOSURE },
      async function* (curve) {
        let transformedCurve = curve;
        for (const transformer of transformers) {
          transformedCurve = yield* evaluator.closure_call(
            transformer as TypedValue<DataType.CLOSURE, DataType.CLOSURE>,
            [transformedCurve],
            DataType.CLOSURE
          );
        }
        return transformedCurve;
      }
    );
  }

  static x_of(pt: Point): number {
    throwIfNotPoint(pt, x_of.name);
    return pt.x;
  }

  static y_of(pt: Point): number {
    throwIfNotPoint(pt, y_of.name);
    return pt.y;
  }

  static z_of(pt: Point): number {
    throwIfNotPoint(pt, z_of.name);
    return pt.z;
  }

  static r_of(pt: Point): number {
    throwIfNotPoint(pt, r_of.name);
    return Math.floor(pt.color[0] * 255);
  }

  static g_of(pt: Point): number {
    throwIfNotPoint(pt, g_of.name);
    return Math.floor(pt.color[1] * 255);
  }

  static b_of(pt: Point): number {
    throwIfNotPoint(pt, b_of.name);
    return Math.floor(pt.color[2] * 255);
  }

  static unit_circle = async function* (evaluator: IDataHandler, t: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await evaluator.opaque_make(
      make_point(Math.cos(2 * Math.PI * t.value), Math.sin(2 * Math.PI * t.value))
    );
  };

  static unit_line = async function* (evaluator: IDataHandler, t: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await evaluator.opaque_make(
      make_point(t.value, 0)
    );
  };

  static async* unit_line_at(evaluator: IDataHandler, y: TypedValue<DataType.NUMBER>): AsyncGenerator<void, Curve, undefined> {
    return await evaluator.closure_make(
      { args: [DataType.NUMBER] as const, returnType: DataType.OPAQUE },
      async function* (t) {
        return await evaluator.opaque_make(
          make_point(t.value, y.value)
        );
      }
    );
  }

  static arc = async function* (evaluator: IDataHandler, t: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await evaluator.opaque_make(
      make_point(Math.sin(Math.PI * t.value), Math.cos(Math.PI * t.value))
    );
  };
}

export const make_point = CurveFunctions.make_point;
export const make_3D_point = CurveFunctions.make_3D_point;
export const make_color_point = CurveFunctions.make_color_point;
export const make_3D_color_point = CurveFunctions.make_3D_color_point;
export const x_of = CurveFunctions.x_of;
export const y_of = CurveFunctions.y_of;
export const z_of = CurveFunctions.z_of;
export const r_of = CurveFunctions.r_of;
export const g_of = CurveFunctions.g_of;
export const b_of = CurveFunctions.b_of;
export const invert = CurveFunctions.invert;
export const translate = CurveFunctions.translate;
export const rainbow = CurveFunctions.rainbow;
export const rotate_around_origin_3D = CurveFunctions.rotate_around_origin_3D;
export const rotate_around_origin = CurveFunctions.rotate_around_origin;
export const scale = CurveFunctions.scale;
export const scale_proportional = CurveFunctions.scale_proportional;
export const compose = CurveFunctions.compose;
export const put_in_standard_position = CurveFunctions.put_in_standard_position;
export const connect_rigidly = CurveFunctions.connect_rigidly;
export const connect_ends = CurveFunctions.connect_ends;
export const unit_circle = CurveFunctions.unit_circle;
export const unit_line = CurveFunctions.unit_line;
export const unit_line_at = CurveFunctions.unit_line_at;
export const arc = CurveFunctions.arc;
