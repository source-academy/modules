/* [Imports] */
import vec3 from '@jscad/modeling/src/maths/vec3';
import {
  BoundingBox,
  measureBoundingBox,
} from '@jscad/modeling/src/measurements';
import { ACE_GUTTER_BACKGROUND_COLOR } from './constants.js';
import {
  ControlsState,
  ControlsUpdate,
  ControlsZoomToFit,
  Entity,
  GeometryEntity,
  PerspectiveCameraState,
  PrepareRender,
  Solid,
  WrappedRenderer,
} from './types';
import {
  AxisEntity,
  CameraViewportDimensions,
  controls,
  controlsStateDefaults,
  CsgModuleState,
  entitiesFromSolids,
  FrameTracker,
  hexToRgba,
  MultiGridEntity,
  neatGridDistance,
  perspectiveCamera,
  perspectiveCameraStateDefaults,
  prepareDrawCommands,
  prepareRender,
  RenderGroup,
  Shape,
} from './utilities';

/* [Main] */
function makeWrappedRenderer(
  canvas: HTMLCanvasElement
): WrappedRenderer.Function {
  let prepareRenderOptions: PrepareRender.AllOptions = {
    glOptions: { canvas },
  };
  return prepareRender(prepareRenderOptions);
}

function addEntities(
  renderGroup: RenderGroup,
  solids: Solid[],
  geometryEntities: GeometryEntity[]
): Entity[] {
  let { hasGrid, hasAxis } = renderGroup;
  let allEntities: Entity[] = [...geometryEntities];

  // Run calculations for grid and/or axis only if needed
  if (!(hasAxis || hasGrid)) return allEntities;

  let boundingBoxes: BoundingBox[] = solids.map(
    (solid: Solid): BoundingBox => measureBoundingBox(solid)
  );
  let minMaxXys: number[][] = boundingBoxes.map(
    (boundingBox: BoundingBox): number[] => {
      let minX = boundingBox[0][0];
      let minY = boundingBox[0][1];
      let maxX = boundingBox[1][0];
      let maxY = boundingBox[1][1];
      return [minX, minY, maxX, maxY];
    }
  );
  let xys: number[] = minMaxXys.flat(1);
  let distancesFromOrigin: number[] = xys.map(Math.abs);
  let furthestDistance: number = Math.max(...distancesFromOrigin);
  let neatDistance: number = neatGridDistance(furthestDistance);

  if (hasGrid) allEntities.push(new MultiGridEntity(neatDistance * 2));
  if (hasAxis) allEntities.push(new AxisEntity(neatDistance));
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

  let output: ControlsUpdate.Output = controls.update({
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
  let canvasBounds: DOMRect = canvas.getBoundingClientRect();
  let { devicePixelRatio } = window;

  // Account for display scaling
  let width: number = canvasBounds.width * devicePixelRatio;
  let height: number = canvasBounds.height * devicePixelRatio;

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
    let currentTick: number = Math.sign(zoomTicks);
    zoomTicks -= currentTick;

    let scaleChange: number = currentTick * 0.1;
    let potentialNewScale: number = controlsState.scale + scaleChange;
    let potentialNewDistance: number =
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
  let options: ControlsZoomToFit.Options = {
    controls: controlsState,
    camera: perspectiveCameraState,
    entities: geometryEntities,
  };
  let output: ControlsZoomToFit.Output = controls.zoomToFit(options);

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
  let output = controls.rotate(
    {
      controls: controlsState,
      camera: perspectiveCameraState,
      speed: 0.0015,
    },
    [rotateX, rotateY]
  );

  let newControlsState = output.controls;
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
  let output = controls.pan(
    {
      controls: controlsState,
      camera: perspectiveCameraState,
    },
    [panX, panY * 0.75]
  );

  let newCameraState = output.camera;
  perspectiveCameraState.position = newCameraState.position;
  perspectiveCameraState.target = newCameraState.target;

  adjustCameraAngle(perspectiveCameraState, controlsState);
}

function addControlListeners(
  canvas: HTMLCanvasElement,
  frameTracker: FrameTracker
): void {
  canvas.addEventListener(
    'wheel',
    (wheelEvent: WheelEvent): void => {
      frameTracker.changeZoomTicks(wheelEvent.deltaY);

      // Prevent scrolling the side panel when there is overflow
      wheelEvent.preventDefault();
    },
    { passive: false }
  );

  canvas.addEventListener('dblclick', (_mouseEvent: MouseEvent): void => {
    frameTracker.setZoomToFit();
  });

  canvas.addEventListener(
    'pointerdown',
    (pointerEvent: PointerEvent): void => {
      frameTracker.setHeldPointer(pointerEvent.button);
      frameTracker.lastX = pointerEvent.pageX;
      frameTracker.lastY = pointerEvent.pageY;

      // Detect drags even outside the canvas element's borders
      canvas.setPointerCapture(pointerEvent.pointerId);

      // Prevent middle-click from activating auto-scrolling
      pointerEvent.preventDefault();
    },
    { passive: false }
  );
  canvas.addEventListener('pointerup', (pointerEvent: PointerEvent): void => {
    frameTracker.unsetHeldPointer();
    frameTracker.unsetLastCoordinates();

    canvas.releasePointerCapture(pointerEvent.pointerId);
  });

  canvas.addEventListener('pointermove', (pointerEvent: PointerEvent): void => {
    let currentX = pointerEvent.pageX;
    let currentY = pointerEvent.pageY;
    if (frameTracker.lastX < 0 || frameTracker.lastY < 0) {
      // If never tracked before, let differences result in 0
      frameTracker.lastX = currentX;
      frameTracker.lastY = currentY;
    }

    if (!frameTracker.shouldIgnorePointerMove()) {
      let differenceX = frameTracker.lastX - currentX;
      let differenceY = frameTracker.lastY - currentY;

      if (frameTracker.isPointerPan(pointerEvent.shiftKey)) {
        frameTracker.panX += differenceX;
        frameTracker.panY -= differenceY;
      } else {
        // Else default to rotate
        frameTracker.rotateX -= differenceX;
        frameTracker.rotateY += differenceY;
      }
    }

    frameTracker.lastX = currentX;
    frameTracker.lastY = currentY;
  });
}

/* [Exports] */
//FIXME multiple simultaneous loops running, unsure if module/regl/frontend
export default function render(
  canvas: HTMLCanvasElement,
  moduleState: CsgModuleState
): () => number {
  let wrappedRenderer: WrappedRenderer.Function = makeWrappedRenderer(canvas);

  // Create our own state to modify based on the defaults
  let perspectiveCameraState: PerspectiveCameraState = {
    ...perspectiveCameraStateDefaults,
    position: [1000, 1000, 1500],
  };
  let controlsState: ControlsState = {
    ...controlsStateDefaults,
  };

  let renderGroups: RenderGroup[] = moduleState.renderGroupManager.getGroupsToRender();
  let lastRenderGroup: RenderGroup = renderGroups.at(-1) as RenderGroup;
  let solids: Solid[] = lastRenderGroup.shapes.map(
    (shape: Shape): Solid => shape.solid
  );
  let geometryEntities: GeometryEntity[] = entitiesFromSolids(
    undefined,
    ...solids
  );

  // Data to pass to the wrapped renderer we made, below
  let wrappedRendererData: WrappedRenderer.AllData = {
    rendering: {
      background: hexToRgba(ACE_GUTTER_BACKGROUND_COLOR),
    },

    entities: addEntities(lastRenderGroup, solids, geometryEntities),
    drawCommands: prepareDrawCommands,
    camera: perspectiveCameraState,
  };

  // Custom object to track processing
  let frameTracker: FrameTracker = new FrameTracker();

  let requestId: number = 0;
  //TODO render loop count tracker
  let x = Math.floor(Math.random() * 1000)

  // Create a callback function.
  // Request animation frame with it once; it will loop itself from there
  function animationCallback(_timestamp: DOMHighResTimeStamp) {
    console.debug('>>> Frame for ' + x);

    doDynamicResize(canvas, perspectiveCameraState);

    if (frameTracker.shouldZoom()) {
      doZoom(
        frameTracker.getZoomTicks(),
        perspectiveCameraState,
        controlsState
      );
      frameTracker.didZoom();
    }

    if (frameTracker.shouldZoomToFit()) {
      doZoomToFit(geometryEntities, perspectiveCameraState, controlsState);
      frameTracker.didZoomToFit();
    }

    if (frameTracker.shouldRotate()) {
      doRotate(
        frameTracker.rotateX,
        frameTracker.rotateY,
        perspectiveCameraState,
        controlsState
      );
      frameTracker.didRotate();
    }

    if (frameTracker.shouldPan()) {
      doPan(
        frameTracker.panX,
        frameTracker.panY,
        perspectiveCameraState,
        controlsState
      );
      frameTracker.didPan();
    }

    wrappedRenderer(wrappedRendererData);

    requestId = window.requestAnimationFrame(animationCallback);
  }
  requestId = window.requestAnimationFrame(animationCallback);

  canvas.addEventListener('webglcontextlost', (contextEvent: Event): void => {
    contextEvent = contextEvent as WebGLContextEvent;

    console.debug('>>> CONTEXT LOST');

    window.cancelAnimationFrame(requestId);

    // Allow restoration of context
    contextEvent.preventDefault();
  });
  canvas.addEventListener(
    'webglcontextrestored',
    (_contextEvent: Event): void => {
      _contextEvent = _contextEvent as WebGLContextEvent;

      console.debug('>>> CONTEXT RESTORED');

      //FIXME insufficient, need to recreate regl
      requestId = window.requestAnimationFrame(animationCallback);
    }
  );

  addControlListeners(canvas, frameTracker);

  return (): number => requestId;
}
