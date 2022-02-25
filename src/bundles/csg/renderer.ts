/* [Imports] */
import {
  Entity,
  PerspectiveCameraState,
  PrepareRender,
  WrappedRenderer,
} from './types';
import {
  AxisEntity,
  CameraViewportDimensions,
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

function adjustCameraAngle(
  perspectiveCameraState: PerspectiveCameraState
): void {
  // Modify the position & view of the passed camera state,
  // based on its existing position of the viewer (eye),
  // target point the viewer is looking at (centre) & up axis
  perspectiveCamera.update(perspectiveCameraState);
}

function makeEntities(shape): Entity[] {
  const entities: Entity[] = entitiesFromSolids(undefined, shape.getSolid());

  if (shape.addAxis) entities.push(new AxisEntity.Class());
  if (shape.addMultiGrid) entities.push(new MultiGridEntity.Class());

  return entities;
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

/* [Exports] */
export default function render(canvas: HTMLCanvasElement, shape: Shape): void {
  const wrappedRenderer: WrappedRenderer.Function = makeWrappedRenderer(canvas);

  // Create our own state to modify based on the defaults
  const perspectiveCameraState: PerspectiveCameraState = {
    ...perspectiveCameraStateDefaults,
    position: [1.414811372756958, 1.7292139530181885, 2.200817823410034],
  };
  adjustCameraAngle(perspectiveCameraState);

  // Data to pass to the wrapped renderer we made, below
  const wrappedRendererData: WrappedRenderer.AllData = {
    entities: makeEntities(shape),
    drawCommands: prepareDrawCommands,
    camera: perspectiveCameraState,
  };

  // Create a callback function.
  // Request animation frame with it once; it will loop itself from there
  function animationCallback(_timestamp: DOMHighResTimeStamp) {
    doDynamicResize(canvas, perspectiveCameraState);

    // Trigger render once processing for the current frame is done
    wrappedRenderer(wrappedRendererData);

    window.requestAnimationFrame(animationCallback);
  }
  window.requestAnimationFrame(animationCallback);
}
