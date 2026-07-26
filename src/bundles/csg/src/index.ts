/**
 * The CSG module enables working with Constructive Solid Geometry in the Source
 * Academy. Users are able to program colored 3D models and interact with them
 * in a tab.
 *
 * The main objects in use are called Shapes. Users can create, operate on,
 * transform, and finally render these Shapes.
 *
 * There are also Groups, which contain Shapes, but can also contain other
 * nested Groups. Groups allow many Shapes to be transformed in tandem, as
 * opposed to having to call transform functions on each Shape individually.
 *
 * An object that is either a Shape or a Group is called an Operable. Operables
 * as a whole are stateless, which means that passing them into functions does
 * not modify the original Operable; instead, the newly created Operable is
 * returned. Therefore, it is safe to reuse existing Operables after passing
 * them into functions, as they remain immutable.
 *
 * When you are done modeling your Operables, pass them to one of the CSG
 * rendering functions to have them displayed in a tab.
 *
 * When rendering, you may optionally render with a grid and/or axes displayed,
 * depending on the rendering function used. The grid appears on the XY-plane
 * with white lines every 1 unit of distance, and slightly fainter lines every
 * 0.25 units of distance. The axes for x, y, and z are coloured red, green, and
 * blue respectively. The positive z direction is upwards from the flat plane
 * (right-handed coordinate system).
 *
 * ```js
 * // Sample usage
 * import {
 *     silver, crimson, cyan,
 *     cube, cone, sphere,
 *     intersect, union, scale, translate,
 *     render_grid_axes
 * } from "csg";
 *
 * const base = intersect(
 *     scale(cube(silver), 1, 1, 0.3),
 *     scale(cone(crimson), 1, 1, 3)
 * );
 * const snowglobe = union(
 *     translate(sphere(cyan), 0, 0, 0.22),
 *     base
 * );
 * render_grid_axes(snowglobe);
 * ```
 * More samples can be found at: https://github.com/source-academy/modules/tree/master/src/bundles/csg/samples
 *
 *
 * @module csg
 * @author Joel Leow
 * @author Liu Muchen
 * @author Ng Yin Joe
 * @author Yu Chenbo
 */

/* [Imports] */
import { EvaluatorParameterTypeError, EvaluatorRuntimeError } from '@sourceacademy/conductor/common';
import type { IChannel, IConduit } from '@sourceacademy/conductor/conduit';
import { BaseModulePlugin } from '@sourceacademy/conductor/module';
import type { IInterfacableEvaluator } from '@sourceacademy/conductor/runner';
import { DataType, type TypedValue } from '@sourceacademy/conductor/types';
import { attachModuleMethod } from '@sourceacademy/modules-lib/conductor/methods';
import * as funcs from './functions';
import {
  CSG_CHANNEL_ID,
  CSG_TAB_NAME,
  serializeSolid,
  type CsgChannelMessage,
  type CsgDisplayMessage
} from './protocol';
import {
  Group,
  RenderGroupManager,
  Shape,
  type Operable,
  type RenderGroup
} from './utilities';

/* [Main] */
type CsgTabLoader = {
  tabs: string[];
  loadTab: (tab: string) => void;
};

const STL_FILENAME = 'Source Academy CSG Shape.stl';

/* [Exports] */
export default class CsgModulePlugin extends BaseModulePlugin {
  id = 'csg';
  static override channelAttach = [CSG_CHANNEL_ID];
  override exportedNames = [
    'bounding_box',
    'cone',
    'cube',
    'cylinder',
    'download_shape_stl',
    'empty_shape',
    'geodesic_sphere',
    'group',
    'intersect',
    'is_group',
    'is_shape',
    'prism',
    'pyramid',
    'render',
    'render_axes',
    'render_grid',
    'render_grid_axes',
    'rgb',
    'rotate',
    'rounded_cube',
    'rounded_cylinder',
    'scale',
    'sphere',
    'star',
    'subtract',
    'torus',
    'translate',
    'ungroup',
    'union'
  ] as const;

  private readonly __csgChannel: IChannel<CsgChannelMessage>;
  private readonly __tabLoader: CsgTabLoader | undefined;
  // Reassigned (not just mutated) once a request has flushed it, to drop any
  // one-shot download entries - see __display.
  private __displayed: CsgDisplayMessage[] = [];
  /* NOTE
    Previously this lived on a `CsgModuleState` shared with the tab through
    `context.moduleContexts.csg.state`. The tab now only ever sees serialized
    solids, so the manager is private to the runner.
  */
  private readonly __renderGroupManager = new RenderGroupManager();
  private __tabLoaded = false;
  private __tabRequested = false;
  private __initialised = false;

  /**
   * A hex color code for black (#000000).
   *
   * @category Colors
   * @publicType string
   */
  black!: string;

  /**
   * A hex color code for dark blue (#0000AA).
   *
   * @category Colors
   * @publicType string
   */
  navy!: string;

  /**
   * A hex color code for green (#00AA00).
   *
   * @category Colors
   * @publicType string
   */
  green!: string;

  /**
   * A hex color code for dark cyan (#00AAAA).
   *
   * @category Colors
   * @publicType string
   */
  teal!: string;

  /**
   * A hex color code for dark red (#AA0000).
   *
   * @category Colors
   * @publicType string
   */
  crimson!: string;

  /**
   * A hex color code for purple (#AA00AA).
   *
   * @category Colors
   * @publicType string
   */
  purple!: string;

  /**
   * A hex color code for orange (#FFAA00).
   *
   * @category Colors
   * @publicType string
   */
  orange!: string;

  /**
   * A hex color code for light gray (#AAAAAA).
   *
   * @category Colors
   * @publicType string
   */
  silver!: string;

  /**
   * A hex color code for dark gray (#555555).
   *
   * @category Colors
   * @publicType string
   */
  gray!: string;

  /**
   * A hex color code for blue (#5555FF).
   *
   * @category Colors
   * @publicType string
   */
  blue!: string;

  /**
   * A hex color code for light green (#55FF55).
   *
   * @category Colors
   * @publicType string
   */
  lime!: string;

  /**
   * A hex color code for cyan (#55FFFF).
   *
   * @category Colors
   * @publicType string
   */
  cyan!: string;

  /**
   * A hex color code for light red (#FF5555).
   *
   * @category Colors
   * @publicType string
   */
  rose!: string;

  /**
   * A hex color code for pink (#FF55FF).
   *
   * @category Colors
   * @publicType string
   */
  pink!: string;

  /**
   * A hex color code for yellow (#FFFF55).
   *
   * @category Colors
   * @publicType string
   */
  yellow!: string;

  /**
   * A hex color code for white (#FFFFFF).
   *
   * @category Colors
   * @publicType string
   */
  white!: string;

  constructor(
    conduit: IConduit,
    [csgChannel]: IChannel<any>[],
    evaluator: IInterfacableEvaluator,
    tabLoader?: CsgTabLoader
  ) {
    // Checked before super() so a missing channel always surfaces as this
    // error, rather than whatever BaseModulePlugin's constructor does with an
    // [undefined] channels array.
    if (!csgChannel) {
      throw new EvaluatorRuntimeError('CSG channel is required but was not provided.');
    }

    super(conduit, [csgChannel], evaluator);

    this.__csgChannel = csgChannel as IChannel<CsgChannelMessage>;
    this.__tabLoader = tabLoader;
    // The tab asks for a replay once it has loaded, since a program that
    // rendered before the tab existed would otherwise draw into nothing. A
    // fresh tab always starts with an empty canvas list, so replaying the
    // render backlog is right on a re-request too (e.g. the tab being
    // recreated) - but a download is a one-shot side effect, not persistent
    // scene state, so it must never be replayed; see __display.
    this.__csgChannel.subscribe(message => {
      if (message.type === 'request') {
        this.__tabRequested = true;
        this.__displayed.forEach(displayedMessage => this.__csgChannel.send(displayedMessage));
        this.__displayed = this.__displayed.filter(displayedMessage => displayedMessage.type === 'render');
      }
    });
  }

  override async initialise() {
    // A second call would otherwise push every method's and every colour
    // constant's export onto `exports` again - super.initialise() isn't
    // idempotent either, so the guard has to cover it too.
    if (this.__initialised) return;
    this.__initialised = true;

    await super.initialise();

    for (const [name, value] of Object.entries(CSG_COLORS)) {
      (this as unknown as Record<string, string>)[name] = value;
      this.exports.push({
        symbol: name,
        value: { type: DataType.CONST_STRING, value }
      });
    }
  }

  /** Loads the host-side tab, lazily - the first time anything is displayed. */
  private __loadCsgTab(): void {
    if (this.__tabLoaded || this.__tabLoader === undefined) return;

    const tabName = this.__tabLoader.tabs.find(tab => tab === CSG_TAB_NAME);
    if (tabName === undefined) return;

    this.__tabLoader.loadTab(tabName);
    this.__tabLoaded = true;
  }

  private __display(message: CsgDisplayMessage): void {
    /* NOTE
      Only render messages belong in the replayable backlog. A download is a
      one-shot side effect (it triggers a real file save) rather than
      persistent scene state, so once the tab has already been requested at
      least once, a download is sent live and never buffered - replaying it to
      a later request (e.g. the tab being recreated) would silently re-save
      the file and retain its STL ArrayBuffers in memory indefinitely. Before
      the first request, it's still buffered (nothing has anywhere to go yet),
      but the constructor's request handler strips it out of __displayed right
      after that first flush, so later requests never see it again either.
    */
    if (message.type === 'render' || !this.__tabRequested) {
      this.__displayed.push(message);
    }
    this.__loadCsgTab();

    /* NOTE
      Nothing goes out until the tab has asked for its backlog. Sending live
      before then and replaying afterwards would deliver everything in that
      window twice, which for csg means duplicate canvases - each render call
      is its own canvas, so a duplicate is immediately visible.
    */
    if (this.__tabRequested) {
      this.__csgChannel.send(message);
    }
  }

  private async __getOperable(
    operable: TypedValue<DataType.OPAQUE>,
    funcName: string
  ): Promise<Operable> {
    const value = await this.evaluator.opaque_get(operable);
    if (!(value instanceof Shape || value instanceof Group)) {
      throw new EvaluatorParameterTypeError(funcName, undefined, 'Operable', value);
    }
    return value;
  }

  private async __getShape(
    shape: TypedValue<DataType.OPAQUE>,
    funcName: string,
    paramName?: string
  ): Promise<Shape> {
    const value = await this.evaluator.opaque_get(shape);
    if (!(value instanceof Shape)) {
      throw new EvaluatorParameterTypeError(funcName, paramName, 'Shape', value);
    }
    return value;
  }

  private async __makeOperable(operable: Operable): Promise<TypedValue<DataType.OPAQUE>> {
    return await this.evaluator.opaque_make(operable, true);
  }

  /** Stores the Operable into the current render group, then closes that group and draws it. */
  private async __render(
    operable: TypedValue<DataType.OPAQUE>,
    funcName: string,
    hasGrid: boolean,
    hasAxis: boolean
  ): Promise<TypedValue<DataType.OPAQUE>> {
    const value = await this.__getOperable(operable, funcName);
    value.store(this.__renderGroupManager);

    const renderGroup: RenderGroup = this.__renderGroupManager.nextRenderGroup(hasGrid, hasAxis);
    this.__display({
      type: 'render',
      solids: renderGroup.shapes.map(shape => serializeSolid(shape.solid)),
      hasGrid: renderGroup.hasGrid,
      hasAxis: renderGroup.hasAxis
    });

    // The render group is returned for REPL text only; do not document
    return await this.evaluator.opaque_make(renderGroup, true);
  }

  // [Primitives]

  /**
   * An empty Shape.
   *
   * @category Primitives
   * @publicReturnType Shape
   */
  async* empty_shape(): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__makeOperable(funcs.empty_shape());
  }

  /**
   * Returns a cube Shape in the specified color.
   *
   * - Side length: 1
   * - Center: (0.5, 0.5, 0.5)
   *
   * @param hex hex color code
   *
   * @category Primitives
   * @publicReturnType Shape
   */
  async* cube(hex: TypedValue<DataType.CONST_STRING>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__makeOperable(funcs.cube(hex.value));
  }

  /**
   * Returns a rounded cube Shape in the specified color.
   *
   * - Side length: 1
   * - Center: (0.5, 0.5, 0.5)
   *
   * @param hex hex color code
   *
   * @category Primitives
   * @publicReturnType Shape
   */
  async* rounded_cube(hex: TypedValue<DataType.CONST_STRING>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__makeOperable(funcs.rounded_cube(hex.value));
  }

  /**
   * Returns an upright cylinder Shape in the specified color.
   *
   * - Height: 1
   * - Radius: 0.5
   * - Center: (0.5, 0.5, 0.5)
   *
   * @param hex hex color code
   *
   * @category Primitives
   * @publicReturnType Shape
   */
  async* cylinder(hex: TypedValue<DataType.CONST_STRING>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__makeOperable(funcs.cylinder(hex.value));
  }

  /**
   * Returns a rounded, upright cylinder Shape in the specified color.
   *
   * - Height: 1
   * - Radius: 0.5
   * - Center: (0.5, 0.5, 0.5)
   *
   * @param hex hex color code
   *
   * @category Primitives
   * @publicReturnType Shape
   */
  async* rounded_cylinder(hex: TypedValue<DataType.CONST_STRING>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__makeOperable(funcs.rounded_cylinder(hex.value));
  }

  /**
   * Returns a sphere Shape in the specified color.
   *
   * - Radius: 0.5
   * - Center: (0.5, 0.5, 0.5)
   *
   * @param hex hex color code
   *
   * @category Primitives
   * @publicReturnType Shape
   */
  async* sphere(hex: TypedValue<DataType.CONST_STRING>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__makeOperable(funcs.sphere(hex.value));
  }

  /**
   * Returns a geodesic sphere Shape in the specified color.
   *
   * - Radius: 0.5
   * - Center: Floating at (0.5, 0.5, 0.5)
   *
   * @param hex hex color code
   *
   * @category Primitives
   * @publicReturnType Shape
   */
  async* geodesic_sphere(hex: TypedValue<DataType.CONST_STRING>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__makeOperable(funcs.geodesic_sphere(hex.value));
  }

  /**
   * Returns a square pyramid Shape in the specified color.
   *
   * - Height: 1
   * - Base length: 1
   * - Center: (0.5, 0.5, 0.5)
   *
   * @param hex hex color code
   *
   * @category Primitives
   * @publicReturnType Shape
   */
  async* pyramid(hex: TypedValue<DataType.CONST_STRING>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__makeOperable(funcs.pyramid(hex.value));
  }

  /**
   * Returns a cone Shape in the specified color.
   *
   * - Height: 1
   * - Radius: 0.5
   * - Center: (0.5, 0.5, 0.5)
   *
   * @param hex hex color code
   *
   * @category Primitives
   * @publicReturnType Shape
   */
  async* cone(hex: TypedValue<DataType.CONST_STRING>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__makeOperable(funcs.cone(hex.value));
  }

  /**
   * Returns an upright triangular prism Shape in the specified color.
   *
   * - Height: 1
   * - Side length: 1
   * - Center: (0.5, 0.5, 0.5)
   *
   * @param hex hex color code
   *
   * @category Primitives
   * @publicReturnType Shape
   */
  async* prism(hex: TypedValue<DataType.CONST_STRING>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__makeOperable(funcs.prism(hex.value));
  }

  /**
   * Returns an upright extruded star Shape in the specified color.
   *
   * - Height: 1
   * - Center: (0.5, 0.5, 0.5)
   *
   * @param hex hex color code
   *
   * @category Primitives
   * @publicReturnType Shape
   */
  async* star(hex: TypedValue<DataType.CONST_STRING>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__makeOperable(funcs.star(hex.value));
  }

  /**
   * Returns a torus (donut) Shape in the specified color.
   *
   * - Inner radius: 0.15 (ring is 0.3 thick)
   * - Total radius: 0.5 (from the centre of the hole to "outside")
   * - Center: Floating at (0.5, 0.5, 0.5)
   *
   * @param hex hex color code
   *
   * @category Primitives
   * @publicReturnType Shape
   */
  async* torus(hex: TypedValue<DataType.CONST_STRING>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__makeOperable(funcs.torus(hex.value));
  }

  // [Operations]

  /**
   * Returns the union of the two specified Shapes.
   *
   * @param first first Shape
   * @param second second Shape
   * @returns unioned Shape
   *
   * @category Operations
   * @publicType first: Shape
   * @publicType second: Shape
   * @publicReturnType Shape
   */
  async* union(
    first: TypedValue<DataType.OPAQUE>,
    second: TypedValue<DataType.OPAQUE>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__makeOperable(funcs.union(
      await this.__getShape(first, funcs.union.name, 'first'),
      await this.__getShape(second, funcs.union.name, 'second')
    ));
  }

  /**
   * Subtracts the second Shape from the first Shape, returning the resultant
   * Shape.
   *
   * @param target target Shape to be subtracted from
   * @param subtractedShape Shape to remove from the first Shape
   * @returns subtracted Shape
   *
   * @category Operations
   * @publicType target: Shape
   * @publicType subtractedShape: Shape
   * @publicReturnType Shape
   */
  async* subtract(
    target: TypedValue<DataType.OPAQUE>,
    subtractedShape: TypedValue<DataType.OPAQUE>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__makeOperable(funcs.subtract(
      await this.__getShape(target, funcs.subtract.name, 'target'),
      await this.__getShape(subtractedShape, funcs.subtract.name, 'subtractedShape')
    ));
  }

  /**
   * Returns the intersection of the two specified Shapes.
   *
   * @param first first Shape
   * @param second second Shape
   * @returns intersected Shape
   *
   * @category Operations
   * @publicType first: Shape
   * @publicType second: Shape
   * @publicReturnType Shape
   */
  async* intersect(
    first: TypedValue<DataType.OPAQUE>,
    second: TypedValue<DataType.OPAQUE>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__makeOperable(funcs.intersect(
      await this.__getShape(first, funcs.intersect.name, 'first'),
      await this.__getShape(second, funcs.intersect.name, 'second')
    ));
  }

  // [Transformations]

  /**
   * Translates (moves) the specified Operable in the x, y, and z directions using
   * the specified offsets.
   *
   * @param operable Shape or Group
   * @param xOffset x offset
   * @param yOffset y offset
   * @param zOffset z offset
   * @returns translated Shape
   *
   * @category Transformations
   * @publicType operable: Operable
   * @publicReturnType Operable
   */
  async* translate(
    operable: TypedValue<DataType.OPAQUE>,
    xOffset: TypedValue<DataType.NUMBER>,
    yOffset: TypedValue<DataType.NUMBER>,
    zOffset: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__makeOperable(funcs.translate(
      await this.__getOperable(operable, funcs.translate.name),
      xOffset.value,
      yOffset.value,
      zOffset.value
    ));
  }

  /**
   * Sequentially rotates the specified Operable about the x, y, and z axes using
   * the specified angles, in radians (i.e. 2π represents 360°).
   *
   * The order of rotation is: x, y, then z axis. The order of rotation can affect
   * the result, so you may wish to make multiple separate calls to rotate() if
   * you require a specific order of rotation.
   *
   * @param operable Shape or Group
   * @param xAngle x angle in radians
   * @param yAngle y angle in radians
   * @param zAngle z angle in radians
   * @returns rotated Shape
   *
   * @category Transformations
   * @publicType operable: Operable
   * @publicReturnType Operable
   */
  async* rotate(
    operable: TypedValue<DataType.OPAQUE>,
    xAngle: TypedValue<DataType.NUMBER>,
    yAngle: TypedValue<DataType.NUMBER>,
    zAngle: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__makeOperable(funcs.rotate(
      await this.__getOperable(operable, funcs.rotate.name),
      xAngle.value,
      yAngle.value,
      zAngle.value
    ));
  }

  /**
   * Scales the specified Operable in the x, y, and z directions using the
   * specified factors. Scaling is done about the origin (0, 0, 0).
   *
   * For example, a factor of 0.5 results in a smaller Shape, while a factor of 2
   * results in a larger Shape. A factor of 1 results in the original Shape.
   * Factors must be greater than 0.
   *
   * @param operable Shape or Group
   * @param xFactor x scaling factor
   * @param yFactor y scaling factor
   * @param zFactor z scaling factor
   * @returns scaled Shape
   *
   * @category Transformations
   * @publicType operable: Operable
   * @publicReturnType Operable
   */
  async* scale(
    operable: TypedValue<DataType.OPAQUE>,
    xFactor: TypedValue<DataType.NUMBER>,
    yFactor: TypedValue<DataType.NUMBER>,
    zFactor: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__makeOperable(funcs.scale(
      await this.__getOperable(operable, funcs.scale.name),
      xFactor.value,
      yFactor.value,
      zFactor.value
    ));
  }

  // [Utilities]

  /**
   * Groups the specified list of Operables together. Groups can contain a mix of
   * Shapes and other nested Groups.
   *
   * Groups cannot be operated on, but can be transformed together. I.e. a call
   * like `intersect(group_a, group_b)` is not allowed, but a call like
   * `scale(group, 5, 5, 5)` is.
   *
   * @param operables list of Shapes and/or Groups
   * @returns new Group
   *
   * @category Utilities
   * @publicType operables: List<Operable>
   * @publicReturnType Group
   */
  async* group(operables: TypedValue<DataType.LIST>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    const elements = await this.evaluator.list_to_vec(operables);
    const unwrapped: Operable[] = [];
    for (const element of elements) {
      if (element.type !== DataType.OPAQUE) {
        throw new EvaluatorParameterTypeError(funcs.group.name, undefined, 'list of Operables', element);
      }
      unwrapped.push(await this.__getOperable(element, funcs.group.name));
    }

    return await this.__makeOperable(funcs.group(unwrapped));
  }

  /**
   * Ungroups the specified Group, returning the list of Shapes and/or nested
   * Groups contained within.
   *
   * @param g Group to ungroup
   * @returns ungrouped list of Shapes and/or Groups
   *
   * @category Utilities
   * @publicType g: Group
   * @publicReturnType List<Operable>
   */
  async* ungroup(g: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.LIST>, undefined> {
    const value = await this.evaluator.opaque_get(g);
    if (!(value instanceof Group)) {
      throw new EvaluatorParameterTypeError(funcs.ungroup.name, undefined, 'Group', value);
    }

    const children = await Promise.all(
      funcs.ungroup(value).map(child => this.__makeOperable(child))
    );
    return await this.evaluator.list(...children);
  }

  /**
   * Checks if the given parameter is a Shape.
   *
   * @param parameter parameter to check
   * @returns whether parameter is a Shape
   *
   * @category Utilities
   */
  /* NOTE
    DataType.ANY, not OPAQUE: a predicate has to accept a value of any type and
    answer false, rather than throw on a type mismatch. The args array's length
    is also what determines the reported arity, so an empty one would make
    `is_shape(x)` fail as "takes 0 arguments but 1 was given".
  */
  async* is_shape(parameter?: TypedValue<DataType>): AsyncGenerator<void, TypedValue<DataType.BOOLEAN>, undefined> {
    return {
      type: DataType.BOOLEAN,
      value: funcs.is_shape(await this.__peekOpaque(parameter))
    };
  }

  /**
   * Checks if the given parameter is a Group.
   *
   * @param parameter parameter to check
   * @returns whether parameter is a Group
   *
   * @category Utilities
   */
  async* is_group(parameter?: TypedValue<DataType>): AsyncGenerator<void, TypedValue<DataType.BOOLEAN>, undefined> {
    return {
      type: DataType.BOOLEAN,
      value: funcs.is_group(await this.__peekOpaque(parameter))
    };
  }

  /** Unwraps a value only if it is an opaque handle, so predicates can inspect anything. */
  private async __peekOpaque(parameter?: TypedValue<DataType>): Promise<unknown> {
    if (parameter === undefined || parameter.type !== DataType.OPAQUE) return parameter?.value;
    return await this.evaluator.opaque_get(parameter);
  }

  /**
   * Returns a function of type (string, string) → number, for getting the
   * specified Shape's bounding box coordinates.
   *
   * Its first parameter must be "x", "y", or "z", indicating the coordinate axis.
   *
   * Its second parameter must be "min" or "max", indicating the minimum or
   * maximum bounding box coordinate respectively.
   *
   * For example, if a sphere of radius 0.5 is centred at (0.5, 0.5, 0.5), its
   * minimum bounding coordinates will be (0, 0, 0), and its maximum bounding
   * coordinates will be (1, 1, 1).
   *
   * ```js
   * // Sample usage
   * const getter_function = bounding_box(sphere(silver));
   * display(getter_function("y", "max")); // Displays 1, the maximum y coordinate
   * ```
   *
   * @param shape Shape to measure
   * @returns bounding box getter function
   *
   * @category Utilities
   * @publicType shape: Shape
   * @publicReturnType (string, string) => number
   */
  async* bounding_box(shape: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    const getter = funcs.bounding_box(await this.__getShape(shape, funcs.bounding_box.name));

    return await this.evaluator.closure_make(
      { returnType: DataType.NUMBER, args: [DataType.CONST_STRING, DataType.CONST_STRING] },
      async function* (
        axis: TypedValue<DataType.CONST_STRING>,
        minMax: TypedValue<DataType.CONST_STRING>
      ) {
        return { type: DataType.NUMBER as const, value: getter(axis.value, minMax.value) };
      }
    );
  }

  /**
   * Returns a hex color code representing the specified RGB values.
   *
   * @param redValue red value of the color
   * @param greenValue green value of the color
   * @param blueValue blue value of the color
   * @returns hex color code
   *
   * @category Utilities
   */
  async* rgb(
    redValue: TypedValue<DataType.NUMBER>,
    greenValue: TypedValue<DataType.NUMBER>,
    blueValue: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.CONST_STRING>, undefined> {
    return {
      type: DataType.CONST_STRING,
      value: funcs.rgb(redValue.value, greenValue.value, blueValue.value)
    };
  }

  /**
   * Exports the specified Shape as an STL file, downloaded to your device.
   *
   * The file can be used for purposes such as 3D printing.
   *
   * @param shape Shape to export
   *
   * @category Utilities
   * @publicType shape: Shape
   */
  async* download_shape_stl(shape: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    const funcName = 'download_shape_stl';
    const value = await this.__getShape(shape, funcName);
    this.__display({
      type: 'download',
      filename: STL_FILENAME,
      data: funcs.serializeShapeStl(value, funcName)
    });
    return { type: DataType.VOID, value: undefined };
  }

  // [Rendering]

  /**
   * Renders the specified Operable.
   *
   * @param operable Shape or Group to render
   *
   * @category Rendering
   * @publicType operable: Operable
   * @publicReturnType RenderGroup
   */
  async* render(operable: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__render(operable, 'render', false, false);
  }

  /**
   * Renders the specified Operable, along with a grid.
   *
   * @param operable Shape or Group to render
   *
   * @category Rendering
   * @publicType operable: Operable
   * @publicReturnType RenderGroup
   */
  async* render_grid(operable: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__render(operable, 'render_grid', true, false);
  }

  /**
   * Renders the specified Operable, along with z, y, and z axes.
   *
   * @param operable Shape or Group to render
   *
   * @category Rendering
   * @publicType operable: Operable
   * @publicReturnType RenderGroup
   */
  async* render_axes(operable: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__render(operable, 'render_axes', false, true);
  }

  /**
   * Renders the specified Operable, along with both a grid and axes.
   *
   * @param operable Shape or Group to render
   *
   * @category Rendering
   * @publicType operable: Operable
   * @publicReturnType RenderGroup
   */
  async* render_grid_axes(operable: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__render(operable, 'render_grid_axes', true, true);
  }
}

attachModuleMethod(CsgModulePlugin, 'bounding_box', [DataType.OPAQUE], DataType.CLOSURE);
attachModuleMethod(CsgModulePlugin, 'cone', [DataType.CONST_STRING], DataType.OPAQUE);
attachModuleMethod(CsgModulePlugin, 'cube', [DataType.CONST_STRING], DataType.OPAQUE);
attachModuleMethod(CsgModulePlugin, 'cylinder', [DataType.CONST_STRING], DataType.OPAQUE);
attachModuleMethod(CsgModulePlugin, 'download_shape_stl', [DataType.OPAQUE], DataType.VOID);
attachModuleMethod(CsgModulePlugin, 'empty_shape', [], DataType.OPAQUE);
attachModuleMethod(CsgModulePlugin, 'geodesic_sphere', [DataType.CONST_STRING], DataType.OPAQUE);
/* NOTE
  attachModuleMethod infers the declared DataTypes from each method's TypedValue
  parameters, and `TypedValue<DataType.LIST>` expands to
  `TypedValue<PAIR> | TypedValue<EMPTY_LIST>` - so what it infers for group and
  ungroup is that expansion rather than the DataType.LIST alias the evaluator
  wants. These two casts restate the alias; the emitted signature is unchanged.
*/
attachModuleMethod(CsgModulePlugin, 'group', [DataType.LIST] as unknown as [DataType.PAIR], DataType.OPAQUE);
attachModuleMethod(CsgModulePlugin, 'intersect', [DataType.OPAQUE, DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(CsgModulePlugin, 'is_group', [DataType.ANY], DataType.BOOLEAN);
attachModuleMethod(CsgModulePlugin, 'is_shape', [DataType.ANY], DataType.BOOLEAN);
attachModuleMethod(CsgModulePlugin, 'prism', [DataType.CONST_STRING], DataType.OPAQUE);
attachModuleMethod(CsgModulePlugin, 'pyramid', [DataType.CONST_STRING], DataType.OPAQUE);
attachModuleMethod(CsgModulePlugin, 'render', [DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(CsgModulePlugin, 'render_axes', [DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(CsgModulePlugin, 'render_grid', [DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(CsgModulePlugin, 'render_grid_axes', [DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(CsgModulePlugin, 'rgb', [DataType.NUMBER, DataType.NUMBER, DataType.NUMBER], DataType.CONST_STRING);
attachModuleMethod(CsgModulePlugin, 'rotate', [DataType.OPAQUE, DataType.NUMBER, DataType.NUMBER, DataType.NUMBER], DataType.OPAQUE);
attachModuleMethod(CsgModulePlugin, 'rounded_cube', [DataType.CONST_STRING], DataType.OPAQUE);
attachModuleMethod(CsgModulePlugin, 'rounded_cylinder', [DataType.CONST_STRING], DataType.OPAQUE);
attachModuleMethod(CsgModulePlugin, 'scale', [DataType.OPAQUE, DataType.NUMBER, DataType.NUMBER, DataType.NUMBER], DataType.OPAQUE);
attachModuleMethod(CsgModulePlugin, 'sphere', [DataType.CONST_STRING], DataType.OPAQUE);
attachModuleMethod(CsgModulePlugin, 'star', [DataType.CONST_STRING], DataType.OPAQUE);
attachModuleMethod(CsgModulePlugin, 'subtract', [DataType.OPAQUE, DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(CsgModulePlugin, 'torus', [DataType.CONST_STRING], DataType.OPAQUE);
attachModuleMethod(CsgModulePlugin, 'translate', [DataType.OPAQUE, DataType.NUMBER, DataType.NUMBER, DataType.NUMBER], DataType.OPAQUE);
attachModuleMethod(CsgModulePlugin, 'ungroup', [DataType.OPAQUE], DataType.LIST as unknown as DataType.PAIR);
attachModuleMethod(CsgModulePlugin, 'union', [DataType.OPAQUE, DataType.OPAQUE], DataType.OPAQUE);

/* NOTE
  The colours are plain string constants rather than methods, so
  BaseModulePlugin#initialise (which only walks exportedNames looking for
  signatured functions) never sees them - they are pushed onto `exports` by
  hand in the overridden initialise() above.
*/
const CSG_COLORS = {
  black: funcs.black,
  navy: funcs.navy,
  green: funcs.green,
  teal: funcs.teal,
  crimson: funcs.crimson,
  purple: funcs.purple,
  orange: funcs.orange,
  silver: funcs.silver,
  gray: funcs.gray,
  blue: funcs.blue,
  lime: funcs.lime,
  cyan: funcs.cyan,
  rose: funcs.rose,
  pink: funcs.pink,
  yellow: funcs.yellow,
  white: funcs.white
} as const;
