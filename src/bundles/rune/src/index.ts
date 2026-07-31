/**
 * The module `rune` provides functions for drawing runes.
 *
 * A *Rune* is defined by its vertices (x,y,z,t), the colors on its vertices
 * (r,g,b,a), a transformation matrix for rendering the Rune and a list of
 * sub-Runes.
 * @module rune
 * @author Hou Ruomu
 */
import type { IChannel, IConduit } from '@sourceacademy/conductor/conduit';
import { BaseModulePlugin } from '@sourceacademy/conductor/module';
import type { IInterfacableEvaluator } from '@sourceacademy/conductor/runner';
import { DataType, type TypedValue } from '@sourceacademy/conductor/types';

import { attachModuleMethod } from '@sourceacademy/modules-lib/conductor/methods';
import { GeneralRuntimeError } from '@sourceacademy/modules-lib/errors';
import * as funcs from './functions';
import {
  RUNE_CHANNEL_ID,
  serializeRune,
  type RuneAnimationMessage,
  type RuneChannelMessage,
  type RuneDisplayMessage,
  type RuneRenderMessage
} from './protocol';
import { Rune } from './rune';
import { throwIfNotRune } from './runes_ops';

type RuneTabLoader = {
  tabs: string[];
  loadTab: (tab: string) => void;
};

export default class RuneModulePlugin extends BaseModulePlugin {
  id = 'rune';
  static override channelAttach = [RUNE_CHANNEL_ID];
  override exportedNames = [
    'anaglyph',
    'animate_anaglyph',
    'animate_rune',
    'beside',
    'beside_frac',
    'black',
    'blue',
    'brown',
    'color',
    'colour_with_hue',
    'flip_horiz',
    'flip_vert',
    'from_url',
    'green',
    'hollusion',
    'hollusion_magnitude',
    'indigo',
    'make_cross',
    'orange',
    'overlay',
    'overlay_frac',
    'pink',
    'purple',
    'quarter_turn_left',
    'quarter_turn_right',
    'random_color',
    'red',
    'repeat_pattern',
    'rotate',
    'scale',
    'scale_independent',
    'show',
    'stack',
    'stack_frac',
    'stackn',
    'translate',
    'turn_upside_down',
    'white',
    'yellow'
  ] as const;

  private readonly __runeChannel: IChannel<RuneChannelMessage>;
  private readonly __tabLoader: RuneTabLoader | undefined;
  private readonly __displayed: RuneDisplayMessage[] = [];
  private __tabLoaded = false;

  /**
   * Rune with the shape of a blank square
   *
   * @category Primitive
   * @publicType Rune
   */
  blank!: Rune;

  /**
   * Rune with the shape of a circle
   *
   * @category Primitive
   * @publicType Rune
   */
  circle!: Rune;

  /**
   * Rune with black triangle,
   * filling upper right corner
   *
   * @category Primitive
   * @publicType Rune
   */
  corner!: Rune;

  /**
   * Rune with the shape of a heart
   *
   * @category Primitive
   * @publicType Rune
   */
  heart!: Rune;

  /**
   * Rune with the shape of two overlapping
   * triangles, residing in the upper half
   * of the shape
   *
   * @category Primitive
   * @publicType Rune
   */
  nova!: Rune;

  /**
   * Rune with the shape of a pentagram
   *
   * @category Primitive
   * @publicType Rune
   */
  pentagram!: Rune;

  /**
   * Rune with the shape of a
   * small square inside a large square,
   * each diagonally split into a
   * black and white half
   *
   * @category Primitive
   * @publicType Rune
   */
  rcross!: Rune;

  /**
   * Rune with the shape of a ribbon
   * winding outwards in an anticlockwise spiral
   *
   * @category Primitive
   * @publicType Rune
   */
  ribbon!: Rune;

  /**
   * Rune with the shape of a sail
   *
   * @category Primitive
   * @publicType Rune
   */
  sail!: Rune;

  /**
   * Rune with the shape of a full square
   *
   * @category Primitive
   * @publicType Rune
   */
  square!: Rune;

  /**
   * Rune with the shape of a triangle
   *
   * @category Primitive
   * @publicType Rune
   */
  triangle!: Rune;

  constructor(
    conduit: IConduit,
    [runeChannel]: IChannel<any>[],
    evaluator: IInterfacableEvaluator,
    tabLoader: RuneTabLoader
  ) {
    super(conduit, [runeChannel], evaluator);

    if (!runeChannel) {
      throw new GeneralRuntimeError('Rune channel is required but was not provided.');
    }

    this.__runeChannel = runeChannel as IChannel<RuneChannelMessage>;
    this.__tabLoader = tabLoader;
    this.__runeChannel.subscribe(message => {
      if (message.type === 'request') {
        this.__displayed.forEach(displayedMessage => this.__runeChannel.send(displayedMessage));
      }
    });
  }

  override async initialise() {
    await super.initialise();
    for (const name in funcs.RuneFunctions) {
      const value = funcs.RuneFunctions[name as keyof typeof funcs.RuneFunctions];
      if (!(value instanceof Rune)) {
        continue;
      }
      (this as unknown as Record<string, Rune>)[name] = value;
      this.exports.push({
        symbol: name,
        value: await this.__makeRune(value)
      });
    }
  }

  /**
   * Loads the host-side tab
   * @returns Whether the tab was already loaded
   */
  private __loadRuneTab(): boolean {
    if (this.__tabLoaded || this.__tabLoader === undefined) return true;

    const tabName = this.__tabLoader.tabs[0];
    if (tabName === undefined) return true;

    this.__tabLoader.loadTab(tabName);
    this.__tabLoaded = true;
    return false;
  }

  private async __display(message: RuneDisplayMessage): Promise<void> {
    this.__displayed.push(message);
    if (this.__loadRuneTab()) {
      this.__runeChannel.send(message);
    }
  }

  private async __getRune(
    rune: TypedValue<DataType.OPAQUE>,
    funcName: string
  ): Promise<Rune> {
    const value = await this.evaluator.opaque_get(rune);
    throwIfNotRune(funcName, value);
    return value;
  }

  private async __makeRune(rune: Rune): Promise<TypedValue<DataType.OPAQUE>> {
    return await this.evaluator.opaque_make(rune, true);
  }

  private async __callUnaryRune(
    arg: TypedValue<DataType.OPAQUE>,
    funcName: string,
    operation: (rune: Rune) => Rune
  ): Promise<TypedValue<DataType.OPAQUE>> {
    return this.__makeRune(operation(await this.__getRune(arg, funcName)));
  }

  private async __sendRuneRender(
    rune: Rune,
    message: Omit<RuneRenderMessage, 'rune'>
  ): Promise<void> {
    await this.__display({
      ...message,
      rune: serializeRune(rune)
    });
  }

  private async* __evaluateAnimationFrames(
    duration: number,
    fps: number,
    func: TypedValue<DataType.CLOSURE>,
    funcName: string
  ): AsyncGenerator<void, RuneAnimationMessage['frames'], undefined> {
    const frameCount = Math.max(1, Math.ceil(duration * fps) + 1);
    const frames: RuneAnimationMessage['frames'] = [];

    for (let frame = 0; frame < frameCount; frame += 1) {
      const timestamp = Math.min(frame / fps, duration);
      const result = yield* this.evaluator.closure_call_unchecked(
        func as TypedValue<DataType.CLOSURE, DataType.OPAQUE>,
        [{ type: DataType.NUMBER, value: timestamp }]
      );
      frames.push(serializeRune(await this.__getRune(result, funcName)));
    }

    return frames;
  }

  /**
   * Renders the specified Rune in a tab as a basic drawing.
   * @function
   * @param rune - The Rune to render
   * @returns The specified Rune
   *
   * @category Main
   * @publicType rune: Rune
   * @publicReturnType Rune
   */
  async* show(rune: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    const value = await this.__getRune(rune, 'show');
    await this.__sendRuneRender(value, { type: 'render', mode: 'normal' });
    return rune;
  }

  /**
   * Renders the specified Rune in a tab as an anaglyph. Use 3D glasses to view the
   * anaglyph.
   * @function
   * @param rune - The Rune to render
   * @returns The specified Rune
   *
   * @category Main
   * @publicType rune: Rune
   * @publicReturnType Rune
   */
  async* anaglyph(rune: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    const value = await this.__getRune(rune, 'anaglyph');
    await this.__sendRuneRender(value, { type: 'render', mode: 'anaglyph' });
    return rune;
  }

  /**
   * Renders the specified Rune in a tab as a hollusion, using the specified
   * magnitude.
   * @function
   * @param rune - The Rune to render
   * @param magnitude - The hollusion's magnitude
   * @returns The specified Rune
   *
   * @category Main
   * @publicType rune: Rune
   * @publicReturnType Rune
   */
  async* hollusion_magnitude(
    rune: TypedValue<DataType.OPAQUE>,
    magnitude: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    const value = await this.__getRune(rune, 'hollusion_magnitude');
    await this.__sendRuneRender(value, {
      type: 'render',
      mode: 'hollusion',
      magnitude: magnitude.value
    });
    return rune;
  }

  /**
   * Renders the specified Rune in a tab as a hollusion, with a default magnitude
   * of 0.1.
   * @function
   * @param rune - The Rune to render
   * @returns The specified Rune
   *
   * @category Main
   * @publicType rune: Rune
   * @publicReturnType Rune
   */
  async* hollusion(rune: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    const value = await this.__getRune(rune, 'hollusion');
    await this.__sendRuneRender(value, {
      type: 'render',
      mode: 'hollusion',
      magnitude: 0.1
    });
    return rune;
  }

  /**
   * Create an animation of runes
   * @function
   * @param duration Duration of the entire animation in seconds
   * @param fps Duration of each frame in frames per seconds
   * @param func Takes in the timestamp and returns a Rune to draw
   * @returns A rune animation
   *
   * @category Main
   * @publicType func: RuneAnimation
   * @publicReturnType AnimatedRune
   */
  async* animate_rune(
    duration: TypedValue<DataType.NUMBER>,
    fps: TypedValue<DataType.NUMBER>,
    func: TypedValue<DataType.CLOSURE>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    const frames = yield* this.__evaluateAnimationFrames(duration.value, fps.value, func, 'animate_rune');
    const message: RuneAnimationMessage = {
      type: 'animation',
      mode: 'normal',
      duration: duration.value,
      fps: fps.value,
      frames
    };
    await this.__display(message);
    return await this.evaluator.opaque_make({ message, toReplString: () => '<AnimatedRune>' }, true);
  }

  /**
   * Create an animation of anaglyph runes
   * @function
   * @param duration Duration of the entire animation in seconds
   * @param fps Duration of each frame in frames per seconds
   * @param func Takes in the timestamp and returns a Rune to draw
   * @returns A rune animation
   *
   * @category Main
   * @publicType func: RuneAnimation
   * @publicReturnType AnimatedRune
   */
  async* animate_anaglyph(
    duration: TypedValue<DataType.NUMBER>,
    fps: TypedValue<DataType.NUMBER>,
    func: TypedValue<DataType.CLOSURE>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    const frames = yield* this.__evaluateAnimationFrames(duration.value, fps.value, func, 'animate_anaglyph');
    const message: RuneAnimationMessage = {
      type: 'animation',
      mode: 'anaglyph',
      duration: duration.value,
      fps: fps.value,
      frames
    };
    await this.__display(message);
    return await this.evaluator.opaque_make({ message, toReplString: () => '<AnimatedRune>' }, true);
  }

  /**
   * Create a rune using the image provided in the url
   * @param imageUrl URL to the image that is used to create the rune.
   * Note that the url must be from a domain that allows CORS.
   * @returns Rune created using the image.
   * @function
   *
   * @category Main
   * @publicReturnType Rune
   */
  async* from_url(imageUrl: TypedValue<DataType.CONST_STRING>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__makeRune(funcs.from_url(imageUrl.value));
  }

  /**
   * Scales a given Rune by separate factors in x and y direction
   * @param ratioX - Scaling factor in x direction
   * @param ratioY - Scaling factor in y direction
   * @param rune - Given Rune
   * @returns Resulting scaled Rune
   * @function
   *
   * @category Main
   * @publicType rune: Rune
   * @publicReturnType Rune
   */
  async* scale_independent(
    ratioX: TypedValue<DataType.NUMBER>,
    ratioY: TypedValue<DataType.NUMBER>,
    rune: TypedValue<DataType.OPAQUE>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__makeRune(funcs.scale_independent(ratioX.value, ratioY.value, await this.__getRune(rune, funcs.scale_independent.name)));
  }

  /**
   * Scales a given Rune by a given factor in both x and y direction
   * @param ratio - Scaling factor
   * @param rune - Given Rune
   * @returns Resulting scaled Rune
   * @function
   *
   * @category Main
   * @publicType rune: Rune
   * @publicReturnType Rune
   */
  async* scale(
    ratio: TypedValue<DataType.NUMBER>,
    rune: TypedValue<DataType.OPAQUE>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__makeRune(funcs.scale(ratio.value, await this.__getRune(rune, funcs.scale.name)));
  }

  /**
   * Translates a given Rune by given values in x and y direction
   * @param x - Translation in x direction
   * @param y - Translation in y direction
   * @param rune - Given Rune
   * @returns Resulting translated Rune
   * @function
   *
   * @category Main
   * @publicType rune: Rune
   * @publicReturnType Rune
   */
  async* translate(
    x: TypedValue<DataType.NUMBER>,
    y: TypedValue<DataType.NUMBER>,
    rune: TypedValue<DataType.OPAQUE>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__makeRune(funcs.translate(x.value, y.value, await this.__getRune(rune, funcs.translate.name)));
  }

  /**
   * Rotates a given Rune by a given angle,
   * given in radians, in anti-clockwise direction.
   * Note that parts of the Rune
   * may be cropped as a result.
   * @param rad - Angle in radians
   * @param rune - Given Rune
   * @returns Rotated Rune
   * @function
   *
   * @category Main
   * @publicType rune: Rune
   * @publicReturnType Rune
   */
  async* rotate(
    rad: TypedValue<DataType.NUMBER>,
    rune: TypedValue<DataType.OPAQUE>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__makeRune(funcs.rotate(rad.value, await this.__getRune(rune, funcs.rotate.name)));
  }

  /**
   * Makes a new Rune from two given Runes by
   * placing the first on top of the second
   * such that the first one occupies frac
   * portion of the height of the result and
   * the second the rest
   * @param frac - Fraction between 0 and 1 (inclusive)
   * @param rune1 - Given Rune
   * @param rune2 - Given Rune
   * @returns Resulting Rune
   * @function
   *
   * @category Main
   * @publicType rune1: Rune
   * @publicType rune2: Rune
   * @publicReturnType Rune
   */
  async* stack_frac(
    frac: TypedValue<DataType.NUMBER>,
    rune1: TypedValue<DataType.OPAQUE>,
    rune2: TypedValue<DataType.OPAQUE>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__makeRune(funcs.stack_frac(
      frac.value,
      await this.__getRune(rune1, funcs.stack_frac.name),
      await this.__getRune(rune2, funcs.stack_frac.name)
    ));
  }

  /**
   * Makes a new Rune from two given Runes by
   * placing the first on top of the second, each
   * occupying equal parts of the height of the
   * result
   * @param rune1 - Given Rune
   * @param rune2 - Given Rune
   * @returns Resulting Rune
   * @function
   *
   * @category Main
   * @publicType rune1: Rune
   * @publicType rune2: Rune
   * @publicReturnType Rune
   */
  async* stack(
    rune1: TypedValue<DataType.OPAQUE>,
    rune2: TypedValue<DataType.OPAQUE>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__makeRune(funcs.stack(
      await this.__getRune(rune1, funcs.stack.name),
      await this.__getRune(rune2, funcs.stack.name)
    ));
  }

  /**
   * Makes a new Rune from a given Rune
   * by vertically stacking n copies of it
   * @param n - Positive integer
   * @param rune - Given Rune
   * @returns Resulting Rune
   * @function
   *
   * @category Main
   * @publicType rune: Rune
   * @publicReturnType Rune
   */
  async* stackn(
    n: TypedValue<DataType.NUMBER>,
    rune: TypedValue<DataType.OPAQUE>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__makeRune(funcs.stackn(n.value, await this.__getRune(rune, funcs.stackn.name)));
  }

  /**
   * Makes a new Rune from a given Rune
   * by turning it a quarter-turn around the centre in
   * clockwise direction.
   * @param rune - Given Rune
   * @returns Resulting Rune
   * @function
   *
   * @category Main
   * @publicType rune: Rune
   * @publicReturnType Rune
   */
  async* quarter_turn_right(rune: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__callUnaryRune(rune, funcs.quarter_turn_right.name, funcs.quarter_turn_right);
  }

  /**
   * Makes a new Rune from a given Rune
   * by turning it a quarter-turn in
   * anti-clockwise direction.
   * @param rune - Given Rune
   * @returns Resulting Rune
   * @function
   *
   * @category Main
   * @publicType rune: Rune
   * @publicReturnType Rune
   */
  async* quarter_turn_left(rune: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__callUnaryRune(rune, funcs.quarter_turn_left.name, funcs.quarter_turn_left);
  }

  /**
   * Makes a new Rune from a given Rune
   * by turning it upside-down
   * @param rune - Given Rune
   * @returns Resulting Rune
   * @function
   *
   * @category Main
   * @publicType rune: Rune
   * @publicReturnType Rune
   */
  async* turn_upside_down(rune: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__callUnaryRune(rune, funcs.turn_upside_down.name, funcs.turn_upside_down);
  }

  /**
   * Makes a new Rune from two given Runes by
   * placing the first on the left of the second
   * such that the first one occupies frac
   * portion of the width of the result and
   * the second the rest
   * @param frac - Fraction between 0 and 1 (inclusive)
   * @param rune1 - Given Rune
   * @param rune2 - Given Rune
   * @returns Resulting Rune
   * @function
   *
   * @category Main
   * @publicType rune1: Rune
   * @publicType rune2: Rune
   * @publicReturnType Rune
   */
  async* beside_frac(
    frac: TypedValue<DataType.NUMBER>,
    rune1: TypedValue<DataType.OPAQUE>,
    rune2: TypedValue<DataType.OPAQUE>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__makeRune(funcs.beside_frac(
      frac.value,
      await this.__getRune(rune1, funcs.beside_frac.name),
      await this.__getRune(rune2, funcs.beside_frac.name)
    ));
  }

  /**
   * Makes a new Rune from two given Runes by
   * placing the first on the left of the second,
   * both occupying equal portions of the width
   * of the result
   * @param rune1 - Given Rune
   * @param rune2 - Given Rune
   * @returns Resulting Rune
   * @function
   *
   * @category Main
   * @publicType rune1: Rune
   * @publicType rune2: Rune
   * @publicReturnType Rune
   */
  async* beside(
    rune1: TypedValue<DataType.OPAQUE>,
    rune2: TypedValue<DataType.OPAQUE>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__makeRune(funcs.beside(
      await this.__getRune(rune1, funcs.beside.name),
      await this.__getRune(rune2, funcs.beside.name)
    ));
  }

  /**
   * Makes a new Rune from a given Rune by
   * flipping it around a horizontal axis,
   * turning it upside down
   * @param rune - Given Rune
   * @returns Resulting Rune
   * @function
   *
   * @category Main
   * @publicType rune: Rune
   * @publicReturnType Rune
   */
  async* flip_vert(rune: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__callUnaryRune(rune, funcs.flip_vert.name, funcs.flip_vert);
  }

  /**
   * Makes a new Rune from a given Rune by
   * flipping it around a vertical axis,
   * creating a mirror image
   * @param rune - Given Rune
   * @returns Resulting Rune
   * @function
   *
   * @category Main
   * @publicType rune: Rune
   * @publicReturnType Rune
   */
  async* flip_horiz(rune: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__callUnaryRune(rune, funcs.flip_horiz.name, funcs.flip_horiz);
  }

  /**
   * Makes a new Rune from a given Rune by
   * arranging into a square for copies of the
   * given Rune in different orientations
   * @param rune - Given Rune
   * @returns Resulting Rune
   * @function
   *
   * @category Main
   * @publicType rune: Rune
   * @publicReturnType Rune
   */
  async* make_cross(rune: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__callUnaryRune(rune, funcs.make_cross.name, funcs.make_cross);
  }

  /**
   * Applies a given function n times to an initial value
   * @param n - A non-negative integer
   * @param pattern - Unary function from Rune to Rune
   * @param initial - The initial Rune
   * @returns - Result of n times application of pattern to initial:
   * pattern(pattern(...pattern(pattern(initial))...))
   * @function
   *
   * @category Main
   * @publicType pattern: (Rune) => Rune
   * @publicType initial: Rune
   * @publicReturnType Rune
   */
  async* repeat_pattern(
    n: TypedValue<DataType.NUMBER>,
    pattern: TypedValue<DataType.CLOSURE>,
    initial: TypedValue<DataType.OPAQUE>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    let current = initial;
    for (let i = 0; i < n.value; i += 1) {
      current = yield* this.evaluator.closure_call_unchecked(
        pattern as TypedValue<DataType.CLOSURE, DataType.OPAQUE>,
        [current]
      );
      await this.__getRune(current, funcs.repeat_pattern.name);
    }
    return current;
  }

  /**
   * The depth range of the z-axis of a rune is [0,-1], this function gives a [0, -frac] of the depth range to rune1 and the rest to rune2.
   * @param frac - Fraction between 0 and 1 (inclusive)
   * @param rune1 - Given Rune
   * @param rune2 - Given Rune
   * @returns Resulting Rune
   * @function
   *
   * @category Main
   * @publicType rune1: Rune
   * @publicType rune2: Rune
   * @publicReturnType Rune
   */
  async* overlay_frac(
    frac: TypedValue<DataType.NUMBER>,
    rune1: TypedValue<DataType.OPAQUE>,
    rune2: TypedValue<DataType.OPAQUE>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__makeRune(funcs.overlay_frac(
      frac.value,
      await this.__getRune(rune1, funcs.overlay_frac.name),
      await this.__getRune(rune2, funcs.overlay_frac.name)
    ));
  }

  /**
   * The depth range of the z-axis of a rune is [0,-1], this function maps the depth range of rune1 and rune2 to [0,-0.5] and [-0.5,-1] respectively.
   * @param rune1 - Given Rune
   * @param rune2 - Given Rune
   * @returns Resulting Runes
   * @function
   *
   * @category Main
   * @publicType rune1: Rune
   * @publicType rune2: Rune
   * @publicReturnType Rune
   */
  async* overlay(
    rune1: TypedValue<DataType.OPAQUE>,
    rune2: TypedValue<DataType.OPAQUE>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__makeRune(funcs.overlay(
      await this.__getRune(rune1, funcs.overlay.name),
      await this.__getRune(rune2, funcs.overlay.name)
    ));
  }

  /**
   * Adds color to rune by specifying
   * the red, green, blue (RGB) value, ranging from 0.0 to 1.0.
   * RGB is additive: if all values are 1, the color is white,
   * and if all values are 0, the color is black.
   * @param rune - The rune to add color to
   * @param r - Red value [0.0, 1.0]
   * @param g - Green value [0.0, 1.0]
   * @param b - Blue value [0.0, 1.0]
   * @returns The colored Rune
   * @function
   *
   * @category Color
   * @publicType rune: Rune
   * @publicReturnType Rune
   */
  async* color(
    rune: TypedValue<DataType.OPAQUE>,
    r: TypedValue<DataType.NUMBER>,
    g: TypedValue<DataType.NUMBER>,
    b: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__makeRune(funcs.color(await this.__getRune(rune, funcs.color.name), r.value, g.value, b.value));
  }

  /**
   * Colors a given rune using a hue value in the range [0, 1], where 0 and 1 are
   * red. If the hue value is outside this range it gets mapped to [0, 1]
   * @param rune - The rune to color
   * @param hue - Hue value to use
   * @returns The colored Rune
   * @function
   *
   * @category Color
   * @publicType rune: Rune
   * @publicReturnType Rune
   */
  async* colour_with_hue(
    rune: TypedValue<DataType.OPAQUE>,
    hue: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__makeRune(funcs.colour_with_hue(await this.__getRune(rune, funcs.colour_with_hue.name), hue.value));
  }

  /**
   * Colors the given rune black (#000000).
   * @param rune - The rune to color
   * @returns The colored Rune
   * @function
   *
   * @category Color
   * @publicType rune: Rune
   * @publicReturnType Rune
   */
  async* black(rune: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__callUnaryRune(rune, funcs.black.name, funcs.black);
  }

  /**
   * Colors the given rune blue (#2196F3).
   * @param rune - The rune to color
   * @returns The colored Rune
   * @function
   *
   * @category Color
   * @publicType rune: Rune
   * @publicReturnType Rune
   */
  async* blue(rune: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__callUnaryRune(rune, funcs.blue.name, funcs.blue);
  }

  /**
   * Colors the given rune brown.
   * @param rune - The rune to color
   * @returns The colored Rune
   * @function
   *
   * @category Color
   * @publicType rune: Rune
   * @publicReturnType Rune
   */
  async* brown(rune: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__callUnaryRune(rune, funcs.brown.name, funcs.brown);
  }

  /**
   * Colors the given rune green (#4CAF50).
   * @param rune - The rune to color
   * @returns The colored Rune
   * @function
   *
   * @category Color
   * @publicType rune: Rune
   * @publicReturnType Rune
   */
  async* green(rune: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__callUnaryRune(rune, funcs.green.name, funcs.green);
  }

  /**
   * Colors the given rune indigo (#3F51B5).
   * @param rune - The rune to color
   * @returns The colored Rune
   * @function
   *
   * @category Color
   * @publicType rune: Rune
   * @publicReturnType Rune
   */
  async* indigo(rune: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__callUnaryRune(rune, funcs.indigo.name, funcs.indigo);
  }

  /**
   * Colors the given rune red (#F44336).
   * @param rune - The rune to color
   * @returns The colored Rune
   * @function
   *
   * @category Color
   * @publicType rune: Rune
   * @publicReturnType Rune
   */
  async* red(rune: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__callUnaryRune(rune, funcs.red.name, funcs.red);
  }

  /**
   * Colors the given rune pink (#E91E63s).
   * @param rune - The rune to color
   * @returns The colored Rune
   * @function
   *
   * @category Color
   * @publicType rune: Rune
   * @publicReturnType Rune
   */
  async* pink(rune: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__callUnaryRune(rune, funcs.pink.name, funcs.pink);
  }

  /**
   * Colors the given rune orange (#FF9800).
   * @param rune - The rune to color
   * @returns The colored Rune
   * @function
   *
   * @category Color
   * @publicType rune: Rune
   * @publicReturnType Rune
   */
  async* orange(rune: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__callUnaryRune(rune, funcs.orange.name, funcs.orange);
  }

  /**
   * Colors the given rune purple (#AA00FF).
   * @param rune - The rune to color
   * @returns The colored Rune
   * @function
   *
   * @category Color
   * @publicType rune: Rune
   * @publicReturnType Rune
   */
  async* purple(rune: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__callUnaryRune(rune, funcs.purple.name, funcs.purple);
  }

  /**
   * Colors the given rune white (#FFFFFF).
   * @param rune - The rune to color
   * @returns The colored Rune
   * @function
   *
   * @category Color
   * @publicType rune: Rune
   * @publicReturnType Rune
   */
  async* white(rune: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__callUnaryRune(rune, funcs.white.name, funcs.white);
  }

  /**
   * Colors the given rune yellow (#FFEB3B).
   * @param rune - The rune to color
   * @returns The colored Rune
   * @function
   *
   * @category Color
   * @publicType rune: Rune
   * @publicReturnType Rune
   */
  async* yellow(rune: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__callUnaryRune(rune, funcs.yellow.name, funcs.yellow);
  }

  /**
   * Gives random color to the given rune.
   * The color is chosen randomly from the following nine
   * colors: red, pink, purple, indigo, blue, green, yellow, orange, brown
   * @param rune - The rune to color
   * @returns The colored Rune
   * @function
   *
   * @category Color
   * @publicType rune: Rune
   * @publicReturnType Rune
   */
  async* random_color(rune: TypedValue<DataType.OPAQUE>): AsyncGenerator<void, TypedValue<DataType.OPAQUE>, undefined> {
    return await this.__callUnaryRune(rune, funcs.random_color.name, funcs.random_color);
  }
}

attachModuleMethod(RuneModulePlugin, 'anaglyph', [DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'animate_anaglyph', [DataType.NUMBER, DataType.NUMBER, DataType.CLOSURE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'animate_rune', [DataType.NUMBER, DataType.NUMBER, DataType.CLOSURE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'beside', [DataType.OPAQUE, DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'beside_frac', [DataType.NUMBER, DataType.OPAQUE, DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'black', [DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'blue', [DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'brown', [DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'color', [DataType.OPAQUE, DataType.NUMBER, DataType.NUMBER, DataType.NUMBER], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'colour_with_hue', [DataType.OPAQUE, DataType.NUMBER], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'flip_horiz', [DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'flip_vert', [DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'from_url', [DataType.CONST_STRING], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'green', [DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'hollusion', [DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'hollusion_magnitude', [DataType.OPAQUE, DataType.NUMBER], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'indigo', [DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'make_cross', [DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'orange', [DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'overlay', [DataType.OPAQUE, DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'overlay_frac', [DataType.NUMBER, DataType.OPAQUE, DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'pink', [DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'purple', [DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'quarter_turn_left', [DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'quarter_turn_right', [DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'random_color', [DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'red', [DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'repeat_pattern', [DataType.NUMBER, DataType.CLOSURE, DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'rotate', [DataType.NUMBER, DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'scale', [DataType.NUMBER, DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'scale_independent', [DataType.NUMBER, DataType.NUMBER, DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'show', [DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'stack', [DataType.OPAQUE, DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'stack_frac', [DataType.NUMBER, DataType.OPAQUE, DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'stackn', [DataType.NUMBER, DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'translate', [DataType.NUMBER, DataType.NUMBER, DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'turn_upside_down', [DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'white', [DataType.OPAQUE], DataType.OPAQUE);
attachModuleMethod(RuneModulePlugin, 'yellow', [DataType.OPAQUE], DataType.OPAQUE);
