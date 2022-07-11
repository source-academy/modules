/* [Imports] */
import { LOG_FREQUENCY } from './constants.js';
import InputTracker from './input_tracker.js';
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

/* [Exports] */
export default class StatefulRenderer {
  private inputTracker: InputTracker = new InputTracker();
  private controlsState: ControlsState = cloneControlsState();

  private webGlListeners: [string, Function][] = [];
  private inputListeners: [string, Function][] = [];

  private isStarted: boolean = false;
  private currentRequestId: number | null = null;

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

  private addWebGlListener(eventType: string, listener: Function) {
    this.webGlListeners.push([eventType, listener]);
    this.canvas.addEventListener(
      eventType,
      listener as EventListenerOrEventListenerObject
    );
  }

  private addInputListener(
    eventType: string,
    listener: Function,
    options?: AddEventListenerOptions
  ) {
    this.inputListeners.push([eventType, listener]);
    this.canvas.addEventListener(
      eventType,
      listener as EventListenerOrEventListenerObject,
      options
    );
  }

  private addWebGlListeners() {
    this.addWebGlListener(
      'webglcontextlost',
      (contextEvent: WebGLContextEvent): void => {
        // Allow restoration of context
        contextEvent.preventDefault();

        console.debug(`>>> CONTEXT LOST FOR #${this.componentNumber}`);

        this.stop();
      }
    );

    this.addWebGlListener(
      'webglcontextrestored',
      (_contextEvent: WebGLContextEvent): void => {
        console.debug(`>>> CONTEXT RESTORED FOR #${this.componentNumber}`);

        this.start();
      }
    );
  }

  private addInputListeners() {
    let inputTracker: InputTracker = this.inputTracker;

    this.addInputListener(
      'wheel',
      (wheelEvent: WheelEvent): void => {
        inputTracker.changeZoomTicks(wheelEvent.deltaY);

        // Prevent scrolling the side panel when there is overflow
        wheelEvent.preventDefault();
      },
      // Force wait for our potential preventDefault()
      { passive: false }
    );

    this.addInputListener('dblclick', (_mouseEvent: MouseEvent): void => {
      inputTracker.setZoomToFit();
    });

    this.addInputListener(
      'pointerdown',
      (pointerEvent: PointerEvent): void => {
        inputTracker.setHeldPointer(pointerEvent.button);
        inputTracker.lastX = pointerEvent.pageX;
        inputTracker.lastY = pointerEvent.pageY;

        // Detect drags even outside the canvas element's borders
        this.canvas.setPointerCapture(pointerEvent.pointerId);

        // Prevent middle-click from activating auto-scrolling
        pointerEvent.preventDefault();
      },
      { passive: false }
    );

    this.addInputListener('pointerup', (pointerEvent: PointerEvent): void => {
      inputTracker.unsetHeldPointer();
      inputTracker.unsetLastCoordinates();

      this.canvas.releasePointerCapture(pointerEvent.pointerId);
    });

    this.addInputListener('pointermove', (pointerEvent: PointerEvent): void => {
      let currentX = pointerEvent.pageX;
      let currentY = pointerEvent.pageY;
      if (inputTracker.lastX < 0 || inputTracker.lastY < 0) {
        // If never tracked before, let differences result in 0
        inputTracker.lastX = currentX;
        inputTracker.lastY = currentY;
      }

      if (!inputTracker.shouldIgnorePointerMove()) {
        let differenceX = inputTracker.lastX - currentX;
        let differenceY = inputTracker.lastY - currentY;

        if (inputTracker.isPointerPan(pointerEvent.shiftKey)) {
          inputTracker.panX += differenceX;
          inputTracker.panY -= differenceY;
        } else {
          // Else default to rotate
          inputTracker.rotateX -= differenceX;
          inputTracker.rotateY += differenceY;
        }
      }

      inputTracker.lastX = currentX;
      inputTracker.lastY = currentY;
    });
  }

  private removeWebGlListeners() {
    this.webGlListeners.forEach(([eventType, listener]) => {
      this.canvas.removeEventListener(
        eventType,
        listener as EventListenerOrEventListenerObject
      );
    });
  }

  private removeInputListeners() {
    this.inputListeners.forEach(([eventType, listener]) => {
      this.canvas.removeEventListener(
        eventType,
        listener as EventListenerOrEventListenerObject
      );
    });
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

    // Creating the WrappedRenderer already involves REGL. Losing WebGL context
    // requires repeating this step (ie, with each start())
    let wrappedRenderer: WrappedRenderer = makeWrappedRenderer(this.canvas);

    if (firstStart) this.addWebGlListeners();
    this.addInputListeners();

    let frameCounter: number = 0;
    let animationCallback: FrameRequestCallback = (
      _timestamp: DOMHighResTimeStamp
    ) => {
      frameCounter = ++frameCounter % LOG_FREQUENCY;
      if (frameCounter === 1)
        console.debug(`>>> Frame interval for #${this.componentNumber}`);

      //TODOO react to controls
      // doDynamicResize(canvas, perspectiveCameraState);

      // if (inputTracker.shouldZoom()) {
      //   doZoom(
      //     inputTracker.getZoomTicks(),
      //     perspectiveCameraState,
      //     controlsState
      //   );
      //   inputTracker.didZoom();
      // }

      // if (inputTracker.shouldZoomToFit()) {
      //   doZoomToFit(geometryEntities, perspectiveCameraState, controlsState);
      //   inputTracker.didZoomToFit();
      // }

      // if (inputTracker.shouldRotate()) {
      //   doRotate(
      //     inputTracker.rotateX,
      //     inputTracker.rotateY,
      //     perspectiveCameraState,
      //     controlsState
      //   );
      //   inputTracker.didRotate();
      // }

      // if (inputTracker.shouldPan()) {
      //   doPan(
      //     inputTracker.panX,
      //     inputTracker.panY,
      //     perspectiveCameraState,
      //     controlsState
      //   );
      //   inputTracker.didPan();
      // }

      wrappedRenderer(this.wrappedRendererData);

      this.currentRequestId = window.requestAnimationFrame(animationCallback);
    };
    this.currentRequestId = window.requestAnimationFrame(animationCallback);
  }

  stop(lastStop = false) {
    if (this.currentRequestId !== null) {
      window.cancelAnimationFrame(this.currentRequestId);
      this.currentRequestId = null;
    }

    if (lastStop) this.removeWebGlListeners();
    this.removeInputListeners();

    if (!lastStop) {
      //TODO reset the mid-tracking of the input listener by calling a method on it,
      // eg to prevent mouse stuck down

      this.forgetEntityCaches();
    }

    this.isStarted = false;
  }
}
