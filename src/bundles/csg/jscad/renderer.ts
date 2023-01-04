/* [Imports] */
import measureBoundingBox from '@jscad/modeling/src/measurements/measureBoundingBox';
import {
  cameras,
  controls,
  drawCommands,
  entitiesFromSolids,
  prepareRender,
} from '@jscad/regl-renderer';
import {
  ACE_GUTTER_BACKGROUND_COLOR,
  ACE_GUTTER_TEXT_COLOR,
  BP_TEXT_COLOR,
  DEFAULT_COLOR,
  GRID_PADDING,
  MAIN_TICKS,
  ROTATION_SPEED,
  ROUND_UP_INTERVAL,
  SUB_TICKS,
  X_FACTOR,
  Y_FACTOR,
} from '../constants.js';
import { hexToAlphaColor, type RenderGroup, type Shape } from '../utilities.js';
import type {
  AlphaColor,
  AxisEntityType,
  BoundingBox,
  ControlsState,
  EntitiesFromSolidsOptions,
  Entity,
  GeometryEntity,
  MultiGridEntityType,
  PanStates,
  PerspectiveCameraState,
  RotateStates,
  Solid,
  UpdatedStates,
  WrappedRenderer,
  WrappedRendererData,
  ZoomToFitStates,
} from './types.js';

/* [Main] */
let { orbit } = controls;

function solidsToGeometryEntities(solids: Solid[]): GeometryEntity[] {
  let options: EntitiesFromSolidsOptions = {
    color: hexToAlphaColor(DEFAULT_COLOR),
  };
  return (entitiesFromSolids(
    options,
    ...solids,
  ) as unknown) as GeometryEntity[];
}

function neatGridDistance(rawDistance: number) {
  let paddedDistance: number = rawDistance + GRID_PADDING;
  let roundedDistance: number
    = Math.ceil(paddedDistance / ROUND_UP_INTERVAL) * ROUND_UP_INTERVAL;
  return roundedDistance;
}

class MultiGridEntity implements MultiGridEntityType {
  visuals: {
    drawCmd: 'drawGrid';
    show: boolean;

    color?: AlphaColor;
    subColor?: AlphaColor;
  } = {
      drawCmd: 'drawGrid',
      show: true,

      color: hexToAlphaColor(BP_TEXT_COLOR),
      subColor: hexToAlphaColor(ACE_GUTTER_TEXT_COLOR),
    };

  ticks: [number, number] = [MAIN_TICKS, SUB_TICKS];

  size: [number, number];

  constructor(size: number) {
    this.size = [size, size];
  }
}

class AxisEntity implements AxisEntityType {
  visuals: {
    drawCmd: 'drawAxis';
    show: boolean;
  } = {
      drawCmd: 'drawAxis',
      show: true,
    };

  alwaysVisible: boolean = false;

  constructor(public size?: number) {}
}

function makeExtraEntities(
  renderGroup: RenderGroup,
  solids: Solid[],
): Entity[] {
  let { hasGrid, hasAxis } = renderGroup;
  // Run calculations for grid and/or axis only if needed
  if (!(hasAxis || hasGrid)) return [];

  let boundingBoxes: BoundingBox[] = solids.map(
    (solid: Solid): BoundingBox => measureBoundingBox(solid),
  );
  let minMaxXys: number[][] = boundingBoxes.map(
    (boundingBox: BoundingBox): number[] => {
      let minX = boundingBox[0][0];
      let minY = boundingBox[0][1];
      let maxX = boundingBox[1][0];
      let maxY = boundingBox[1][1];
      return [minX, minY, maxX, maxY];
    },
  );
  let xys: number[] = minMaxXys.flat(1);
  let distancesFromOrigin: number[] = xys.map(Math.abs);
  let furthestDistance: number = Math.max(...distancesFromOrigin);
  let neatDistance: number = neatGridDistance(furthestDistance);

  let extraEntities: Entity[] = [];
  if (hasGrid) extraEntities.push(new MultiGridEntity(neatDistance * 2));
  if (hasAxis) extraEntities.push(new AxisEntity(neatDistance));
  return extraEntities;
}

/* [Exports] */
export function makeWrappedRendererData(
  renderGroup: RenderGroup,
  cameraState: PerspectiveCameraState,
): WrappedRendererData {
  let solids: Solid[] = renderGroup.shapes.map(
    (shape: Shape): Solid => shape.solid,
  );
  let geometryEntities: GeometryEntity[] = solidsToGeometryEntities(solids);
  let extraEntities: Entity[] = makeExtraEntities(renderGroup, solids);
  let allEntities: Entity[] = [...geometryEntities, ...extraEntities];

  return {
    entities: allEntities,
    geometryEntities,

    camera: cameraState,

    rendering: {
      background: hexToAlphaColor(ACE_GUTTER_BACKGROUND_COLOR),
    },

    drawCommands,
  };
}

export function makeWrappedRenderer(
  canvas: HTMLCanvasElement,
): WrappedRenderer {
  return prepareRender({
    // Used to initialise Regl from the REGL package constructor
    glOptions: { canvas },
  });
}

export function cloneCameraState(): PerspectiveCameraState {
  return { ...cameras.perspective.defaults };
}
export function cloneControlsState(): ControlsState {
  return { ...controls.orbit.defaults };
}

export function updateProjection(
  cameraState: PerspectiveCameraState,
  width: number,
  height: number,
) {
  // Modify the projection, aspect ratio & viewport. As compared to the general
  // controls.orbit.update() or even cameras.perspective.update()
  cameras.perspective.setProjection(cameraState, cameraState, {
    width,
    height,
  });
}

export function updateStates(
  cameraState: PerspectiveCameraState,
  controlsState: ControlsState,
) {
  let states: UpdatedStates = (orbit.update({
    camera: cameraState,
    controls: controlsState,
  }) as unknown) as UpdatedStates;

  cameraState.position = states.camera.position;
  cameraState.view = states.camera.view;

  controlsState.thetaDelta = states.controls.thetaDelta;
  controlsState.phiDelta = states.controls.phiDelta;
  controlsState.scale = states.controls.scale;
}

export function zoomToFit(
  cameraState: PerspectiveCameraState,
  controlsState: ControlsState,
  geometryEntities: GeometryEntity[],
) {
  let states: ZoomToFitStates = (orbit.zoomToFit({
    camera: cameraState,
    controls: controlsState,
    entities: geometryEntities as any,
  }) as unknown) as ZoomToFitStates;

  cameraState.target = states.camera.target;

  controlsState.scale = states.controls.scale;
}

export function rotate(
  cameraState: PerspectiveCameraState,
  controlsState: ControlsState,
  rotateX: number,
  rotateY: number,
) {
  let states: RotateStates = (orbit.rotate(
    {
      camera: cameraState,
      controls: controlsState,
      speed: ROTATION_SPEED,
    },
    [rotateX, rotateY],
  ) as unknown) as RotateStates;

  controlsState.thetaDelta = states.controls.thetaDelta;
  controlsState.phiDelta = states.controls.phiDelta;
}

export function pan(
  cameraState: PerspectiveCameraState,
  controlsState: ControlsState,
  panX: number,
  panY: number,
) {
  let states: PanStates = (orbit.pan(
    {
      camera: cameraState,
      controls: controlsState,
    },
    [panX * X_FACTOR, panY * Y_FACTOR],
  ) as unknown) as PanStates;

  cameraState.position = states.camera.position;
  cameraState.target = states.camera.target;
}
