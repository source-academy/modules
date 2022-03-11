/* [Imports] */
import {
  ControlsState,
  ControlsUpdate,
  Entity,
  GeometryEntity,
  PerspectiveCameraState,
  PrepareRender,
  WrappedRenderer,
  ZoomToFit,
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
  zoomToFit,
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

function addEntities(shape, geometryEntities): Entity[] {
  const allEntities: Entity[] = [...geometryEntities];

  if (shape.addAxis) allEntities.push(new AxisEntity.Class());
  if (shape.addMultiGrid) allEntities.push(new MultiGridEntity.Class());

  return allEntities;
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

function doZoomToFit(
  geometryEntities: GeometryEntity[],
  perspectiveCameraState: PerspectiveCameraState,
  controlsState: ControlsState
) {
  const options: ZoomToFit.Options = {
    controls: controlsState,
    camera: perspectiveCameraState,
    entities: geometryEntities,
  };
  const output: ZoomToFit.Output = zoomToFit(options);
  console.log(output);

  perspectiveCameraState.target = output.camera.target;
  controlsState.scale = output.controls.scale;
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
  console.log(output);

  // Manually apply unlike perspectiveCamera.update()
  controlsState.thetaDelta = output.controls.thetaDelta;
  controlsState.phiDelta = output.controls.phiDelta;

  perspectiveCameraState.position = output.camera.position;
  perspectiveCameraState.view = output.camera.view;
}

function registerEvents(canvas: HTMLCanvasElement, frameTracker: FrameTracker) {
  canvas.addEventListener('dblclick', (_mouseEvent: MouseEvent) => {
    frameTracker.doZoomToFit = true;
  });
}

/* [Exports] */
export default function render(canvas: HTMLCanvasElement, shape: Shape): void {
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

  // Create a callback function.
  // Request animation frame with it once; it will loop itself from there
  function animationCallback(_timestamp: DOMHighResTimeStamp) {
    doDynamicResize(canvas, perspectiveCameraState);

    if (frameTracker.doZoomToFit) {
      frameTracker.doZoomToFit = false;

      console.log({...perspectiveCameraState})
      doZoomToFit(geometryEntities, perspectiveCameraState, controlsState);
      console.log({...perspectiveCameraState})
      adjustCameraAngle(perspectiveCameraState, controlsState);
    }

    // Trigger render once processing for the current frame is done
    wrappedRenderer(wrappedRendererData);

    window.requestAnimationFrame(animationCallback);
  }
  window.requestAnimationFrame(animationCallback);

  registerEvents(canvas, frameTracker);
}
