/* [Imports] */
import {
  ControlsState,
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
  controlsState: ControlsState,
  perspectiveCameraState: PerspectiveCameraState,
  geometryEntities: GeometryEntity[]
) {
  const options: ZoomToFit.Options = {
    controls: controlsState,
    camera: perspectiveCameraState,
    entities: geometryEntities,
  };
  const output: ZoomToFit.Output = zoomToFit(options);
  console.log(output);

  // TODO
  // orbitControlsState = { ...orbitControlsState, ...updated.controls };
  // perspectiveCameraState = { ...perspectiveCameraState, ...updated.camera };
  // updateView = true;
}

function adjustCameraAngle(
  perspectiveCameraState: PerspectiveCameraState
): void {
  // Modify the position & view of the passed camera state,
  // based on its existing position of the viewer (eye),
  // target point the viewer is looking at (centre) & up axis
  perspectiveCamera.update(perspectiveCameraState);
}

/* [Exports] */
export default function render(canvas: HTMLCanvasElement, shape: Shape): void {
  const wrappedRenderer: WrappedRenderer.Function = makeWrappedRenderer(canvas);

  // Create our own state to modify based on the defaults
  const perspectiveCameraState: PerspectiveCameraState = {
    ...perspectiveCameraStateDefaults,
    // position: [1.414811372756958, 1.7292139530181885, 2.200817823410034],
  };
  // adjustCameraAngle(perspectiveCameraState);
  const controlsState: ControlsState = {
    ...controlsStateDefaults,
    //TODO Meaning behind zoom tightness 1.5
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

    if (frameTracker.zoomToFit) {
      frameTracker.zoomToFit = false;

      doZoomToFit(controlsState, perspectiveCameraState, geometryEntities);
    }

    // Trigger render once processing for the current frame is done
    wrappedRenderer(wrappedRendererData);

    window.requestAnimationFrame(animationCallback);
  }
  window.requestAnimationFrame(animationCallback);
}
