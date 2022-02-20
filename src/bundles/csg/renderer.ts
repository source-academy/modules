/* [Imports] */
import {
  Entity,
  PerspectiveCameraState,
  PrepareRender,
  WrappedRenderer,
} from './types';
import {
  CameraViewportDimensions,
  entitiesFromSolids,
  perspectiveCamera,
  perspectiveCameraStateDefaults,
  prepareDrawCommands,
  prepareRender,
  Shape,
} from './utilities';

/* [Exports] */
export default function render(canvas: HTMLCanvasElement, shape: Shape) {
  const prepareRenderOptions: PrepareRender.AllOptions = {
    glOptions: {
      gl: canvas.getContext('webgl2') ?? undefined,
    },
  };
  const wrappedRenderer: WrappedRenderer.Function = prepareRender(
    prepareRenderOptions
  );

  const perspectiveCameraState: PerspectiveCameraState = {
    ...perspectiveCameraStateDefaults,
    // TODO highly temporary till nicely using & merging orbit controls for zoom/update
    // TODO bring mouse controls back, cleaned/understood/typed
    position: [1.414811372756958, 1.7292139530181885, 2.200817823410034],
  };

  // Modify the position & view of the passed camera state,
  // based on its existing position of the viewer (eye),
  // target point the viewer is looking at (centre) & up axis
  perspectiveCamera.update(perspectiveCameraState);

  const entities: Entity[] = entitiesFromSolids(undefined, shape.getSolid());
  const wrappedRendererData: WrappedRenderer.AllData = {
    entities,
    drawCommands: prepareDrawCommands,
    camera: perspectiveCameraState,
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function animationCallback(timestamp: DOMHighResTimeStamp) {
    // [Support dynamic resizing]
    const canvasBounds: DOMRect = canvas.getBoundingClientRect();
    const devicePixelRatio: number = window.devicePixelRatio;

    // Account for display scaling
    const width: number = canvasBounds.width * devicePixelRatio;
    const height: number = canvasBounds.height * devicePixelRatio;

    // eslint-disable-next-line no-param-reassign
    canvas.width = width;
    // eslint-disable-next-line no-param-reassign
    canvas.height = height;

    // Modify the projection, aspect ratio & viewport
    perspectiveCamera.setProjection(
      perspectiveCameraState,
      perspectiveCameraState,
      new CameraViewportDimensions(width, height)
    );

    wrappedRenderer(wrappedRendererData);

    window.requestAnimationFrame(animationCallback);
  }
  window.requestAnimationFrame(animationCallback);
}
