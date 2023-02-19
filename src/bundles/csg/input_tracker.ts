/* [Imports] */
import vec3 from '@jscad/modeling/src/maths/vec3';
import { ZOOM_TICK_SCALE } from './constants.js';
import {
  cloneControlsState,
  pan,
  rotate,
  updateProjection,
  updateStates,
  zoomToFit,
} from './jscad/renderer.js';
import type {
  ControlsState,
  GeometryEntity,
  PerspectiveCameraState,
} from './jscad/types.js';
import ListenerTracker from './listener_tracker.js';

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

/* [Exports] */
export default class InputTracker {
  private controlsState: ControlsState = cloneControlsState();

  // Start off the first frame by initially zooming to fit
  private zoomToFit: boolean = true;

  private zoomTicks: number = 0;

  private heldPointer: MousePointer = MousePointer.NONE;

  private lastX: number | null = null;
  private lastY: number | null = null;

  private rotateX: number = 0;
  private rotateY: number = 0;
  private panX: number = 0;
  private panY: number = 0;

  private listenerTracker: ListenerTracker;

  // Set to true when a new frame must be requested, as states have changed and
  // the canvas should look different
  public frameDirty: boolean = false;

  constructor(
    private canvas: HTMLCanvasElement,
    private cameraState: PerspectiveCameraState,
    private geometryEntities: GeometryEntity[],
  ) {
    this.listenerTracker = new ListenerTracker(canvas);
  }

  private changeZoomTicks(wheelDelta: number) {
    // Regardless of scroll magnitude, which the OS can change, each event
    // firing should only tick once up or down
    this.zoomTicks += Math.sign(wheelDelta);
  }

  private setHeldPointer(mouseEventButton: number) {
    switch (mouseEventButton) {
      case MousePointer.LEFT:
      case MousePointer.RIGHT:
      case MousePointer.MIDDLE:
        this.heldPointer = mouseEventButton;
        break;
      default:
        this.heldPointer = MousePointer.OTHER;
        break;
    }
  }

  private unsetHeldPointer() {
    this.heldPointer = MousePointer.NONE;
  }

  private shouldIgnorePointerMove(): boolean {
    return ![MousePointer.LEFT, MousePointer.MIDDLE].includes(this.heldPointer);
  }

  private isPointerPan(isShiftKey: boolean): boolean {
    return (
      this.heldPointer === MousePointer.MIDDLE
      || (this.heldPointer === MousePointer.LEFT && isShiftKey)
    );
  }

  private unsetLastCoordinates() {
    this.lastX = null;
    this.lastY = null;
  }

  private tryDynamicResize() {
    let { width: oldWidth, height: oldHeight } = this.canvas;

    // Account for display scaling
    let canvasBounds: DOMRect = this.canvas.getBoundingClientRect();
    let { devicePixelRatio } = window;
    let newWidth: number = Math.floor(canvasBounds.width * devicePixelRatio);
    let newHeight: number = Math.floor(canvasBounds.height * devicePixelRatio);

    if (oldWidth === newWidth && oldHeight === newHeight) return;
    this.frameDirty = true;

    this.canvas.width = newWidth;
    this.canvas.height = newHeight;

    updateProjection(this.cameraState, newWidth, newHeight);
  }

  private tryZoomToFit() {
    if (!this.zoomToFit) return;
    this.frameDirty = true;

    zoomToFit(this.cameraState, this.controlsState, this.geometryEntities);

    this.zoomToFit = false;
  }

  private tryZoom() {
    if (this.zoomTicks === 0) return;

    while (this.zoomTicks !== 0) {
      let currentTick: number = Math.sign(this.zoomTicks);
      this.zoomTicks -= currentTick;

      let scaledChange: number = currentTick * ZOOM_TICK_SCALE;
      let potentialNewScale: number = this.controlsState.scale + scaledChange;
      let potentialNewDistance: number
        = vec3.distance(this.cameraState.position, this.cameraState.target)
        * potentialNewScale;

      if (
        potentialNewDistance > this.controlsState.limits.minDistance
        && potentialNewDistance < this.controlsState.limits.maxDistance
      ) {
        this.frameDirty = true;
        this.controlsState.scale = potentialNewScale;
      } else break;
    }

    this.zoomTicks = 0;
  }

  private tryRotate() {
    if (this.rotateX === 0 && this.rotateY === 0) return;
    this.frameDirty = true;

    rotate(this.cameraState, this.controlsState, this.rotateX, this.rotateY);

    this.rotateX = 0;
    this.rotateY = 0;
  }

  private tryPan() {
    if (this.panX === 0 && this.panY === 0) return;
    this.frameDirty = true;

    pan(this.cameraState, this.controlsState, this.panX, this.panY);

    this.panX = 0;
    this.panY = 0;
  }

  addListeners() {
    this.listenerTracker.addListener('dblclick', (_mouseEvent: MouseEvent) => {
      this.zoomToFit = true;
    });

    this.listenerTracker.addListener(
      'wheel',
      (wheelEvent: WheelEvent) => {
        // Prevent scrolling the side panel when there is overflow
        wheelEvent.preventDefault();

        this.changeZoomTicks(wheelEvent.deltaY);
      },
      // Force wait for our potential preventDefault()
      { passive: false },
    );

    this.listenerTracker.addListener(
      'pointerdown',
      (pointerEvent: PointerEvent) => {
        // Prevent middle-click from activating auto-scrolling
        pointerEvent.preventDefault();

        this.setHeldPointer(pointerEvent.button);
        this.lastX = pointerEvent.pageX;
        this.lastY = pointerEvent.pageY;

        // Detect drags even outside the canvas element's borders
        this.canvas.setPointerCapture(pointerEvent.pointerId);
      },
      // Force wait for our potential preventDefault()
      { passive: false },
    );

    this.listenerTracker.addListener(
      'pointerup',
      (pointerEvent: PointerEvent) => {
        this.unsetHeldPointer();
        this.unsetLastCoordinates();

        this.canvas.releasePointerCapture(pointerEvent.pointerId);
      },
    );

    this.listenerTracker.addListener(
      'pointermove',
      (pointerEvent: PointerEvent) => {
        if (this.shouldIgnorePointerMove()) return;

        let currentX = pointerEvent.pageX;
        let currentY = pointerEvent.pageY;

        if (this.lastX !== null && this.lastY !== null) {
          // If tracked before, use differences to react to input
          let differenceX = this.lastX - currentX;
          let differenceY = this.lastY - currentY;

          if (this.isPointerPan(pointerEvent.shiftKey)) {
            // Drag right (X increases)
            // Camera right (still +)
            // Viewport left (invert to -)
            this.panX += differenceX;

            // Drag down (Y increases)
            // Camera down (invert to -)
            // Viewport up (still -)
            this.panY -= differenceY;
          } else {
            // Else default to rotate

            // Drag right (X increases)
            // Camera angle from origin left (invert to -)
            this.rotateX -= differenceX;

            // Drag down (Y increases)
            // Camera angle from origin up (still +)
            this.rotateY += differenceY;
          }
        }

        this.lastX = currentX;
        this.lastY = currentY;
      },
    );
  }

  removeListeners() {
    this.listenerTracker.removeListeners();
  }

  respondToInput() {
    this.tryZoomToFit();
    this.tryZoom();
    this.tryRotate();
    this.tryPan();
    if (this.frameDirty) updateStates(this.cameraState, this.controlsState);

    // A successful resize dirties the frame, but does not require
    // updateStates(), only its own updateProjection()
    this.tryDynamicResize();
  }

  flushMidInput() {
    this.unsetHeldPointer();
    this.unsetLastCoordinates();
  }
}
