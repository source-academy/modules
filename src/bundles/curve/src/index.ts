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

  async* make_point(x: TypedValue<DataType.NUMBER>, y: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.evaluator.opaque_make(functions.make_point(x.value, y.value));
  }

  async* make_3D_point(x: TypedValue<DataType.NUMBER>, y: TypedValue<DataType.NUMBER>, z: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.evaluator.opaque_make(functions.make_3D_point(x.value, y.value, z.value));
  }

  async* make_color_point(
    x: TypedValue<DataType.NUMBER>,
    y: TypedValue<DataType.NUMBER>,
    r: TypedValue<DataType.NUMBER>,
    g: TypedValue<DataType.NUMBER>,
    b: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.evaluator.opaque_make(functions.make_color_point(x.value, y.value, r.value, g.value, b.value));
  }

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

  async* connect_ends(curve1: TypedValue<DataType.CLOSURE>, curve2: TypedValue<DataType.CLOSURE>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return yield* functions.connect_ends(this.evaluator, curve1, curve2);
  }

  async* connect_rigidly(curve1: TypedValue<DataType.CLOSURE>, curve2: TypedValue<DataType.CLOSURE>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return yield* functions.connect_rigidly(this.evaluator, curve1, curve2);
  }

  async* translate(x0: TypedValue<DataType.NUMBER>, y0: TypedValue<DataType.NUMBER>, z0: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return yield* functions.translate(this.evaluator, x0.value, y0.value, z0.value);
  }

  async* rainbow(repeats: TypedValue<DataType.NUMBER>, phase: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return yield* functions.rainbow(this.evaluator, repeats.value, phase.value);
  }

  async* invert(curve: TypedValue<DataType.CLOSURE>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return yield* functions.invert(this.evaluator, curve);
  }

  async* put_in_standard_position(curve: TypedValue<DataType.CLOSURE>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return yield* functions.put_in_standard_position(this.evaluator, curve);
  }

  async * rotate_around_origin_3D(a: TypedValue<DataType.NUMBER>, b: TypedValue<DataType.NUMBER>, c: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return yield* functions.rotate_around_origin_3D(this.evaluator, a.value, b.value, c.value);
  }

  async * rotate_around_origin(a: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return yield* functions.rotate_around_origin(this.evaluator, a.value);
  }

  async * scale(x: TypedValue<DataType.NUMBER>, y: TypedValue<DataType.NUMBER>, z: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return yield* functions.scale(this.evaluator, x.value, y.value, z.value);
  }

  async * scale_proportional(s: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return yield* functions.scale_proportional(this.evaluator, s.value);
  }

  async * x_of(pt: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.NUMBER>, undefined> {
    const point = await this.evaluator.opaque_get(pt);
    return { type: DataType.NUMBER, value: functions.x_of(point) };
  }

  async * y_of(pt: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.NUMBER>, undefined> {
    const point = await this.evaluator.opaque_get(pt);
    return { type: DataType.NUMBER, value: functions.y_of(point) };
  }

  async * z_of(pt: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.NUMBER>, undefined> {
    const point = await this.evaluator.opaque_get(pt);
    return { type: DataType.NUMBER, value: functions.z_of(point) };
  }

  async * r_of(pt: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.NUMBER>, undefined> {
    const point = await this.evaluator.opaque_get(pt);
    return { type: DataType.NUMBER, value: functions.r_of(point) };
  }

  async * g_of(pt: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.NUMBER>, undefined> {
    const point = await this.evaluator.opaque_get(pt);
    return { type: DataType.NUMBER, value: functions.g_of(point) };
  }

  async * b_of(pt: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.NUMBER>, undefined> {
    const point = await this.evaluator.opaque_get(pt);
    return { type: DataType.NUMBER, value: functions.b_of(point) };
  }

  async * unit_circle(t: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return yield* functions.unit_circle(this.evaluator, t);
  }

  async * unit_line(t: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return yield* functions.unit_line(this.evaluator, t);
  }

  async * unit_line_at(y: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return yield* functions.unit_line_at(this.evaluator, y);
  }

  async * arc(t: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return yield* functions.arc(this.evaluator, t);
  }

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
