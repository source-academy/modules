/* [Imports] */
import InputTracker from './input_tracker.js';
import {
  cloneCameraState,
  makeWrappedRenderer,
  makeWrappedRendererData,
} from './jscad/renderer.js';
import type {
  Entity,
  PerspectiveCameraState,
  WrappedRenderer,
  WrappedRendererData,
} from './jscad/types.js';
import ListenerTracker from './listener_tracker.js';
import type { RenderGroup } from './utilities.js';

/* [Exports] */
export default class StatefulRenderer {
  private isStarted: boolean = false;
  private currentRequestId: number | null = null;

  private cameraState: PerspectiveCameraState = cloneCameraState();

  private webGlListenerTracker: ListenerTracker;

  private wrappedRendererData: WrappedRendererData;

  private inputTracker: InputTracker;

  constructor(
    private canvas: HTMLCanvasElement,
    renderGroup: RenderGroup,
    private componentNumber: number,

    private loseCallback: Function,
    private restoreCallback: Function,
  ) {
    //FIXME Issue #7
    this.cameraState.position = [1000, 1000, 1500];

    this.webGlListenerTracker = new ListenerTracker(canvas);

    this.wrappedRendererData = makeWrappedRendererData(
      renderGroup,
      this.cameraState,
    );

    this.inputTracker = new InputTracker(
      canvas,
      this.cameraState,
      this.wrappedRendererData.geometryEntities,
    );
  }

  private addWebGlListeners() {
    this.webGlListenerTracker.addListener(
      'webglcontextlost',
      (contextEvent: WebGLContextEvent) => {
        // Allow restoration of context
        contextEvent.preventDefault();

        console.debug(`>>> CONTEXT LOST FOR #${this.componentNumber}`);

        this.loseCallback();

        this.stop();
      },
    );

    this.webGlListenerTracker.addListener(
      'webglcontextrestored',
      (_contextEvent: WebGLContextEvent) => {
        console.debug(`>>> CONTEXT RESTORED FOR #${this.componentNumber}`);

        this.start();

        this.restoreCallback();
      },
    );
  }

  private forgetEntityCaches() {
    // Clear draw cache IDs so starting again doesn't try to retrieve
    // DrawCommands
    this.wrappedRendererData.entities.forEach((entity: Entity) => {
      entity.visuals.cacheId = null;
    });
  }

  start(firstStart = false) {
    if (this.isStarted) return;
    this.isStarted = true;

    if (!firstStart) {
      // As listeners were previously removed, flush some tracked inputs to
      // avoid bugs like the pointer being stuck down
      this.inputTracker.flushMidInput();

      this.forgetEntityCaches();
    }

    // Creating the WrappedRenderer already involves REGL. Losing WebGL context
    // requires repeating this step (ie, with each start())
    let wrappedRenderer: WrappedRenderer = makeWrappedRenderer(this.canvas);

    if (firstStart) this.addWebGlListeners();
    this.inputTracker.addListeners();

    let frameCallback: FrameRequestCallback = (
      _timestamp: DOMHighResTimeStamp,
    ) => {
      this.inputTracker.respondToInput();

      if (this.inputTracker.frameDirty) {
        console.debug(`>>> Frame for #${this.componentNumber}`);

        wrappedRenderer(this.wrappedRendererData);
        this.inputTracker.frameDirty = false;
      }

      this.currentRequestId = window.requestAnimationFrame(frameCallback);
    };
    if (!firstStart) {
      // Force draw upon restarting, eg after recovering from context loss
      this.inputTracker.frameDirty = true;
    }
    this.currentRequestId = window.requestAnimationFrame(frameCallback);
  }

  stop(lastStop = false) {
    if (this.currentRequestId !== null) {
      window.cancelAnimationFrame(this.currentRequestId);
      this.currentRequestId = null;
    }

    this.inputTracker.removeListeners();
    if (lastStop) this.webGlListenerTracker.removeListeners();

    this.isStarted = false;
  }
}
