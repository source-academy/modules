/**
 * The pix_n_flix module allows us to process still images and videos.
 *
 * An image (a still image or a frame of a video) is an opaque handle - not a Source-level array -
 * accessed one channel at a time via get_pixel_value/set_pixel_value, where the channel index p
 * is 0 (red), 1 (green), 2 (blue) or 3 (alpha), each ranging from 0 to 255.
 *
 * A central element of pix_n_flix is the notion of a Filter, a function that is applied
 * to two images: the source image and the destination image. When a Filter is installed
 * (using the function install_filter), it transforms each source image from the live camera
 * or from a local/remote file to a destination image that is then displayed on screen
 * in the Source Academy "Pix N Flix" tab (with a camera icon).
 *
 * The dimensions (i.e. width and height) of the displayed images can be set by the user using
 * the function set_dimensions, and all source and destination images of the Filters will
 * also be set to the same dimensions. To access the current dimensions of the images, the user
 * can use the functions image_width and image_height.
 *
 * @module pix_n_flix
 * @author Loh Xian Ze, Bryan
 * @author Tang Xin Kye, Marcus
 */
import { EvaluatorParameterTypeError, EvaluatorRuntimeError } from '@sourceacademy/conductor/common';
import { makeRpc, type IChannel, type IConduit } from '@sourceacademy/conductor/conduit';
import { BaseModulePlugin, moduleMethod } from '@sourceacademy/conductor/module';
import type { IInterfacableEvaluator } from '@sourceacademy/conductor/runner';
import { DataType, type IDataHandler, type TypedValue } from '@sourceacademy/conductor/types';

import {
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
  MAX_FPS,
  MAX_HEIGHT,
  MAX_WIDTH,
  MIN_FPS,
  MIN_HEIGHT,
  MIN_WIDTH
} from './constants';
import { assertPixelCoordinates, copyImageBuffer, makeImageBuffer, readChannel, writeChannel } from './functions';
import {
  PIX_N_FLIX_CONTROL_CHANNEL_ID,
  PIX_N_FLIX_FRAME_CHANNEL_ID,
  type CapturedFrameMessage,
  type FrameChannelMessage,
  type PixNFlixTabRpc
} from './protocol';
import type { ImageBuffer } from './types';

type PixNFlixTabLoader = {
  tabs: string[];
  loadTab: (tab: string) => void;
};

/**
 * Calls a student filter closure, preferring the synchronous fast path over the mandatory
 * async-generator drain - mirrors sound's closureToWave probe. A filter closure crossing from
 * Python into this module (install_filter's/compose_filter's argument) already carries a `.sync`
 * twin of its own (py2js's moduleInterop.ts, pyClosureFunc.sync) with no engine-side fix needed -
 * that twin exists independently of get_pixel_value/set_pixel_value's own .sync twins, and without
 * attempting it here first, the filter always runs via its regular async-generator body, whose
 * *internal* get_pixel_value/set_pixel_value calls then also go through the async spine
 * regardless of those functions' own sync capability (dual-mode compilation gives every user
 * function two bodies over the same closure environment - which one runs is decided by how the
 * *filter itself* was invoked, not by each call it happens to make). closure_call_sync is not part
 * of conductor's own IDataHandler contract (implemented by py-slang's shared, engine-agnostic
 * GenericDataHandler) - present regardless of which engine is running, but only actually usable
 * when the specific closure carries a `.sync` twin (CSE/PVML closures never do).
 */
async function callFilterClosure(
  evaluator: IDataHandler,
  filter: TypedValue<DataType.CLOSURE>,
  src: TypedValue<DataType.OPAQUE>,
  dest: TypedValue<DataType.OPAQUE>
): Promise<void> {
  const syncCall = (
    evaluator as IDataHandler & {
      closure_call_sync?: (
        c: TypedValue<DataType.CLOSURE>,
        args: TypedValue<DataType>[]
      ) => TypedValue<DataType> | undefined;
    }
  ).closure_call_sync?.bind(evaluator);
  if (syncCall?.(filter, [src, dest]) !== undefined) return;

  const gen = evaluator.closure_call_unchecked(filter, [src, dest]);
  let step = await gen.next();
  while (!step.done) step = await gen.next();
}

export default class PixNFlixModulePlugin extends BaseModulePlugin {
  id = 'pix_n_flix';
  override exportedNames = [
    'get_pixel_value',
    'set_pixel_value',
    'image_height',
    'image_width',
    'copy_image',
    'install_filter',
    'reset_filter',
    'compose_filter',
    'pause_at',
    'set_dimensions',
    'set_fps',
    'set_volume',
    'use_local_file',
    'use_image_url',
    'use_video_url',
    'get_video_time',
    'keep_aspect_ratio',
    'set_loop_count'
  ] as const;
  static override channelAttach = [PIX_N_FLIX_CONTROL_CHANNEL_ID, PIX_N_FLIX_FRAME_CHANNEL_ID];

  private readonly __tabRpc: PixNFlixTabRpc;
  private readonly __frameChannel: IChannel<FrameChannelMessage>;

  private readonly __tabLoader: PixNFlixTabLoader | undefined;
  private __tabLoaded = false;

  // Registered per-frame via opaque_make/`__registerBuffer`, keyed by the same
  // TypedValue<DataType.OPAQUE>.value identifier - a synchronously-readable shadow of
  // GenericDataHandler's own (async-only) opaque bookkeeping, since get_pixel_value/
  // set_pixel_value's `.sync` twin can never `await evaluator.opaque_get`.
  private readonly __buffers = new Map<number, ImageBuffer>();

  // undefined means "use the built-in copy filter" - the common case, applied via a direct
  // buffer copy with no Conductor closure call at all, rather than round-tripping install_filter's
  // own default through a closure_call_unchecked for every single frame.
  private __filter: TypedValue<DataType.CLOSURE> | undefined;

  private __width = DEFAULT_WIDTH;
  private __height = DEFAULT_HEIGHT;

  constructor(
    conduit: IConduit,
    [controlChannel, frameChannel]: IChannel<any>[],
    evaluator: IInterfacableEvaluator,
    tabLoader?: PixNFlixTabLoader
  ) {
    super(conduit, [controlChannel, frameChannel], evaluator);
    if (!controlChannel || !frameChannel) {
      // An internal wiring precondition (Conductor's host failed to provide the channels this
      // plugin declared via channelAttach) - never reachable from student code.
      // eslint-disable-next-line @sourceacademy/throw-runtime-error
      throw new Error('Pix n Flix control/frame channels are required but were not provided.');
    }
    this.__tabLoader = tabLoader;
    this.__tabRpc = makeRpc<Record<string, never>, PixNFlixTabRpc>(controlChannel, {});
    this.__frameChannel = frameChannel as IChannel<FrameChannelMessage>;
    this.__frameChannel.subscribe(message => {
      if (message.kind === 'captured-frame') void this.__handleCapturedFrame(message);
    });
  }

  /** Loads the host-side tab lazily, only once the module is actually used (matches sound's
    `__ensureTabLoaded`). */
  private __ensureTabLoaded(): void {
    if (this.__tabLoaded || this.__tabLoader === undefined) return;
    const tabName = this.__tabLoader.tabs[0];
    if (tabName === undefined) return;
    this.__tabLoader.loadTab(tabName);
    this.__tabLoaded = true;
  }

  private __registerBuffer(buffer: ImageBuffer): Promise<TypedValue<DataType.OPAQUE>> {
    return this.evaluator.opaque_make(buffer).then(typed => {
      this.__buffers.set(typed.value, buffer);
      return typed;
    });
  }

  private __unregisterBuffer(typed: TypedValue<DataType.OPAQUE>): void {
    this.__buffers.delete(typed.value);
  }

  private async __getBuffer(handle: TypedValue<DataType.OPAQUE>, funcName: string): Promise<ImageBuffer> {
    const value = await this.evaluator.opaque_get(handle);
    if (!value || typeof value !== 'object' || !('view' in value)) {
      // eslint-disable-next-line @sourceacademy/throw-runtime-error
      throw new EvaluatorParameterTypeError(funcName, undefined, 'an image', value);
    }
    return value as ImageBuffer;
  }

  private async __handleCapturedFrame(message: CapturedFrameMessage): Promise<void> {
    const srcBuffer: ImageBuffer = { view: new Uint8ClampedArray(message.buffer), width: message.width, height: message.height };
    const destBuffer = makeImageBuffer(message.width, message.height);
    const srcHandle = await this.__registerBuffer(srcBuffer);
    const destHandle = await this.__registerBuffer(destBuffer);

    try {
      if (this.__filter === undefined) {
        copyImageBuffer(srcBuffer, destBuffer);
      } else {
        await callFilterClosure(this.evaluator, this.__filter, srcHandle, destHandle);
      }
    } catch (e) {
      // A filter error here happens outside any single exported call the evaluator can attribute
      // to student code (this runs once per frame, off the draw loop, not in response to a
      // direct Source-level call) - matches the pre-migration drawImage's behaviour of falling
      // back to the default filter and continuing to render, rather than killing the video feed
      // over one bad frame.
      console.error('pix_n_flix filter error, resetting to the default filter:', e);
      this.__filter = undefined;
      copyImageBuffer(srcBuffer, destBuffer);
    } finally {
      this.__unregisterBuffer(srcHandle);
      this.__unregisterBuffer(destHandle);
    }

    // destBuffer is always freshly allocated by makeImageBuffer via `new Uint8ClampedArray(n)`,
    // so its `.buffer` is always a plain ArrayBuffer - `.buffer`'s declared type (ArrayBufferLike)
    // is only wider because a Uint8ClampedArray could in general wrap a SharedArrayBuffer instead.
    const outBuffer = destBuffer.view.buffer as ArrayBuffer;
    this.__frameChannel.send({ kind: 'filtered-frame', buffer: outBuffer }, [outBuffer]);
  }

  @moduleMethod([DataType.OPAQUE, DataType.NUMBER, DataType.NUMBER, DataType.NUMBER], DataType.NUMBER)
  async* get_pixel_value(
    source: TypedValue<DataType.OPAQUE>,
    x: TypedValue<DataType.NUMBER>,
    y: TypedValue<DataType.NUMBER>,
    p: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.NUMBER>, undefined> {
    const buffer = await this.__getBuffer(source, 'get_pixel_value');
    assertPixelCoordinates(buffer, x.value, y.value, p.value, 'get_pixel_value');
    return { type: DataType.NUMBER, value: readChannel(buffer, x.value, y.value, p.value) };
  }

  @moduleMethod([DataType.OPAQUE, DataType.NUMBER, DataType.NUMBER, DataType.NUMBER, DataType.NUMBER], DataType.VOID)
  async* set_pixel_value(
    dest: TypedValue<DataType.OPAQUE>,
    x: TypedValue<DataType.NUMBER>,
    y: TypedValue<DataType.NUMBER>,
    p: TypedValue<DataType.NUMBER>,
    v: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    const buffer = await this.__getBuffer(dest, 'set_pixel_value');
    assertPixelCoordinates(buffer, x.value, y.value, p.value, 'set_pixel_value');
    writeChannel(buffer, x.value, y.value, p.value, v.value);
    return { type: DataType.VOID, value: undefined };
  }

  @moduleMethod([], DataType.NUMBER)
  async* image_width(): AsyncGenerator<void, TypedValue<DataType.NUMBER>, undefined> {
    return { type: DataType.NUMBER, value: this.__width };
  }

  @moduleMethod([], DataType.NUMBER)
  async* image_height(): AsyncGenerator<void, TypedValue<DataType.NUMBER>, undefined> {
    return { type: DataType.NUMBER, value: this.__height };
  }

  @moduleMethod([DataType.OPAQUE, DataType.OPAQUE], DataType.VOID)
  async* copy_image(
    src: TypedValue<DataType.OPAQUE>,
    dest: TypedValue<DataType.OPAQUE>
  ): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    const srcBuffer = await this.__getBuffer(src, 'copy_image');
    const destBuffer = await this.__getBuffer(dest, 'copy_image');
    copyImageBuffer(srcBuffer, destBuffer);
    return { type: DataType.VOID, value: undefined };
  }

  @moduleMethod([DataType.CLOSURE], DataType.VOID)
  async* install_filter(filter: TypedValue<DataType.CLOSURE>): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    // install_filter is the realistic "first call" for most programs - unlike sound's play()/
    // record(), it doesn't otherwise touch the tab, so without this the tab would never load and
    // the video feed would never appear even though install_filter itself succeeds silently.
    this.__ensureTabLoaded();
    this.__filter = filter;
    // TEMPORARY DEMO WORKAROUND, not a final design decision: the frontend tears down a Run's
    // Worker (and the tab riding on the same conduit) as soon as the evaluator reaches a terminal
    // status - see evalCode.ts's `yield take(actions.beginInterruptExecution.type)` / the
    // `conduit.terminate()` in its `finally` block. For a script that's just `install_filter(f)`
    // with nothing else, that terminal status arrives almost instantly, destroying the tab (and
    // therefore the whole per-frame pipeline) before a single frame gets processed. Sound avoids
    // this because play()/record() are themselves long-lived calls that only resolve once real
    // playback/recording finishes - install_filter has no equivalent natural duration, so this
    // never resolves at all, keeping the Run (and the video feed) alive until the student clicks
    // Stop or starts another Run (a hard Worker.terminate(), unaffected by whether this generator
    // ever cooperatively finishes). The real fix belongs in a decision with Martin about whether
    // Conductor should support a module keeping a Run alive deliberately, not this hack.
    await new Promise<void>(() => {});
    return { type: DataType.VOID, value: undefined };
  }

  @moduleMethod([], DataType.VOID)
  async* reset_filter(): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    this.__ensureTabLoaded();
    this.__filter = undefined;
    return { type: DataType.VOID, value: undefined };
  }

  @moduleMethod([DataType.CLOSURE, DataType.CLOSURE], DataType.CLOSURE)
  async* compose_filter(
    filter1: TypedValue<DataType.CLOSURE>,
    filter2: TypedValue<DataType.CLOSURE>
  ): AsyncGenerator<void, TypedValue<DataType.CLOSURE>, undefined> {
    const evaluator = this.evaluator;
    const registerBuffer = this.__registerBuffer.bind(this);
    const unregisterBuffer = this.__unregisterBuffer.bind(this);
    const getBuffer = this.__getBuffer.bind(this);

    return evaluator.closure_make(
      { returnType: DataType.VOID, args: [DataType.OPAQUE, DataType.OPAQUE] },
      async function* (src: TypedValue<DataType.OPAQUE>, dest: TypedValue<DataType.OPAQUE>) {
        const srcBuffer = await getBuffer(src, 'compose_filter');
        const tempBuffer = makeImageBuffer(srcBuffer.width, srcBuffer.height);
        const tempHandle = await registerBuffer(tempBuffer);
        try {
          await callFilterClosure(evaluator, filter1, src, tempHandle);
          await callFilterClosure(evaluator, filter2, tempHandle, dest);
        } finally {
          unregisterBuffer(tempHandle);
        }
        return { type: DataType.VOID, value: undefined };
      }
    );
  }

  @moduleMethod([DataType.NUMBER], DataType.VOID)
  async* pause_at(pause_time: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    this.__ensureTabLoaded();
    if (pause_time.value < 0) {

      throw new EvaluatorRuntimeError('pause_at: pause_time must be non-negative.');
    }
    this.__tabRpc.$pauseAt(pause_time.value);
    return { type: DataType.VOID, value: undefined };
  }

  @moduleMethod([DataType.NUMBER, DataType.NUMBER], DataType.VOID)
  async* set_dimensions(
    width: TypedValue<DataType.NUMBER>,
    height: TypedValue<DataType.NUMBER>
  ): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    this.__ensureTabLoaded();
    if (width.value < MIN_WIDTH || width.value > MAX_WIDTH || height.value < MIN_HEIGHT || height.value > MAX_HEIGHT) {
      return { type: DataType.VOID, value: undefined };
    }
    this.__width = width.value;
    this.__height = height.value;
    await this.__tabRpc.updateDimensions(width.value, height.value);
    return { type: DataType.VOID, value: undefined };
  }

  @moduleMethod([DataType.NUMBER], DataType.VOID)
  async* set_fps(fps: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    this.__ensureTabLoaded();
    if (fps.value >= MIN_FPS && fps.value <= MAX_FPS) {
      this.__tabRpc.$updateFPS(fps.value);
    }
    return { type: DataType.VOID, value: undefined };
  }

  @moduleMethod([DataType.NUMBER], DataType.VOID)
  async* set_volume(volume: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    this.__ensureTabLoaded();
    const clamped = Math.max(0, Math.min(100, volume.value)) / 100;
    this.__tabRpc.$updateVolume(clamped);
    return { type: DataType.VOID, value: undefined };
  }

  @moduleMethod([], DataType.VOID)
  async* use_local_file(): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    this.__ensureTabLoaded();
    await this.__tabRpc.useLocalFile();
    return { type: DataType.VOID, value: undefined };
  }

  @moduleMethod([DataType.CONST_STRING], DataType.VOID)
  async* use_image_url(url: TypedValue<DataType.CONST_STRING>): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    this.__ensureTabLoaded();
    await this.__tabRpc.useImageUrl(url.value);
    return { type: DataType.VOID, value: undefined };
  }

  @moduleMethod([DataType.CONST_STRING], DataType.VOID)
  async* use_video_url(url: TypedValue<DataType.CONST_STRING>): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    this.__ensureTabLoaded();
    await this.__tabRpc.useVideoUrl(url.value);
    return { type: DataType.VOID, value: undefined };
  }

  @moduleMethod([], DataType.NUMBER)
  async* get_video_time(): AsyncGenerator<void, TypedValue<DataType.NUMBER>, undefined> {
    this.__ensureTabLoaded();
    const value = await this.__tabRpc.getVideoTime();
    return { type: DataType.NUMBER, value };
  }

  @moduleMethod([DataType.BOOLEAN], DataType.VOID)
  async* keep_aspect_ratio(keep: TypedValue<DataType.BOOLEAN>): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    this.__ensureTabLoaded();
    this.__tabRpc.$keepAspectRatio(keep.value);
    return { type: DataType.VOID, value: undefined };
  }

  @moduleMethod([DataType.NUMBER], DataType.VOID)
  async* set_loop_count(n: TypedValue<DataType.NUMBER>): AsyncGenerator<void, TypedValue<DataType.VOID>, undefined> {
    this.__ensureTabLoaded();
    this.__tabRpc.$setLoopCount(n.value === Infinity ? -1 : n.value);
    return { type: DataType.VOID, value: undefined };
  }

  static {
    // get_pixel_value/set_pixel_value's `.sync` twin: a plain synchronous in-memory buffer
    // read/write against __buffers (never GenericDataHandler.opaque_get, which is async - see
    // ImageBuffer's doc comment). Attached here (a static block, part of the class body, so
    // TypeScript's private-member access rules still apply to __buffers) rather than inside the
    // methods themselves, mirroring how @moduleMethod itself only ever sets `.signature` once at
    // class-definition time - BaseModulePlugin.initialise() re-binds both `.signature` and
    // `.sync` to each instance afterward (see conductor's BaseModulePlugin.ts).
    Object.assign(PixNFlixModulePlugin.prototype.get_pixel_value, {
      sync(
        this: PixNFlixModulePlugin,
        source: TypedValue<DataType.OPAQUE>,
        x: TypedValue<DataType.NUMBER>,
        y: TypedValue<DataType.NUMBER>,
        p: TypedValue<DataType.NUMBER>
      ): TypedValue<DataType.NUMBER> | undefined {
        const buffer = this.__buffers.get(source.value);
        if (!buffer) return undefined;
        assertPixelCoordinates(buffer, x.value, y.value, p.value, 'get_pixel_value');
        return { type: DataType.NUMBER, value: readChannel(buffer, x.value, y.value, p.value) };
      }
    });
    Object.assign(PixNFlixModulePlugin.prototype.set_pixel_value, {
      sync(
        this: PixNFlixModulePlugin,
        dest: TypedValue<DataType.OPAQUE>,
        x: TypedValue<DataType.NUMBER>,
        y: TypedValue<DataType.NUMBER>,
        p: TypedValue<DataType.NUMBER>,
        v: TypedValue<DataType.NUMBER>
      ): TypedValue<DataType.VOID> | undefined {
        const buffer = this.__buffers.get(dest.value);
        if (!buffer) return undefined;
        assertPixelCoordinates(buffer, x.value, y.value, p.value, 'set_pixel_value');
        writeChannel(buffer, x.value, y.value, p.value, v.value);
        return { type: DataType.VOID, value: undefined };
      }
    });
    // image_width/image_height/copy_image are just as trivially sync-safe as get/set_pixel_value
    // (a plain field read or buffer copy, never any real async work) - once a filter runs via its
    // own .sync twin (see callFilterClosure), any *other* module function it calls needs one too,
    // or the call throws outright: a call already running on the synchronous trampoline
    // (rt.callSync/__py.call) has no way to "escalate" mid-call to the async spine if the callee
    // turns out to need it - see moduleInterop.ts's "needs a frontend round-trip" error, which is
    // exactly what image_width()/image_height() hit before these were added.
    Object.assign(PixNFlixModulePlugin.prototype.image_width, {
      sync(this: PixNFlixModulePlugin): TypedValue<DataType.NUMBER> {
        return { type: DataType.NUMBER, value: this.__width };
      }
    });
    Object.assign(PixNFlixModulePlugin.prototype.image_height, {
      sync(this: PixNFlixModulePlugin): TypedValue<DataType.NUMBER> {
        return { type: DataType.NUMBER, value: this.__height };
      }
    });
    Object.assign(PixNFlixModulePlugin.prototype.copy_image, {
      sync(
        this: PixNFlixModulePlugin,
        src: TypedValue<DataType.OPAQUE>,
        dest: TypedValue<DataType.OPAQUE>
      ): TypedValue<DataType.VOID> | undefined {
        const srcBuffer = this.__buffers.get(src.value);
        const destBuffer = this.__buffers.get(dest.value);
        if (!srcBuffer || !destBuffer) return undefined;
        copyImageBuffer(srcBuffer, destBuffer);
        return { type: DataType.VOID, value: undefined };
      }
    });
  }
}
