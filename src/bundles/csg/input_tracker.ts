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
