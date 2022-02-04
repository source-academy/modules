import { Geometry } from '@jscad/modeling/src/geometries/types';
import {
  cameras,
  entitiesFromSolids,
  prepareRender,
} from '@jscad/regl-renderer';
import { Shape } from './utilities';

export default function render(canvas: HTMLCanvasElement, shape: Shape) {
  //FIXME
  console.log("HTMLCanvasElement", canvas)
  console.log("Shape", shape)
  globalThis.canvas = canvas
  globalThis.shape = shape

  const prepareRenderOptions: any = {
    glOptions: {
      gl: canvas.getContext('webgl2') ?? undefined,
    },
  };
  console.log("prepareRenderOptions", prepareRenderOptions)
  const preparedRenderer: any = prepareRender(prepareRenderOptions);
  console.log("preparedRenderer", preparedRenderer)

  const cameraState: typeof cameras.perspective.cameraState = {
    ...cameras.perspective.defaults,
    position: [150, -180, 233],
  };
  console.log("cameraState", cameraState)
  const geometries: Geometry[] = entitiesFromSolids({}, ...shape.getObjects());
  console.log("geometries", geometries)
  const renderOptions: any = {
    ...prepareRenderOptions,
    camera: cameraState,
    drawCommands: {},
    entities: geometries,
  };
  console.log("renderOptions", renderOptions)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function animationCallback(timestamp: DOMHighResTimeStamp) {
    preparedRenderer(renderOptions);
  }
  window.requestAnimationFrame(animationCallback);
}
