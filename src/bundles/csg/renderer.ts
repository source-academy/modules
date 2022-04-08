/* [Imports] */
import vec3 from '@jscad/modeling/src/maths/vec3';
import { measureBoundingBox } from '@jscad/modeling/src/measurements';
import {
  BoundingBox,
  ControlsState,
  ControlsUpdate,
  ControlsZoomToFit,
  Entity,
  GeometryEntity,
  PerspectiveCameraState,
  PrepareRender,
  WrappedRenderer,
} from './types';
import {
  AxisEntity,
  CameraViewportDimensions,
  controls,
  controlsStateDefaults,
  entitiesFromSolids,
  FrameTracker,
  MultiGridEntity,
  perspectiveCamera,
  perspectiveCameraStateDefaults,
  prepareDrawCommands,
  prepareRender,
  Shape,
} from './utilities';

/* [Main] */
function makeWrappedRenderer(
  canvas: HTMLCanvasElement
): WrappedRenderer.Function {
  const prepareRenderOptions: PrepareRender.AllOptions = {
    glOptions: { canvas },
  };
  return prepareRender(prepareRenderOptions);
}

function getSize(shape: Shape): number {
  const shapeBoundingBox: BoundingBox = measureBoundingBox(shape.getSolid());
  const scalingFactor: number = 1.2;
  return Math.ceil(
    scalingFactor *
      Math.max(
        Math.abs(shapeBoundingBox[0][0]),
        Math.abs(shapeBoundingBox[0][1]),
        Math.abs(shapeBoundingBox[0][2]),
        Math.abs(shapeBoundingBox[1][0]),
        Math.abs(shapeBoundingBox[1][1]),
        Math.abs(shapeBoundingBox[1][2])
      )
  );
}

function addEntities(
  shape: Shape,
  geometryEntities: GeometryEntity[]
): Entity[] {
  const allEntities: Entity[] = [...geometryEntities];

  const size = getSize(shape);

  if (shape.addAxis) {
    const axis: AxisEntity.Type = {
      ...new AxisEntity.Class(),
      size,
    };
    allEntities.push(axis);
  }
  if (shape.addMultiGrid) {
    const grid: MultiGridEntity.Type = {
      ...new MultiGridEntity.Class(),
      size: [size * 2, size * 2],
    };
    allEntities.push(grid);
  }

  return allEntities;
}

function adjustCameraAngle(
  perspectiveCameraState: PerspectiveCameraState,
  controlsState: ControlsState | null = null
): void {
  if (controlsState === null) {
    // Modify the position & view of the passed camera state,
    // based on its existing position of the viewer (eye),
    // target point the viewer is looking at (centre) & up axis
    perspectiveCamera.update(perspectiveCameraState);
    return;
  }

  const output: ControlsUpdate.Output = controls.update({
    controls: controlsState,
    camera: perspectiveCameraState,
  });

  // Manually apply unlike perspectiveCamera.update()
  controlsState.thetaDelta = output.controls.thetaDelta;
  controlsState.phiDelta = output.controls.phiDelta;
  controlsState.scale = output.controls.scale;

  perspectiveCameraState.position = output.camera.position;
  perspectiveCameraState.view = output.camera.view;
}

function doDynamicResize(
  canvas: HTMLCanvasElement,
  perspectiveCameraState: PerspectiveCameraState
): void {
  const canvasBounds: DOMRect = canvas.getBoundingClientRect();
  const devicePixelRatio: number = window.devicePixelRatio;

  // Account for display scaling
  const width: number = canvasBounds.width * devicePixelRatio;
  const height: number = canvasBounds.height * devicePixelRatio;

  canvas.width = width;
  canvas.height = height;

  // Modify the projection, aspect ratio & viewport
  perspectiveCamera.setProjection(
    perspectiveCameraState,
    perspectiveCameraState,
    new CameraViewportDimensions(width, height)
  );
}

function doZoom(
  zoomTicks: number,
  perspectiveCameraState: PerspectiveCameraState,
  controlsState: ControlsState
): void {
  while (zoomTicks !== 0) {
    const currentTick: number = Math.sign(zoomTicks);
    zoomTicks -= currentTick;

    const scaleChange: number = currentTick * 0.1;
    const potentialNewScale: number = controlsState.scale + scaleChange;
    const potentialNewDistance: number =
      vec3.distance(
        perspectiveCameraState.position,
        perspectiveCameraState.target
      ) * potentialNewScale;

    if (
      potentialNewDistance > controlsState.limits.minDistance &&
      potentialNewDistance < controlsState.limits.maxDistance
    ) {
      controlsState.scale = potentialNewScale;
    } else break;
  }

  adjustCameraAngle(perspectiveCameraState, controlsState);
}

function doZoomToFit(
  geometryEntities: GeometryEntity[],
  perspectiveCameraState: PerspectiveCameraState,
  controlsState: ControlsState
): void {
  const options: ControlsZoomToFit.Options = {
    controls: controlsState,
    camera: perspectiveCameraState,
    entities: geometryEntities,
  };
  const output: ControlsZoomToFit.Output = controls.zoomToFit(options);

  perspectiveCameraState.target = output.camera.target;
  controlsState.scale = output.controls.scale;

  adjustCameraAngle(perspectiveCameraState, controlsState);
}

function doRotate(
  rotateX: number,
  rotateY: number,
  perspectiveCameraState: PerspectiveCameraState,
  controlsState: ControlsState
): void {
  const output = controls.rotate(
    {
      controls: controlsState,
      camera: perspectiveCameraState,
      speed: 0.0015,
    },
    [rotateX, rotateY]
  );

  const newControlsState = output.controls;
  controlsState.thetaDelta = newControlsState.thetaDelta;
  controlsState.phiDelta = newControlsState.phiDelta;

  adjustCameraAngle(perspectiveCameraState, controlsState);
}

function doPan(
  panX: number,
  panY: number,
  perspectiveCameraState: PerspectiveCameraState,
  controlsState: ControlsState
): void {
  const output = controls.pan(
    {
      controls: controlsState,
      camera: perspectiveCameraState,
    },
    [panX, panY * 0.75]
  );

  const newCameraState = output.camera;
  perspectiveCameraState.position = newCameraState.position;
  perspectiveCameraState.target = newCameraState.target;

  adjustCameraAngle(perspectiveCameraState, controlsState);
}

function registerEvents(
  canvas: HTMLCanvasElement,
  frameTracker: FrameTracker
): void {
  canvas.addEventListener(
    'wheel',
    (wheelEvent: WheelEvent) => {
      wheelEvent.preventDefault();
      frameTracker.changeZoomTicks(wheelEvent.deltaY);
    },
    { passive: false }
  );

  canvas.addEventListener('dblclick', (_mouseEvent: MouseEvent) => {
    frameTracker.setZoomToFit();
  });

  canvas.addEventListener('pointerdown', (pointerEvent: PointerEvent) => {
    frameTracker.setHeldPointer(pointerEvent.button);
    frameTracker.lastX = pointerEvent.pageX;
    frameTracker.lastY = pointerEvent.pageY;

    // Detect drags even outside the canvas element's borders
    canvas.setPointerCapture(pointerEvent.pointerId);
  });
  canvas.addEventListener('pointerup', (pointerEvent: PointerEvent) => {
    frameTracker.unsetHeldPointer();
    frameTracker.unsetLastCoordinates();

    canvas.releasePointerCapture(pointerEvent.pointerId);
  });

  canvas.addEventListener('pointermove', (pointerEvent: PointerEvent) => {
    if (!frameTracker.isPointerHeld()) return;

    const currentX = pointerEvent.pageX;
    const currentY = pointerEvent.pageY;
    const differenceX = frameTracker.lastX - currentX;
    const differenceY = frameTracker.lastY - currentY;

    if (!(frameTracker.isPointerPan() || pointerEvent.shiftKey)) {
      frameTracker.rotateX -= differenceX;
      frameTracker.rotateY += differenceY;
    } else {
      frameTracker.panX += differenceX;
      frameTracker.panY -= differenceY;
    }

    frameTracker.lastX = currentX;
    frameTracker.lastY = currentY;
  });
}

/* [Exports] */
export default function render(
  canvas: HTMLCanvasElement,
  shape: Shape
): () => number {
  const wrappedRenderer: WrappedRenderer.Function = makeWrappedRenderer(canvas);

  // Create our own state to modify based on the defaults
  const perspectiveCameraState: PerspectiveCameraState = {
    ...perspectiveCameraStateDefaults,
    position: [1000, 1000, 1500],
  };
  const controlsState: ControlsState = {
    ...controlsStateDefaults,
  };

  const geometryEntities: GeometryEntity[] = entitiesFromSolids(
    undefined,
    shape.getSolid()
  );

  // Data to pass to the wrapped renderer we made, below
  const wrappedRendererData: WrappedRenderer.AllData = {
    entities: addEntities(shape, geometryEntities),
    drawCommands: prepareDrawCommands,
    camera: perspectiveCameraState,
  };

  // Custom object to track processing
  const frameTracker: FrameTracker = new FrameTracker();

  let requestId: number = 0;

  // Create a callback function.
  // Request animation frame with it once; it will loop itself from there
  function animationCallback(_timestamp: DOMHighResTimeStamp) {
    doDynamicResize(canvas, perspectiveCameraState);

    const shouldZoom: boolean = frameTracker.shouldZoom();
    const shouldZoomToFit: boolean = frameTracker.shouldZoomToFit();
    const shouldRotate: boolean = frameTracker.shouldRotate();
    const shouldPan: boolean = frameTracker.shouldPan();

    if (shouldZoom) {
      doZoom(
        frameTracker.getZoomTicks(),
        perspectiveCameraState,
        controlsState
      );
      frameTracker.didZoom();
    }

    if (shouldZoomToFit) {
      doZoomToFit(geometryEntities, perspectiveCameraState, controlsState);
      frameTracker.didZoomToFit();
    }

    if (shouldRotate) {
      doRotate(
        frameTracker.rotateX,
        frameTracker.rotateY,
        perspectiveCameraState,
        controlsState
      );
      frameTracker.didRotate();
    }

    if (shouldPan) {
      doPan(
        frameTracker.panX,
        frameTracker.panY,
        perspectiveCameraState,
        controlsState
      );
      frameTracker.didPan();
    }

    // Trigger render once processing for the current frame is done
    if (shouldZoom || shouldZoomToFit || shouldRotate || shouldPan) {
      wrappedRenderer(wrappedRendererData);
    }

    requestId = window.requestAnimationFrame(animationCallback);
  }
  requestId = window.requestAnimationFrame(animationCallback);

  registerEvents(canvas, frameTracker);

  return () => requestId;
}
