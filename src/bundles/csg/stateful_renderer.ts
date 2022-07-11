/* [Imports] */
import { LOG_FREQUENCY } from './constants.js';
import {
  cloneCameraState,
  cloneControlsState,
  makeWrappedRenderer,
  makeWrappedRendererData,
} from './jscad/renderer.js';
import {
  ControlsState,
  Entity,
  WrappedRenderer,
  WrappedRendererData,
} from './jscad/types.js';
import { RenderGroup } from './utilities.js';

/* [Main] */
enum MousePointer {
  // Based on MouseEvent#button
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2,
  BACK = 3,
  FORWARD = 4,

  NONE = -1,
  OTHER = 7050,
}

class InputTracker {
  private zoomTicks = 0;

  // Start off the first frame by initially zooming to fit
  private doZoomToFit = true;

  private heldPointer: MousePointer = MousePointer.NONE;

  lastX = -1;
  lastY = -1;

  rotateX = 0;
  rotateY = 0;

  panX = 0;
  panY = 0;

  getZoomTicks(): number {
    return this.zoomTicks;
  }

  changeZoomTicks(wheelDelta: number) {
    this.zoomTicks += Math.sign(wheelDelta);
  }

  setZoomToFit() {
    this.doZoomToFit = true;
  }

  setHeldPointer(mouseEventButton: number) {
    switch (mouseEventButton) {
      case MousePointer.LEFT:
      case MousePointer.RIGHT:
      case MousePointer.MIDDLE:
      case MousePointer.FORWARD:
      case MousePointer.BACK:
        this.heldPointer = mouseEventButton;
        break;
      default:
        this.heldPointer = MousePointer.OTHER;
        break;
    }
  }

  unsetHeldPointer() {
    this.heldPointer = MousePointer.NONE;
  }

  shouldZoom(): boolean {
    return this.zoomTicks !== 0;
  }

  didZoom() {
    this.zoomTicks = 0;
  }

  shouldZoomToFit(): boolean {
    return this.doZoomToFit;
  }

  didZoomToFit() {
    this.doZoomToFit = false;
  }

  shouldIgnorePointerMove(): boolean {
    return [MousePointer.NONE, MousePointer.RIGHT].includes(this.heldPointer);
  }

  isPointerPan(isShiftKey: boolean): boolean {
    return (
      this.heldPointer === MousePointer.MIDDLE ||
      (this.heldPointer === MousePointer.LEFT && isShiftKey)
    );
  }

  unsetLastCoordinates() {
    this.lastX = -1;
    this.lastY = -1;
  }

  shouldRotate(): boolean {
    return this.rotateX !== 0 || this.rotateY !== 0;
  }

  didRotate() {
    this.rotateX = 0;
    this.rotateY = 0;
  }

  shouldPan(): boolean {
    return this.panX !== 0 || this.panY !== 0;
  }

  didPan() {
    this.panX = 0;
    this.panY = 0;
  }
}

/* [Exports] */
export default class StatefulRenderer {
  private inputTracker: InputTracker = new InputTracker();
  private controlsState: ControlsState = cloneControlsState();

  private isStarted: boolean = false;
  private currentRequestId: number = -1;

  private wrappedRendererData: WrappedRendererData;

  constructor(
    private canvas: HTMLCanvasElement,
    renderGroup: RenderGroup,
    private componentNumber: number
  ) {
    let cameraState = cloneCameraState();
    //FIXME Issue #7
    cameraState.position = [1000, 1000, 1500];

    this.wrappedRendererData = makeWrappedRendererData(
      renderGroup,
      cameraState
    );
  }

  private addWebGlListeners() {
    this.canvas.addEventListener(
      'webglcontextlost',
      (contextEvent: Event): void => {
        contextEvent = contextEvent as WebGLContextEvent;

        // Allow restoration of context
        contextEvent.preventDefault();

        console.debug(`>>> CONTEXT LOST FOR #${this.componentNumber}`);

        this.stop();
      }
    );

    this.canvas.addEventListener(
      'webglcontextrestored',
      (_contextEvent: Event): void => {
        _contextEvent = _contextEvent as WebGLContextEvent;

        console.debug(`>>> CONTEXT RESTORED FOR #${this.componentNumber}`);

        this.start();
      }
    );
  }

  start() {
    if (this.isStarted) return;
    this.isStarted = true;

    // Creating the WrappedRenderer already involves REGL. Losing WebGL context
    // requires repeating this step (ie, with each start())
    let wrappedRenderer: WrappedRenderer = makeWrappedRenderer(this.canvas);

    this.addWebGlListeners();

    //TODO register controls as addInputListeners()

    let frameCounter: number = 0;
    let animationCallback = (_timestamp: DOMHighResTimeStamp) => {
      frameCounter = ++frameCounter % LOG_FREQUENCY;
      if (frameCounter === 1)
        console.debug(`>>> Frame interval for #${this.componentNumber}`);

      //TODO react to controls
      // doDynamicResize(canvas, perspectiveCameraState);

      // if (frameTracker.shouldZoom()) {
      //   doZoom(
      //     frameTracker.getZoomTicks(),
      //     perspectiveCameraState,
      //     controlsState
      //   );
      //   frameTracker.didZoom();
      // }

      // if (frameTracker.shouldZoomToFit()) {
      //   doZoomToFit(geometryEntities, perspectiveCameraState, controlsState);
      //   frameTracker.didZoomToFit();
      // }

      // if (frameTracker.shouldRotate()) {
      //   doRotate(
      //     frameTracker.rotateX,
      //     frameTracker.rotateY,
      //     perspectiveCameraState,
      //     controlsState
      //   );
      //   frameTracker.didRotate();
      // }

      // if (frameTracker.shouldPan()) {
      //   doPan(
      //     frameTracker.panX,
      //     frameTracker.panY,
      //     perspectiveCameraState,
      //     controlsState
      //   );
      //   frameTracker.didPan();
      // }

      wrappedRenderer(this.wrappedRendererData);

      this.currentRequestId = window.requestAnimationFrame(animationCallback);
    };
    this.currentRequestId = window.requestAnimationFrame(animationCallback);
  }

  stop() {
    if (!this.isStarted) return;

    window.cancelAnimationFrame(this.currentRequestId);

    //TODO remove all stored listeners (they must first get stored)

    //TODO reset the mid-tracking of the input listener by calling a method on it,
    // eg to prevent mouse stuck down

    // Clear draw cache IDs so starting again doesn't try to retrieve
    // DrawCommands
    this.wrappedRendererData.entities.forEach((entity: Entity) => {
      entity.visuals.cacheId = null;
    });

    this.isStarted = false;
  }
}
