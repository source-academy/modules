import { measureBoundingBox } from '@jscad/modeling/src/measurements';
import {
  entitiesFromSolids,
  perspectiveCamera as _perspectiveCamera,
  perspectiveCameraStateDefaults,
  orbitControls as _orbitControls,
  orbitControlsStateDefaults,
  prepareDrawCommands,
  prepareRender,
  Shape,
} from './utilities';
import {
  AxisEntity,
  BoundingBox,
  MultiGridEntity,
  Numbers2,
  OrbitControls,
  OrbitControlsState,
  OrbitPan,
  OrbitRotate,
  OrbitUpdate,
  OrbitZoom,
  OrbitZoomToFit,
  PerspectiveCamera,
  PerspectiveCameraState,
  PrepareRender,
  WrappedRenderer,
} from './types';

export default function render(canvas: HTMLCanvasElement, shape: Shape) {
  // Prepare Renderer
  const prepareRenderOptions: PrepareRender.AllOptions = {
    glOptions: {
      gl: canvas.getContext('webgl2') ?? undefined,
    },
  };
  const preparedRenderer: WrappedRenderer.Function = prepareRender(
    prepareRenderOptions
  );

  // Setting up Camera
  const perspectiveCamera: PerspectiveCamera = _perspectiveCamera;
  let perspectiveCameraState: PerspectiveCameraState = perspectiveCameraStateDefaults;

  perspectiveCamera.setProjection(
    perspectiveCameraState,
    perspectiveCameraState,
    {
      width: 512,
      height: 512,
    }
  );
  perspectiveCamera.update(perspectiveCameraState, perspectiveCameraState);

  // Setting up Camera Controller
  const orbitControls: OrbitControls = _orbitControls;
  let orbitControlsState: OrbitControlsState = orbitControlsStateDefaults;

  // Getting CSG Objects
  // @ts-ignore
  const geometries: GeometryEntity[] = entitiesFromSolids({}, shape.getSolid());

  const shapeBoundingBox: BoundingBox = measureBoundingBox(shape.getSolid());

  const maxSize: number = Math.ceil(
    Math.max(
      shapeBoundingBox[1][0],
      shapeBoundingBox[1][1],
      shapeBoundingBox[1][2]
    )
  );

  // Setting up Renderer
  const grid: MultiGridEntity = {
    visuals: {
      drawCmd: 'drawGrid',
      show: shape.grid,
      color: [0, 0, 0, 1],
      subColor: [0, 0, 1, 0.5],
      fadeOut: false,
      transparent: true,
    },
    size: [maxSize * 2, maxSize * 2],
    ticks: [1, 1],
  };

  const axis: AxisEntity = {
    visuals: {
      drawCmd: 'drawAxis',
      show: shape.axis,
    },
    size: maxSize * 1.2,
    alwaysVisible: false,
  };

  let renderOptions: WrappedRenderer.AllData = {
    camera: perspectiveCameraState,
    drawCommands: prepareDrawCommands,
    entities: [grid, axis, ...geometries],
  };

  // Running Renderer and Mouse Events to Control Camera
  let lastX: number = 0;
  let lastY: number = 0;

  const rotateSpeed: number = 0.002;
  const panSpeed: number = 1;
  const zoomSpeed: number = 0.08;
  let rotateDelta: Numbers2 = [0, 0];
  let panDelta: Numbers2 = [0, 0];
  let zoomDelta: number = 0;
  let pointerDown: boolean = false;
  let zoomToFit: boolean = true;
  let updateView: boolean = true;

  function doRotatePanZoom() {
    if (rotateDelta[0] || rotateDelta[1]) {
      const updated: OrbitRotate = orbitControls.rotate(
        {
          controls: orbitControlsState,
          camera: perspectiveCameraState,
          speed: rotateSpeed,
        },
        rotateDelta
      );
      orbitControlsState = { ...orbitControlsState, ...updated.controls };
      updateView = true;
      rotateDelta = [0, 0];
    }

    if (panDelta[0] || panDelta[1]) {
      const updated: OrbitPan = orbitControls.pan(
        {
          controls: orbitControlsState,
          camera: perspectiveCameraState,
          speed: panSpeed,
        },
        panDelta
      );
      orbitControlsState = { ...orbitControlsState, ...updated.controls };
      panDelta = [0, 0];
      perspectiveCameraState = { ...perspectiveCameraState, ...updated.camera };
      updateView = true;
    }

    if (zoomDelta) {
      const updated: OrbitZoom = orbitControls.zoom(
        {
          controls: orbitControlsState,
          camera: perspectiveCameraState,
          speed: zoomSpeed,
        },
        zoomDelta
      );
      orbitControlsState = { ...orbitControlsState, ...updated.controls };
      zoomDelta = 0;
      updateView = true;
    }

    if (zoomToFit) {
      orbitControlsState.zoomToFit.tightness = 1.5;
      const updated: OrbitZoomToFit = orbitControls.zoomToFit({
        controls: orbitControlsState,
        camera: perspectiveCameraState,
        entities: geometries,
      });
      orbitControlsState = { ...orbitControlsState, ...updated.controls };
      perspectiveCameraState = { ...perspectiveCameraState, ...updated.camera };
      zoomToFit = false;
      updateView = true;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function updateAndRender(timestamp: DOMHighResTimeStamp) {
    doRotatePanZoom();

    if (updateView) {
      const updates: OrbitUpdate = orbitControls.update({
        controls: orbitControlsState,
        camera: perspectiveCameraState,
      });
      orbitControlsState = { ...orbitControlsState, ...updates.controls };
      updateView = orbitControlsState.changed;
      perspectiveCameraState = { ...perspectiveCameraState, ...updates.camera };
      perspectiveCamera.update(perspectiveCameraState);
      renderOptions = {
        ...renderOptions,
        ...{ camera: perspectiveCameraState },
      };
      preparedRenderer(renderOptions);
    }
    window.requestAnimationFrame(updateAndRender);
  }
  window.requestAnimationFrame(updateAndRender);

  /* eslint-disable no-param-reassign */
  function moveHandler(ev: PointerEvent) {
    if (!pointerDown) return;
    const dx: number = lastX - ev.pageX;
    const dy: number = ev.pageY - lastY;

    const shiftKey: boolean = ev.shiftKey === true;
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
  }
  function downHandler(ev: PointerEvent) {
    pointerDown = true;
    lastX = ev.pageX;
    lastY = ev.pageY;
    canvas.setPointerCapture(ev.pointerId);
    ev.preventDefault();
  }

  function upHandler(ev: PointerEvent) {
    pointerDown = false;
    canvas.releasePointerCapture(ev.pointerId);
    ev.preventDefault();
  }

  function wheelHandler(ev: WheelEvent) {
    zoomDelta += ev.deltaY;
  }

  function doubleClickHandler(ev: MouseEvent) {
    zoomToFit = true;
    ev.preventDefault();
  }

  canvas.addEventListener('pointermove', moveHandler);
  canvas.addEventListener('pointerdown', downHandler);
  canvas.addEventListener('pointerup', upHandler);
  canvas.addEventListener('wheel', wheelHandler, { passive: true });
  canvas.addEventListener('dblclick', doubleClickHandler);
}
