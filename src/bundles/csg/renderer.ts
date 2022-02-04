import { Geometry } from '@jscad/modeling/src/geometries/types';
import {
  cameras,
  entitiesFromSolids,
  prepareRender,
  drawCommands,
  controls,
} from '@jscad/regl-renderer';
import { Shape } from './utilities';

export default function render(canvas: HTMLCanvasElement, shape: Shape) {
  // Prepare Renderer
  const prepareRenderOptions: any = {
    glOptions: {
      gl: canvas.getContext('webgl2') ?? undefined,
    },
  };
  const preparedRenderer: any = prepareRender(prepareRenderOptions);

  // Setting up Camera
  const perspectiveCamera = cameras.perspective;
  const camera = perspectiveCamera.defaults;
  const width = 512;
  const height = 512;
  perspectiveCamera.setProjection(camera, camera, {
    width,
    height,
  });
  perspectiveCamera.update(camera, camera);

  // Setting up Camera Controller
  const orbitControls = controls.orbit;
  let viewControls = orbitControls.defaults;

  // Getting CSG Objects
  const geometries: Geometry[] = entitiesFromSolids({}, ...shape.getObjects());

  // Setting up Renderer
  const grid = {
    visuals: {
      drawCmd: 'drawGrid',
      show: false,
      color: [0, 0, 0, 1],
      subColor: [0, 0, 1, 0.5],
      fadeOut: false,
      transparent: true,
    },
    size: [200, 200],
    ticks: [10, 1],
  };

  const axis = {
    visuals: {
      drawCmd: 'drawAxis',
      show: true,
    },
    size: 300,
  };

  const renderOptions: any = {
    camera,
    drawCommands: {
      drawAxis: drawCommands.drawAxis,
      drawGrid: drawCommands.drawGrid,
      drawLines: drawCommands.drawLines,
      drawMesh: drawCommands.drawMesh,
    },
    entities: [grid, axis, ...geometries],
  };

  // Running Renderer and Mouse Events to Control Camera
  let lastX = 0;
  let lastY = 0;

  const rotateSpeed = 0.002;
  const panSpeed = 1;
  const zoomSpeed = 0.08;
  let rotateDelta = [0, 0];
  let panDelta = [0, 0];
  let zoomDelta = 0;
  let pointerDown = false;
  let updateView = true;

  const doRotatePanZoom = () => {
    if (rotateDelta[0] || rotateDelta[1]) {
      const updated = orbitControls.rotate(
        { controls: viewControls, camera, speed: rotateSpeed },
        rotateDelta
      );
      viewControls = { ...viewControls, ...updated.controls };
      updateView = true;
      rotateDelta = [0, 0];
    }

    if (panDelta[0] || panDelta[1]) {
      const updated = orbitControls.pan(
        { controls: viewControls, camera, speed: panSpeed },
        panDelta
      );
      viewControls = { ...viewControls, ...updated.controls };
      panDelta = [0, 0];
      camera.position = updated.camera.position;
      camera.target = updated.camera.target;
      updateView = true;
    }

    if (zoomDelta) {
      const updated = orbitControls.zoom(
        { controls: viewControls, camera, speed: zoomSpeed },
        zoomDelta
      );
      viewControls = { ...viewControls, ...updated.controls };
      zoomDelta = 0;
      updateView = true;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateAndRender = (timestamp: DOMHighResTimeStamp) => {
    doRotatePanZoom();

    if (updateView) {
      const updates = orbitControls.update({
        controls: viewControls,
        camera,
      });
      viewControls = { ...viewControls, ...updates.controls };
      updateView = viewControls.changed; // for elasticity in rotate / zoom

      camera.position = updates.camera.position;
      perspectiveCamera.update(camera);

      preparedRenderer(renderOptions);
    }
    window.requestAnimationFrame(updateAndRender);
  };
  window.requestAnimationFrame(updateAndRender);

  /* eslint-disable no-param-reassign */
  const moveHandler = (ev) => {
    if (!pointerDown) return;
    const dx = lastX - ev.pageX;
    const dy = ev.pageY - lastY;

    const shiftKey =
      ev.shiftKey === true || (ev.touches && ev.touches.length > 2);
    if (shiftKey) {
      panDelta[0] += dx;
      panDelta[1] += dy;
    } else {
      rotateDelta[0] -= dx;
      rotateDelta[1] -= dy;
    }

    lastX = ev.pageX;
    lastY = ev.pageY;

    ev.preventDefault();
  };
  const downHandler = (ev) => {
    pointerDown = true;
    lastX = ev.pageX;
    lastY = ev.pageY;
    canvas.setPointerCapture(ev.pointerId);
    ev.preventDefault();
  };

  const upHandler = (ev) => {
    pointerDown = false;
    canvas.releasePointerCapture(ev.pointerId);
    ev.preventDefault();
  };

  const wheelHandler = (ev) => {
    zoomDelta += ev.deltaY;
    ev.preventDefault();
  };

  canvas.addEventListener('pointermove', moveHandler);
  canvas.addEventListener('pointerdown', downHandler);
  canvas.addEventListener('pointerup', upHandler);
  canvas.addEventListener('wheel', wheelHandler);
}
