import {
  prepareRender,
  drawCommands,
  cameras,
  controls,
  entitiesFromSolids,
} from '@jscad/regl-renderer';
import { CSG } from './types';

// Functions that rotate, zoom and render CSG
export default function drawCSG(canvas: HTMLCanvasElement, csg: CSG) {
  const perspectiveCamera = cameras.perspective;
  const orbitControls = controls.orbit;

  const state = {
    camera: perspectiveCamera.defaults,
    controls: orbitControls.defaults,
  };

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  // prepare the camera
  perspectiveCamera.setProjection(state.camera, state.camera, {
    width,
    height,
  });
  perspectiveCamera.update(state.camera, state.camera);

  // prepare the renderer
  const setupOptions = {
    glOptions: { container: canvas },
  };
  const renderer = prepareRender(setupOptions);

  const gridOptions = {
    visuals: {
      drawCmd: 'drawGrid',
      show: false,
    },
    size: [500, 500],
    ticks: [25, 5],
    // color: [0, 0, 1, 1],
    // subColor: [0, 0, 1, 0.5]
  };

  const axisOptions = {
    visuals: {
      drawCmd: 'drawAxis',
      show: false,
    },
    size: 300,
    // alwaysVisible: false,
    // xColor: [0, 0, 1, 1],
    // yColor: [1, 0, 1, 1],
    // zColor: [0, 0, 0, 1]
  };

  const entities = entitiesFromSolids({}, ...csg.csgObjects);

  // assemble the options for rendering
  const renderOptions = {
    camera: state.camera,
    drawCommands: {
      drawAxis: drawCommands.drawAxis,
      drawGrid: drawCommands.drawGrid,
      drawLines: drawCommands.drawLines,
      drawMesh: drawCommands.drawMesh,
    },
    // define the visual content
    entities: [gridOptions, axisOptions, ...entities],
  };

  // Canvas mouse events handler

  let updateView = true;

  const rotateSpeed = 0.002;
  const panSpeed = 1;
  const zoomSpeed = 0.08;

  let lastX = 0;
  let lastY = 0;

  let rotateDelta = [0, 0];
  let panDelta = [0, 0];
  let zoomDelta = 0;
  let pointerDown = false;

  const doRotatePanZoom = () => {
    if (rotateDelta[0] || rotateDelta[1]) {
      const updated = orbitControls.rotate(
        { controls: state.controls, camera: state.camera, speed: rotateSpeed },
        rotateDelta
      );
      state.controls = { ...state.controls, ...updated.controls };
      updateView = true;
      rotateDelta = [0, 0];
    }

    if (panDelta[0] || panDelta[1]) {
      const updated = orbitControls.pan(
        { controls: state.controls, camera: state.camera, speed: panSpeed },
        panDelta
      );
      state.controls = { ...state.controls, ...updated.controls };
      panDelta = [0, 0];
      state.camera.position = updated.camera.position;
      state.camera.target = updated.camera.target;
      updateView = true;
    }

    if (zoomDelta) {
      const updated = orbitControls.zoom(
        { controls: state.controls, camera: state.camera, speed: zoomSpeed },
        zoomDelta
      );
      state.controls = { ...state.controls, ...updated.controls };
      zoomDelta = 0;
      updateView = true;
    }
  };

  const updateAndRender = () => {
    doRotatePanZoom();

    if (updateView) {
      const updates = orbitControls.update({
        controls: state.controls,
        camera: state.camera,
      });
      state.controls = { ...state.controls, ...updates.controls };
      updateView = state.controls.changed;

      state.camera.position = updates.camera.position;
      perspectiveCamera.update(state.camera);

      renderer(renderOptions);
    }
    requestAnimationFrame(updateAndRender);
  };
  requestAnimationFrame(updateAndRender);

  /* eslint-disable no-param-reassign */
  /**
   * Move camera perspective of the canvas
   */
  canvas.onpointermove = (ev: PointerEvent) => {
    if (!pointerDown) return;
    const dx = lastX - ev.pageX;
    const dy = ev.pageY - lastY;

    const shiftKey = ev.shiftKey === true;
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

  /**
   * Move the rotational perspective of the CSG
   */
  canvas.onpointerdown = (ev: PointerEvent) => {
    pointerDown = true;
    lastX = ev.pageX;
    lastY = ev.pageY;
    canvas.setPointerCapture(ev.pointerId);
    ev.preventDefault();
  };

  /**
   * Cancels the movement of the rotation of the CSG
   */
  canvas.onpointerup = (ev: PointerEvent) => {
    pointerDown = false;
    canvas.releasePointerCapture(ev.pointerId);
    ev.preventDefault();
  };

  /**
   * Zooming in and out of the CSG
   */
  canvas.onwheel = (ev: WheelEvent) => {
    zoomDelta += ev.deltaY;
    ev.preventDefault();
  };
  /* eslint-disable no-param-reassign */
}
