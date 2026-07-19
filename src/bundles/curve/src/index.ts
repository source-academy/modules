/**
 * Module for drawing *curves*, i.e. collections of *points*, on a canvas in a tools tab
 *
 * A *point* is defined by its coordinates (x, y and z), and the color assigned to
 * it (r, g, and b). A few constructors for points is given, for example
 * {@link make_color_point}. Selectors allow access to the coordinates and color
 * components, for example {@link x_of}.
 *
 * A *curve* is a
 * '* unary function which takes a number argument within the unit interval `[0',1]`
 * '* and returns a point. If `C` is a curve', then the starting point of the curve
 * '* is always `C(0)`', and the ending point is always `C(1)`.
 *
 * A *curve transformation* is a function that takes a curve as argument and
 * returns a curve. Examples of curve transformations are {@link !scale} and {@link !translate}.
 *
 * A *render function* is function that takes a number argument and returns
 * a function that takes a curve as argument and visualises it in the output screen is
 * shown in the Source Academy in the tab with the "Curves Canvas" icon (image).
 * The following [example](https://share.sourceacademy.org/unitcircle) uses
 * the render function {@link !draw_connected_full_view} to display a curve called
 * `unit_circle`.
 * ```
 * '* import { make_point', draw_connected_full_view } from "curve";
 * function unit_circle(t) {
 * '*   return make_point(math_sin(2 * math_PI * t)',
 *                     math_cos(2 * math_PI * t));
 * }
 * draw_connected_full_view(100)(unit_circle);
 * ```
 * draws a full circle in the display tab.
 *
 * @module curve
 * @author Lee Zheng Han
 * @author Ng Yong Xiang
 */
import type { IChannel, IConduit } from '@sourceacademy/conductor/conduit';
import { BaseModulePlugin } from '@sourceacademy/conductor/module';
import type { IInterfacableEvaluator } from '@sourceacademy/conductor/runner';
import { DataType, type TypedValue } from '@sourceacademy/conductor/types';
import * as drawers from './drawers';
import * as functions from './functions';
import { CURVE_CHANNEL_ID, type CurveChannelMessage, type CurveDisplayMessage } from './protocol';

type TabLoader = {
  tabs: string[];
  loadTab: (tab: string) => void;
};

export default class CurveModulePlugin extends BaseModulePlugin {
  id = 'curve';
  static override readonly channelAttach = [CURVE_CHANNEL_ID];
  override readonly exportedNames = [
    'arc',
    'b_of',
    'connect_ends',
    'connect_rigidly',
    'g_of',
    'invert',
    'make_3D_color_point',
    'make_3D_point',
    'make_color_point',
    'make_point',
    'put_in_standard_position',
    'rainbow',
    'r_of',
    'rotate_around_origin',
    'scale',
    'scale_proportional',
    'translate',
    'unit_circle',
    'unit_line',
    'unit_line_at',
    'x_of',
    'y_of',
    'z_of',
    'animate_3D_curve',
    'animate_curve',
    'draw_3D_connected',
    'draw_3D_connected_full_view',
    'draw_3D_connected_full_view_proportional',
    'draw_3D_points',
    'draw_3D_points_full_view',
    'draw_3D_points_full_view_proportional',
    'draw_connected',
    'draw_connected_full_view',
    'draw_connected_full_view_proportional',
    'draw_points',
    'draw_points_full_view',
    'draw_points_full_view_proportional',
  ] as const;
  private __curveChannel: IChannel<CurveChannelMessage>;
  private __tabLoader: TabLoader;
  private __displayed: CurveDisplayMessage[] = [];
  private __tabLoaded = false;

  constructor(
    conduit: IConduit,
    [curveChannel]: IChannel<any>[],
    evaluator: IInterfacableEvaluator,
    tabLoader: TabLoader
  ) {
    super(conduit, [curveChannel], evaluator);

    if (!curveChannel) {
      throw new Error('Curve channel is required but was not provided.');
    }

    this.__curveChannel = curveChannel as IChannel<CurveChannelMessage>;
    this.__tabLoader = tabLoader;
    this.__curveChannel.subscribe(message => {
      if (message.type === 'request') {
        this.__displayed.forEach(displayedMessage => this.__curveChannel.send(displayedMessage));
      }
    });
  }
  /**
   * Loads the host-side tab
   * @returns Whether the tab was already loaded
   */
  private __loadCurveTab(): boolean {
    if (this.__tabLoaded || this.__tabLoader === undefined) return true;

    const tabName = this.__tabLoader.tabs[0];
    if (tabName === undefined) return true;

    this.__tabLoader.loadTab(tabName);
    this.__tabLoaded = true;
    return false;
  }

  private async __display(message: CurveDisplayMessage): Promise<void> {
    this.__displayed.push(message);
    if (this.__loadCurveTab()) {
      this.__curveChannel.send(message);
    }
  }

  /**
   * Makes a Point with given x and y coordinates.
   *
   * @param x x-coordinate of new point
   * @param y y-coordinate of new point
   * @returns with x and y as coordinates
   * @function
   * @example
   * ```
   * const point = make_point(0.5, 0.5);
   * ```
   * @publicReturnType Point
   */
  async* make_point(x: TypedValue<DataType.NUMBER>, y: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.evaluator.opaque_make(functions.make_point(x.value, y.value));
  }

  /**
   * Makes a 3D Point with given x, y and z coordinates.
   *
   * @param x x-coordinate of new point
   * @param y y-coordinate of new point
   * @param z z-coordinate of new point
   * @returns with x, y and z as coordinates
   * @function
   * @example
   * ```
   * const point = make_3D_point(0.5, 0.5, 0.5);
   * ```
   * @publicReturnType Point
   */
  async* make_3D_point(x: TypedValue<DataType.NUMBER>, y: TypedValue<DataType.NUMBER>, z: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.evaluator.opaque_make(functions.make_3D_point(x.value, y.value, z.value));
  }

  /**
   * Makes a color Point with given x and y coordinates, and RGB values ranging
   * from 0 to 255. Any input lower than 0 for RGB will be rounded up to 0, and
   * any input higher than 255 will be rounded down to 255.
   *
   * @param x x-coordinate of new point
   * @param y y-coordinate of new point
   * @param r red component of new point
   * @param g green component of new point
   * @param b blue component of new point
   * @returns with x and y as coordinates, and r, g and b as RGB values
   * @function
   * @example
   * ```
   * const redPoint = make_color_point(0.5, 0.5, 255, 0, 0);
   * ```
   * @publicReturnType Point
   */
  async* make_color_point(
    x: TypedValue<DataType.NUMBER>,
    y: TypedValue<DataType.NUMBER>,
    r: TypedValue<DataType.NUMBER>,
    g: TypedValue<DataType.NUMBER>,
    b: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.evaluator.opaque_make(functions.make_color_point(x.value, y.value, r.value, g.value, b.value));
  }

  /**
   * Makes a 3D color Point with given x, y and z coordinates, and RGB values
   * ranging from 0 to 255. Any input lower than 0 for RGB will be rounded up to
   * 0, and any input higher than 255 will be rounded down to 255.
   *
   * @param x x-coordinate of new point
   * @param y y-coordinate of new point
   * @param z z-coordinate of new point
   * @param r red component of new point
   * @param g green component of new point
   * @param b blue component of new point
   * @returns with x, y and z as coordinates, and r, g and b as RGB values
   * @function
   * @example
   * ```
   * const redPoint = make_color_point(0.5, 0.5, 0.5, 255, 0, 0);
   * ```
   * @publicReturnType Point
   */
  async* make_3D_color_point(
    x: TypedValue<DataType.NUMBER>,
    y: TypedValue<DataType.NUMBER>,
    z: TypedValue<DataType.NUMBER>,
    r: TypedValue<DataType.NUMBER>,
    g: TypedValue<DataType.NUMBER>,
    b: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.evaluator.opaque_make(functions.make_3D_color_point(x.value, y.value, z.value, r.value, g.value, b.value));
  }

  /**
   * This function is a binary Curve operator: It takes two Curves as arguments
   * and returns a new Curve. The two Curves are combined by using the full first
   * Curve for the first portion of the result and by using the full second Curve
   * for the second portion of the result. The second Curve is translated such
   * that its point at fraction 0 is the same as the Point of the first Curve at
   * fraction 1.
   *
   * @param curve1 first Curve
   * @param curve2 second Curve
   * @returns result Curve
   * @function
   */
  async* connect_ends(curve1: TypedValue<DataType.CLOSURE>, curve2: TypedValue<DataType.CLOSURE>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return yield* functions.connect_ends(this.evaluator, curve1, curve2);
  }

  /**
   * This function is a binary Curve operator: It takes two Curves as arguments
   * and returns a new Curve. The two Curves are combined by using the full first
   * Curve for the first portion of the result and by using the full second Curve
   * for the second portion of the result. The second Curve is not changed, and
   * therefore there might be a big jump in the middle of the result Curve.
   *
   * @param curve1 first Curve
   * @param curve2 second Curve
   * @returns result Curve
   * @function
   */
  async* connect_rigidly(curve1: TypedValue<DataType.CLOSURE>, curve2: TypedValue<DataType.CLOSURE>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return yield* functions.connect_rigidly(this.evaluator, curve1, curve2);
  }

  /**
   * This function returns a Curve transformation: It takes an x-value x0, a
   * y-value y0 and a z-value z0, as arguments and returns a Curve transformation
   * that takes a Curve as argument and returns a new Curve, by translating the
   * original by x0 in x-direction, y0 in y-direction and z0 in z-direction.
   *
   * @param x0 x-value
   * @param y0 y-value
   * @param z0 z-value
   * @returns Curve transformation
   * @function
   */
  async* translate(x0: TypedValue<DataType.NUMBER>, y0: TypedValue<DataType.NUMBER>, z0: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return yield* functions.translate(this.evaluator, x0.value, y0.value, z0.value);
  }

  /**
   * Returns a Curve transformation that recolours a curve with a repeating
   * rainbow. The `repeats` parameter controls how many full hue cycles occur
   * as `t` goes from 0 to 1. The `phase` shifts the starting hue.
   *
   * @param repeats number of rainbow cycles across the curve parameter interval
   * @param phase hue offset, where 0 starts at red
   * @returns Curve transformation
   * @function
   */
  async* rainbow(repeats: TypedValue<DataType.NUMBER>, phase: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return yield* functions.rainbow(this.evaluator, repeats.value, phase.value);
  }

  /**
   * This function is a Curve transformation: a function from a Curve to a Curve.
   * The points of the result Curve are the same points as the points of the
   * original Curve, but in reverse: The result Curve applied to 0 is the original
   * Curve applied to 1 and vice versa.
   *
   * @param curve original Curve
   * @returns result Curve
   */
  async* invert(curve: TypedValue<DataType.CLOSURE>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return yield* functions.invert(this.evaluator, curve);
  }

  /**
   * This function is a Curve transformation: It takes a Curve as argument and
   * returns a new Curve, as follows. A Curve is in standard position if it
   * starts at (0,0) ends at (1,0). This function puts the given Curve in
   * standard position by rigidly translating it so its start Point is at the
   * origin (0,0), then rotating it about the origin to put its endpoint on the
   * x axis, then scaling it to put the endpoint at (1,0). Behavior is unspecified
   * on closed Curves where start-point equal end-point.
   *
   * @param curve given Curve
   * @returns result Curve
   */
  async* put_in_standard_position(curve: TypedValue<DataType.CLOSURE>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return yield* functions.put_in_standard_position(this.evaluator, curve);
  }

  /**
   * This function takes 3 angles, a, b and c in radians as parameter
   * and returns a Curve transformation: a function that takes a 3D Curve as argument
   * and returns a new 3D Curve, which is the original Curve rotated
   * extrinsically with Euler angles (a, b, c) about x, y, and z axes.
   *
   * @param a given angle
   * @param b given angle
   * @param c given angle
   * @returns function that takes a Curve and returns a Curve
   * @function
   */
  async * rotate_around_origin_3D(a: TypedValue<DataType.NUMBER>, b: TypedValue<DataType.NUMBER>, c: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return yield* functions.rotate_around_origin_3D(this.evaluator, a.value, b.value, c.value);
  }

  /**
   * This function takes an angle a in radians as parameter and returns a Curve
   * transformation: a function that takes a Curve as argument and returns a new
   * Curve, which is the original Curve rotated extrinsically with Euler angle a
   * about the z axis.
   *
   * @param a given angle
   * @returns function that takes a Curve and returns a Curve
   * @function
   */
  async * rotate_around_origin(a: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return yield* functions.rotate_around_origin(this.evaluator, a.value);
  }

  /**
   * This function takes scaling factors `x`, `y` and `z` as arguments and
   * returns a Curve transformation that scales a given Curve in each direction.
   *
   * @param x scaling factor in x-direction
   * @param y scaling factor in y-direction
   * @param z scaling factor in z-direction
   * @returns function that takes a Curve and returns a Curve
   * @function
   */
  async * scale(x: TypedValue<DataType.NUMBER>, y: TypedValue<DataType.NUMBER>, z: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return yield* functions.scale(this.evaluator, x.value, y.value, z.value);
  }

  /**
   * This function takes a scaling factor s argument and returns a Curve
   * transformation that scales a given Curve by s in x, y and z direction.
   *
   * @param s scaling factor
   * @returns function that takes a Curve and returns a Curve
   * @function
   */
  async * scale_proportional(s: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return yield* functions.scale_proportional(this.evaluator, s.value);
  }

  /**
   * Retrieves the x-coordinate of a given Point.
   *
   * @param pt given point
   * @returns x-coordinate of the Point
   * @function
   * @example
   * ```
   * const point = make_color_point(1, 2, 50, 100, 150);
   * x_of(point); // Returns 1
   * ```
   * @publicType pt: Point
   */
  async * x_of(pt: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.NUMBER>, undefined> {
    const point = await this.evaluator.opaque_get(pt);
    return { type: DataType.NUMBER, value: functions.x_of(point) };
  }

  /**
   * Retrieves the y-coordinate of a given Point.
   *
   * @param pt given point
   * @returns y-coordinate of the Point
   * @function
   * @example
   * ```
   * const point = make_color_point(1, 2, 50, 100, 150);
   * y_of(point); // Returns 2
   * ```
   * @publicType pt: Point
   */
  async * y_of(pt: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.NUMBER>, undefined> {
    const point = await this.evaluator.opaque_get(pt);
    return { type: DataType.NUMBER, value: functions.y_of(point) };
  }

  /**
   * Retrieves the z-coordinate of a given Point.
   *
   * @param pt given point
   * @returns z-coordinate of the Point
   * @function
   * @example
   * ```
   * const point = make_3D_color_point(1, 2, 3, 50, 100, 150);
   * z_of(point); // Returns 3
   * ```
   * @publicType pt: Point
   */
  async * z_of(pt: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.NUMBER>, undefined> {
    const point = await this.evaluator.opaque_get(pt);
    return { type: DataType.NUMBER, value: functions.z_of(point) };
  }

  /**
   * Retrieves the red component of a given Point.
   *
   * @param pt given point
   * @returns Red component of the Point as a value between [0,255]
   * @function
   * @example
   * ```
   * const point = make_3D_color_point(1, 2, 3, 50, 100, 150);
   * r_of(point); // Returns 50
   * ```
   * @publicType pt: Point
   */
  async * r_of(pt: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.NUMBER>, undefined> {
    const point = await this.evaluator.opaque_get(pt);
    return { type: DataType.NUMBER, value: functions.r_of(point) };
  }

  /**
   * Retrieves the green component of a given Point.
   *
   * @param pt given point
   * @returns Green component of the Point as a value between [0,255]
   * @function
   * @example
   * ```
   * const point = make_3D_color_point(1, 2, 3, 50, 100, 150);
   * g_of(point); // Returns 100
   * ```
   * @publicType pt: Point
   */
  async * g_of(pt: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.NUMBER>, undefined> {
    const point = await this.evaluator.opaque_get(pt);
    return { type: DataType.NUMBER, value: functions.g_of(point) };
  }

  /**
   * Retrieves the blue component of a given Point.
   *
   * @param pt given point
   * @returns Blue component of the Point as a value between [0,255]
   * @function
   * @example
   * ```
   * const point = make_3D_color_point(1, 2, 3, 50, 100, 150);
   * b_of(point); // Returns 150
   * ```
   * @publicType pt: Point
   */
  async * b_of(pt: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.NUMBER>, undefined> {
    const point = await this.evaluator.opaque_get(pt);
    return { type: DataType.NUMBER, value: functions.b_of(point) };
  }

  /**
   * This function is a curve from a fraction t to a point on the unit circle.
   * It starts at Point (1,0) when t is 0.
   *
   * @param t fraction between 0 and 1
   * @returns Point on the circle at t
   * @publicReturnType Point
   */
  async * unit_circle(t: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return yield* functions.unit_circle(this.evaluator, t);
  }

  /**
   * This function is a curve from a fraction t to a point whose x-coordinate
   * is t and whose y-coordinate is 0.
   *
   * @param t fraction between 0 and 1
   * @returns Point on the line at t
   * @publicReturnType Point
   */
  async * unit_line(t: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return yield* functions.unit_line(this.evaluator, t);
  }

  /**
   * This function is a Curve generator: it takes a number and returns a
   * horizontal curve. The number is a y-coordinate, and the Curve generates only
   * points with the given y-coordinate.
   *
   * @param y fraction between 0 and 1
   * @returns horizontal Curve
   * @function
   */
  async * unit_line_at(y: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return yield* functions.unit_line_at(this.evaluator, y);
  }

  /**
   * This function is a curve from a fraction t to a point on the right half of
   * the unit circle. It starts at Point (0,1), reaches Point (1,0), and ends at
   * Point (0,-1).
   *
   * @param t fraction between 0 and 1
   * @returns Point in the arc at t
   * @publicReturnType Point
   */
  async * arc(t: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return yield* functions.arc(this.evaluator, t);
  }

  /**
   * Returns a function that turns a given Curve into a Drawing, by sampling the
   * Curve at `numPoints` sample points and connecting each pair with a line.
   * The part between (0,0) and (1,1) is shown in the window.
   *
   * @param numPoints number of points to sample, lower than 65535
   * @returns function of type Curve -> Drawing
   * @function
   * @example
   * ```
   * draw_connected(100)(t => make_point(t, t));
   * ```
   */
  async* draw_connected(numPoints: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    const renderFunction = drawers.draw_connected(this.evaluator, numPoints.value);

    const pluginThis = this;
    return await this.evaluator.closure_make(
      { args: [DataType.CLOSURE], returnType: DataType.OPAQUE },
      async function* (curve: TypedValue<DataType.CLOSURE>) {
        const curveDrawn = yield* renderFunction(curve);
        pluginThis.__display({ type: 'render', curve: curveDrawn.toSerializable() });
        return await pluginThis.evaluator.opaque_make(curveDrawn);
      }
    );
  }

  /**
   * Returns a function that draws a sampled Curve with connected lines. The
   * Drawing is translated and stretched to show the full curve with padding.
   *
   * @param numPoints number of points to sample, lower than 65535
   * @returns function of type Curve -> Drawing
   * @function
   * @example
   * ```
   * draw_connected_full_view(100)(t => make_point(t, t));
   * ```
   */
  async* draw_connected_full_view(numPoints: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    const renderFunction = drawers.draw_connected_full_view(this.evaluator, numPoints.value);

    const pluginThis = this;
    return await this.evaluator.closure_make(
      { args: [DataType.CLOSURE], returnType: DataType.OPAQUE },
      async function* (curve: TypedValue<DataType.CLOSURE>) {
        const curveDrawn = yield* renderFunction(curve);
        pluginThis.__display({ type: 'render', curve: curveDrawn.toSerializable() });
        return await pluginThis.evaluator.opaque_make(curveDrawn);
      }
    );
  }

  /**
   * Returns a function that draws a sampled Curve with connected lines. The
   * Drawing is translated and scaled proportionally to show the full curve.
   *
   * @param numPoints number of points to sample, lower than 65535
   * @returns function of type Curve -> Drawing
   * @function
   * @example
   * ```
   * draw_connected_full_view_proportional(100)(t => make_point(t, t));
   * ```
   */
  async* draw_connected_full_view_proportional(numPoints: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    const renderFunction = drawers.draw_connected_full_view_proportional(this.evaluator, numPoints.value);

    const pluginThis = this;
    return await this.evaluator.closure_make(
      { args: [DataType.CLOSURE], returnType: DataType.OPAQUE },
      async function* (curve: TypedValue<DataType.CLOSURE>) {
        const curveDrawn = yield* renderFunction(curve);
        pluginThis.__display({ type: 'render', curve: curveDrawn.toSerializable() });
        return await pluginThis.evaluator.opaque_make(curveDrawn);
      }
    );
  }

  /**
   * Returns a function that draws a sampled Curve as isolated points. The part
   * between (0,0) and (1,1) is shown in the window.
   *
   * @param numPoints number of points to sample, lower than 65535
   * @returns function of type Curve -> Drawing
   * @function
   * @example
   * ```
   * draw_points(100)(t => make_point(t, t));
   * ```
   */
  async* draw_points(numPoints: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    const renderFunction = drawers.draw_points(this.evaluator, numPoints.value);

    const pluginThis = this;
    return await this.evaluator.closure_make(
      { args: [DataType.CLOSURE], returnType: DataType.OPAQUE },
      async function* (curve: TypedValue<DataType.CLOSURE>) {
        const curveDrawn = yield* renderFunction(curve);
        pluginThis.__display({ type: 'render', curve: curveDrawn.toSerializable() });
        return await pluginThis.evaluator.opaque_make(curveDrawn);
      }
    );
  }

  /**
   * Returns a function that draws a sampled Curve as isolated points. The
   * Drawing is translated and stretched to show the full curve with padding.
   *
   * @param numPoints number of points to sample, lower than 65535
   * @returns function of type Curve -> Drawing
   * @function
   * @example
   * ```
   * draw_points_full_view(100)(t => make_point(t, t));
   * ```
   */
  async* draw_points_full_view(numPoints: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    const renderFunction = drawers.draw_points_full_view(this.evaluator, numPoints.value);

    const pluginThis = this;
    return await this.evaluator.closure_make(
      { args: [DataType.CLOSURE], returnType: DataType.OPAQUE },
      async function* (curve: TypedValue<DataType.CLOSURE>) {
        const curveDrawn = yield* renderFunction(curve);
        pluginThis.__display({ type: 'render', curve: curveDrawn.toSerializable() });
        return await pluginThis.evaluator.opaque_make(curveDrawn);
      }
    );
  }

  /**
   * Returns a function that draws a sampled Curve as isolated points. The
   * Drawing is translated and scaled proportionally to show the full curve.
   *
   * @param numPoints number of points to sample, lower than 65535
   * @returns function of type Curve -> Drawing
   * @function
   * @example
   * ```
   * draw_points_full_view_proportional(100)(t => make_point(t, t));
   * ```
   */
  async* draw_points_full_view_proportional(numPoints: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    const renderFunction = drawers.draw_points_full_view_proportional(this.evaluator, numPoints.value);

    const pluginThis = this;
    return await this.evaluator.closure_make(
      { args: [DataType.CLOSURE], returnType: DataType.OPAQUE },
      async function* (curve: TypedValue<DataType.CLOSURE>) {
        const curveDrawn = yield* renderFunction(curve);
        pluginThis.__display({ type: 'render', curve: curveDrawn.toSerializable() });
        return await pluginThis.evaluator.opaque_make(curveDrawn);
      }
    );
  }

  /**
   * Returns a function that draws a sampled 3D Curve with connected lines. The
   * part between (0,0,0) and (1,1,1) is shown within the unit cube.
   *
   * @param numPoints number of points to sample, lower than 65535
   * @returns function of type Curve -> Drawing
   * @function
   * @example
   * ```
   * draw_3D_connected(100)(t => make_3D_point(t, t, t));
   * ```
   */
  async* draw_3D_connected(numPoints: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    const renderFunction = drawers.draw_3D_connected(this.evaluator, numPoints.value);

    const pluginThis = this;
    return await this.evaluator.closure_make(
      { args: [DataType.CLOSURE], returnType: DataType.OPAQUE },
      async function* (curve: TypedValue<DataType.CLOSURE>) {
        const curveDrawn = yield* renderFunction(curve);
        pluginThis.__display({ type: 'render', curve: curveDrawn.toSerializable() });
        return await pluginThis.evaluator.opaque_make(curveDrawn);
      }
    );
  }

  /**
   * Returns a function that draws a sampled 3D Curve with connected lines. The
   * Drawing is translated and stretched to show the full curve within the cube.
   *
   * @param numPoints number of points to sample, lower than 65535
   * @returns function of type Curve -> Drawing
   * @function
   * @example
   * ```
   * draw_3D_connected_full_view(100)(t => make_3D_point(t, t, t));
   * ```
   */
  async* draw_3D_connected_full_view(numPoints: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    const renderFunction = drawers.draw_3D_connected_full_view(this.evaluator, numPoints.value);

    const pluginThis = this;
    return await this.evaluator.closure_make(
      { args: [DataType.CLOSURE], returnType: DataType.OPAQUE },
      async function* (curve: TypedValue<DataType.CLOSURE>) {
        const curveDrawn = yield* renderFunction(curve);
        pluginThis.__display({ type: 'render', curve: curveDrawn.toSerializable() });
        return await pluginThis.evaluator.opaque_make(curveDrawn);
      }
    );
  }

  /**
   * Returns a function that draws a sampled 3D Curve with connected lines. The
   * Drawing is translated and scaled proportionally to fit within the cube.
   *
   * @param numPoints number of points to sample, lower than 65535
   * @returns function of type Curve -> Drawing
   * @function
   * @example
   * ```
   * draw_3D_connected_full_view_proportional(100)(t => make_3D_point(t, t, t));
   * ```
   */
  async* draw_3D_connected_full_view_proportional(numPoints: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    const renderFunction = drawers.draw_3D_connected_full_view_proportional(this.evaluator, numPoints.value);

    const pluginThis = this;
    return await this.evaluator.closure_make(
      { args: [DataType.CLOSURE], returnType: DataType.OPAQUE },
      async function* (curve: TypedValue<DataType.CLOSURE>) {
        const curveDrawn = yield* renderFunction(curve);
        pluginThis.__display({ type: 'render', curve: curveDrawn.toSerializable() });
        return await pluginThis.evaluator.opaque_make(curveDrawn);
      }
    );
  }

  /**
   * Returns a function that draws a sampled 3D Curve as isolated points. The
   * part between (0,0,0) and (1,1,1) is shown within the unit cube.
   *
   * @param numPoints number of points to sample, lower than 65535
   * @returns function of type Curve -> Drawing
   * @function
   * @example
   * ```
   * draw_3D_points(100)(t => make_3D_point(t, t, t));
   * ```
   */
  async* draw_3D_points(numPoints: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    const renderFunction = drawers.draw_3D_points(this.evaluator, numPoints.value);

    const pluginThis = this;
    return await this.evaluator.closure_make(
      { args: [DataType.CLOSURE], returnType: DataType.OPAQUE },
      async function* (curve: TypedValue<DataType.CLOSURE>) {
        const curveDrawn = yield* renderFunction(curve);
        pluginThis.__display({ type: 'render', curve: curveDrawn.toSerializable() });
        return await pluginThis.evaluator.opaque_make(curveDrawn);
      }
    );
  }

  /**
   * Returns a function that draws a sampled 3D Curve as isolated points. The
   * Drawing is translated and stretched to fit entirely inside the cube.
   *
   * @param numPoints number of points to sample, lower than 65535
   * @returns function of type Curve -> Drawing
   * @function
   * @example
   * ```
   * draw_3D_points_full_view(100)(t => make_3D_point(t, t, t));
   * ```
   */
  async* draw_3D_points_full_view(numPoints: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    const renderFunction = drawers.draw_3D_points_full_view(this.evaluator, numPoints.value);

    const pluginThis = this;
    return await this.evaluator.closure_make(
      { args: [DataType.CLOSURE], returnType: DataType.OPAQUE },
      async function* (curve: TypedValue<DataType.CLOSURE>) {
        const curveDrawn = yield* renderFunction(curve);
        pluginThis.__display({ type: 'render', curve: curveDrawn.toSerializable() });
        return await pluginThis.evaluator.opaque_make(curveDrawn);
      }
    );
  }

  /**
   * Returns a function that draws a sampled 3D Curve as isolated points. The
   * Drawing is translated and scaled proportionally to fit inside the cube.
   *
   * @param numPoints number of points to sample, lower than 65535
   * @returns function of type Curve -> Drawing
   * @function
   * @example
   * ```
   * draw_3D_points_full_view_proportional(100)(t => make_3D_point(t, t, t));
   * ```
   */
  async* draw_3D_points_full_view_proportional(numPoints: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    const renderFunction = drawers.draw_3D_points_full_view_proportional(this.evaluator, numPoints.value);

    const pluginThis = this;
    return await this.evaluator.closure_make(
      { args: [DataType.CLOSURE], returnType: DataType.OPAQUE },
      async function* (curve: TypedValue<DataType.CLOSURE>) {
        const curveDrawn = yield* renderFunction(curve);
        pluginThis.__display({ type: 'render', curve: curveDrawn.toSerializable() });
        return await pluginThis.evaluator.opaque_make(curveDrawn);
      }
    );
  }

  /**
   * Creates an animation of curves using a curve-generating function.
   *
   * @param duration The duration of the animation in seconds
   * @param fps Framerate of the animation in frames per second
   * @param drawer Draw function to use for the generated curves
   * @param func Curve-generating function that takes a timestamp and returns a Curve
   * @returns Curve animation
   * @function
   * @publicType drawer: RenderFunction
   * @publicReturnType AnimatedCurve
   */
  async* animate_curve(
    duration: TypedValue<DataType.NUMBER>,
    fps: TypedValue<DataType.NUMBER>,
    drawer: TypedValue<DataType.OPAQUE>,
    func: TypedValue<DataType.CLOSURE>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    const curve = yield* drawers.animate_curve(this.evaluator, duration.value, fps.value, await this.evaluator.opaque_get(drawer), func);
    this.__display(curve.toSerializable());
    return await this.evaluator.opaque_make(curve);
  }

  /**
   * Creates a 3D animation of curves using a curve-generating function.
   *
   * @param duration The duration of the animation in seconds
   * @param fps Framerate of the animation in frames per second
   * @param drawer Draw function to use for the generated curves
   * @param func Curve-generating function that takes a timestamp and returns a Curve
   * @returns 3D Curve animation
   * @function
   * @publicType drawer: RenderFunction
   * @publicReturnType AnimatedCurve
   */
  async* animate_3D_curve(
    duration: TypedValue<DataType.NUMBER>,
    fps: TypedValue<DataType.NUMBER>,
    drawer: TypedValue<DataType.OPAQUE>,
    func: TypedValue<DataType.CLOSURE>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    const curve = yield* drawers.animate_3D_curve(this.evaluator, duration.value, fps.value, await this.evaluator.opaque_get(drawer), func);
    this.__display(curve.toSerializable());
    return await this.evaluator.opaque_make(curve);
  }

}
