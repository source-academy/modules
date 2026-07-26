/**
 * The module `plotly` provides functions for drawing plots using the plotly.js library.
 * @author Sourabh Raj Jaiswal
 * @module plotly
 */

import { conductorToSound } from '@sourceacademy/bundle-sound';
import { EvaluatorRuntimeError } from '@sourceacademy/conductor/common';
import type { IChannel, IConduit } from '@sourceacademy/conductor/conduit';
import { BaseModulePlugin } from '@sourceacademy/conductor/module';
import type { IInterfacableEvaluator } from '@sourceacademy/conductor/runner';
import { DataType, type TypedValue } from '@sourceacademy/conductor/types';
import { attachModuleMethod } from '@sourceacademy/modules-lib/conductor/methods';
import { draw_connected_2d as draw_connected_2d_func, draw_connected_3d as draw_connected_3d_func, draw_new_plot, draw_points_2d as draw_points_2d_func, draw_points_3d as draw_points_3d_func, draw_sound_2d } from './functions';
import { PLOTLY_CHANNEL_ID, PLOTLY_RUNNER_ID, type PlotlyRenderMessage } from './protocol';

type TabLoader = {
  tabs: string[];
  loadTab: (tab: string) => Promise<void>;
};

export default class PlotlyModulePlugin extends BaseModulePlugin {
  id = PLOTLY_RUNNER_ID;
  static override readonly channelAttach = [PLOTLY_CHANNEL_ID];
  override readonly exportedNames = [
    'new_plot',
    // "new_plot_json",
    'draw_connected_2d',
    'draw_connected_3d',
    'draw_points_2d',
    'draw_points_3d',
    'draw_sound_2d'
  ] as const;
  private __plotlyChannel: IChannel<PlotlyRenderMessage>;
  private __tabLoader: TabLoader;
  private __displayed: PlotlyRenderMessage[] = [];
  private __tabLoaded = false;

  constructor(
    conduit: IConduit,
    [plotlyChannel]: IChannel<any>[],
    evaluator: IInterfacableEvaluator,
    tabLoader: TabLoader
  ) {
    super(conduit, [plotlyChannel], evaluator);

    if (!plotlyChannel) {
      throw new EvaluatorRuntimeError('Plotly channel is required but was not provided.');
    }

    this.__plotlyChannel = plotlyChannel as IChannel<PlotlyRenderMessage>;
    this.__tabLoader = tabLoader;
    this.__plotlyChannel.subscribe(_ => {
      this.__displayed.forEach(displayedMessage => this.__plotlyChannel.send(displayedMessage));
    });
  }

  override async initialise(): Promise<void> {
    this.draw_connected_2d_cache = await draw_connected_2d_func(this.evaluator, this.__display.bind(this));
    this.draw_connected_3d_cache = await draw_connected_3d_func(this.evaluator, this.__display.bind(this));
    this.draw_points_2d_cache = await draw_points_2d_func(this.evaluator, this.__display.bind(this));
    this.draw_points_3d_cache = await draw_points_3d_func(this.evaluator, this.__display.bind(this));
    await super.initialise();
  }
  /**
   * Loads the host-side tab
   * @returns Whether the tab was already loaded
   */
  private async __loadPlotlyTab(): Promise<boolean> {
    if (this.__tabLoaded || this.__tabLoader === undefined) return true;

    const tabName = this.__tabLoader.tabs[0];
    if (tabName === undefined) return true;

    await this.__tabLoader.loadTab(tabName);
    this.__tabLoaded = true;
    return false;
  }

  private async __display(message: Omit<PlotlyRenderMessage, 'type'>): Promise<void> {
    this.__displayed.push({ type: 'render', ...message });
    await this.__loadPlotlyTab();
    this.__plotlyChannel.send({ type: 'render', ...message });
  }

  /**
   * Adds a new plotly plot to the context which will be rendered in the Plotly Tabs
   * @example
   * ```
   * const z1 = [
   *   [8.83,8.89,8.81,8.87,8.9,8.87],
   *   [8.89,8.94,8.85,8.94,8.96,8.92],
   *   [8.84,8.9,8.82,8.92,8.93,8.91],
   *   [8.79,8.85,8.79,8.9,8.94,8.92],
   *   [8.79,8.88,8.81,8.9,8.95,8.92],
   *   [8.8,8.82,8.78,8.91,8.94,8.92],
   *   [8.75,8.78,8.77,8.91,8.95,8.92],
   *   [8.8,8.8,8.77,8.91,8.95,8.94],
   *   [8.74,8.81,8.76,8.93,8.98,8.99],
   *   [8.89,8.99,8.92,9.1,9.13,9.11],
   *   [8.97,8.97,8.91,9.09,9.11,9.11],
   *   [9.04,9.08,9.05,9.25,9.28,9.27],
   *   [9,9.01,9,9.2,9.23,9.2],
   *   [8.99,8.99,8.98,9.18,9.2,9.19],
   *   [8.93,8.97,8.97,9.18,9.2,9.18]
   * ];
   * new_plot(list(pair('z', z1), pair('type', 'surface'))); // creates a surface plot in Plotly Tab
   * ```
   * @param data The data in the form of list of pair, with the first term in the pair is
   *             the name of the field as a string and the second term is the value of the field
   *             among the fields mentioned above
   * @publicType data: ListOfPairs
   */
  async* new_plot(data: TypedValue<DataType.LIST>): AsyncGenerator<void, TypedValue<DataType.VOID>, unknown> {
    const plotlyData = yield* draw_new_plot(this.evaluator, data);
    await this.__display({ data: plotlyData });
    return { type: DataType.VOID, value: undefined };
  }

  // TODO: Restore this as active JSDoc when new_plot_json has map support.
  // /**
  //  * Adds a new plotly plot to the context which will be rendered in the Plotly Tabs
  //  * @example
  //  * ```
  //  * const z1 = [
  //  *   [8.83,8.89,8.81,8.87,8.9,8.87],
  //  *   [8.89,8.94,8.85,8.94,8.96,8.92],
  //  *   [8.84,8.9,8.82,8.92,8.93,8.91],
  //  *   [8.79,8.85,8.79,8.9,8.94,8.92],
  //  *   [8.79,8.88,8.81,8.9,8.95,8.92],
  //  *   [8.8,8.82,8.78,8.91,8.94,8.92],
  //  *   [8.75,8.78,8.77,8.91,8.95,8.92],
  //  *   [8.8,8.8,8.77,8.91,8.95,8.94],
  //  *   [8.74,8.81,8.76,8.93,8.98,8.99],
  //  *   [8.89,8.99,8.92,9.1,9.13,9.11],
  //  *   [8.97,8.97,8.91,9.09,9.11,9.11],
  //  *   [9.04,9.08,9.05,9.25,9.28,9.27],
  //  *   [9,9.01,9,9.2,9.23,9.2],
  //  *   [8.99,8.99,8.98,9.18,9.2,9.19],
  //  *   [8.93,8.97,8.97,9.18,9.2,9.18]
  //  * ];
  //  *
  //  * let z2 = [];
  //  * for (let i = 0; i < array_length(z1); i = i + 1) {
  //  *   let z2_row = [];
  //  *   for (let j = 0; j < array_length(z1[i]); j = j + 1) {
  //  *     z2_row.push(z1[i][j]+1);
  //  *   }
  //  *   z2.push(z2_row);
  //  * }
  //  * const data = [{ z: z1, type: 'surface' }, { z: z2 , type: 'surface' }];
  //  * new_plot_json(data); // creates a surface plot in Plotly Tab
  //  * ```
  //  * @param data The data as an array of json objects having some or all of the given fields
  //  */
  // BLOCKED BY LACK OF MAP SUPPORT
  // async* new_plot_json(data: TypedValue<DataType.STRING>): AsyncGenerator<void, void, unknown>

  private draw_connected_2d_cache!: (numPoints: number) => AsyncGenerator<void, TypedValue<DataType.CLOSURE>, unknown>;
  private draw_connected_3d_cache!: (numPoints: number) => AsyncGenerator<void, TypedValue<DataType.CLOSURE>, unknown>;
  private draw_points_2d_cache!: (numPoints: number) => AsyncGenerator<void, TypedValue<DataType.CLOSURE>, unknown>;
  private draw_points_3d_cache!: (numPoints: number) => AsyncGenerator<void, TypedValue<DataType.CLOSURE>, unknown>;

  /**
   * Returns a function that turns a given Curve into a Drawing, by sampling the
   * Curve at `num` sample points and connecting each pair with a line.
   *
   * @function
   * @param num determines the number of points, lower than 65535, to be sampled.
   * Including 0 and 1, there are `num + 1` evenly spaced sample points
   * @returns function of type Curve → Drawing
   * @example
   * ```
   * draw_connected_2d(100)(t => make_point(t, t));
   * ```
   * @publicReturnType (Curve) => Drawing
   */
  async* draw_connected_2d(num: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return yield* this.draw_connected_2d_cache(num.value);
  }

  /**
   * Returns a function that turns a given 3D Curve into a Drawing, by sampling the
   * 3D Curve at `num` sample points and connecting each pair with a line.
   *
   * @function
   * @param num determines the number of points, lower than 65535, to be sampled.
   * Including 0 and 1, there are `num + 1` evenly spaced sample points
   * @returns function of type 3D Curve → Drawing
   * @example
   * ```
   * draw_connected_3d(100)(t => make_point(t, t));
   * ```
   * @publicReturnType (Curve) => Drawing
   */
  async* draw_connected_3d(num: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return yield* this.draw_connected_3d_cache(num.value);
  }

  /**
   * Returns a function that turns a given Curve into a Drawing, by sampling the
   * Curve at num sample points. The Drawing consists of isolated points, and does not connect them.
   * When a program evaluates to a Drawing, the Source system displays it graphically, in a window,
   *
   * @param num determines the number of points, lower than 65535, to be sampled.
   * Including 0 and 1, there are `num + 1` evenly spaced sample points
   * @function
   * @returns function of type 2D Curve → Drawing
   * @example
   * ```
   * draw_points_2d(100)(t => make_point(t, t));
   * ```
   * @publicReturnType (Curve) => Drawing
   */
  async* draw_points_2d(num: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return yield* this.draw_points_2d_cache(num.value);
  }

  /**
   * Returns a function that turns a given 3D Curve into a Drawing, by sampling the
   * 3D Curve at num sample points. The Drawing consists of isolated points, and does not connect them.
   * When a program evaluates to a Drawing, the Source system displays it graphically, in a window,
   *
   * @param num determines the number of points, lower than 65535, to be sampled.
   * Including 0 and 1, there are `num + 1` evenly spaced sample points
   * @function
   * @returns function of type 3D Curve → Drawing
   * @example
   * ```
   * draw_points_3d(100)(t => make_point(t, t));
   * ```
   * @publicReturnType (Curve) => Drawing
   */
  async* draw_points_3d(num: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    return yield* this.draw_points_3d_cache(num.value);
  }

  /**
   * Visualizes the sound on a 2d line graph
   * @param sound the sound which is to be visualized on plotly
   * @publicType sound: Sound
   */
  async* draw_sound_2d(sound: TypedValue<DataType.PAIR>): AsyncGenerator<void, TypedValue<DataType.VOID>, unknown> {
    const soundValue = await conductorToSound(this.evaluator, sound);
    await draw_sound_2d(soundValue, this.__display.bind(this));
    return { type: DataType.VOID, value: undefined };
  }

}

attachModuleMethod(PlotlyModulePlugin, 'new_plot', [DataType.LIST], DataType.VOID);
attachModuleMethod(PlotlyModulePlugin, 'draw_connected_2d', [DataType.NUMBER], DataType.CLOSURE);
attachModuleMethod(PlotlyModulePlugin, 'draw_connected_3d', [DataType.NUMBER], DataType.CLOSURE);
attachModuleMethod(PlotlyModulePlugin, 'draw_points_2d', [DataType.NUMBER], DataType.CLOSURE);
attachModuleMethod(PlotlyModulePlugin, 'draw_points_3d', [DataType.NUMBER], DataType.CLOSURE);
attachModuleMethod(PlotlyModulePlugin, 'draw_sound_2d', [DataType.PAIR], DataType.VOID);
