/* [Imports] */
import {
  Entity,
  PerspectiveCamera,
  PerspectiveCameraState,
  PrepareRender,
  WrappedRenderer,
} from './types';
import {
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
    //TODO highly temporary till nicely using & merging orbit controls for zoom/update
    //TODO bring mouse controls back, cleaned/understood/typed
    position: [1.414811372756958, 1.7292139530181885, 2.200817823410034],
  };
  perspectiveCamera.setProjection(
    perspectiveCameraState,
    perspectiveCameraState,
    {
      width: 512,
      height: 512,
    }
  );
  perspectiveCamera.update(perspectiveCameraState, perspectiveCameraState);

  const entities: Entity[] = entitiesFromSolids(undefined, shape.getSolid());
  const wrappedRendererData: WrappedRenderer.AllData = {
    entities,
    drawCommands: prepareDrawCommands,
    camera: perspectiveCameraState,
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function animationCallback(timestamp: DOMHighResTimeStamp) {
    wrappedRenderer(wrappedRendererData);
  }
  window.requestAnimationFrame(animationCallback);
}
