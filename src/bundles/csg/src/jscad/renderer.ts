/* [Imports] */
import measureBoundingBox from '@jscad/modeling/src/measurements/measureBoundingBox';
import {
  cameras,
  controls,
  drawCommands,
  entitiesFromSolids,
  prepareRender
} from '@jscad/regl-renderer';
import { ACE_GUTTER_BACKGROUND_COLOR, ACE_GUTTER_TEXT_COLOR, BP_TEXT_COLOR } from '@sourceacademy/modules-lib/tabs';
import {
  DEFAULT_COLOR,
  GRID_PADDING,
  MAIN_TICKS,
  ROTATION_SPEED,
  ROUND_UP_INTERVAL,
  SUB_TICKS,
  X_FACTOR,
  Y_FACTOR
} from '../constants';
import { hexToAlphaColor, type RenderGroup, type Shape } from '../utilities';
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
  ZoomToFitStates
} from './types';

/* [Main] */
const { orbit } = controls;

function solidsToGeometryEntities(solids: Solid[]): GeometryEntity[] {
  const options: EntitiesFromSolidsOptions = {
    color: hexToAlphaColor(DEFAULT_COLOR)
  };
  return (entitiesFromSolids(
    options,
    ...solids
  ) as unknown) as GeometryEntity[];
}

function neatGridDistance(rawDistance: number) {
  const paddedDistance: number = rawDistance + GRID_PADDING;
  const roundedDistance: number
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
    subColor: hexToAlphaColor(ACE_GUTTER_TEXT_COLOR)
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
    show: true
  };

  alwaysVisible: boolean = false;

  constructor(public size?: number) {}
}

function makeExtraEntities(
  renderGroup: RenderGroup,
  solids: Solid[]
): Entity[] {
  const { hasGrid, hasAxis } = renderGroup;
  // Run calculations for grid and/or axis only if needed
  if (!(hasAxis || hasGrid)) return [];

  const boundingBoxes: BoundingBox[] = solids.map((solid: Solid): BoundingBox => measureBoundingBox(solid));
  const minMaxXys: number[][] = boundingBoxes.map((boundingBox: BoundingBox): number[] => {
    const minX = boundingBox[0][0];
    const minY = boundingBox[0][1];
    const maxX = boundingBox[1][0];
    const maxY = boundingBox[1][1];
    return [minX, minY, maxX, maxY];
  });
  const xys: number[] = minMaxXys.flat(1);
  const distancesFromOrigin: number[] = xys.map(Math.abs);
  const furthestDistance: number = Math.max(...distancesFromOrigin);
  const neatDistance: number = neatGridDistance(furthestDistance);

  const extraEntities: Entity[] = [];
  if (hasGrid) extraEntities.push(new MultiGridEntity(neatDistance * 2));
  if (hasAxis) extraEntities.push(new AxisEntity(neatDistance));
  return extraEntities;
}

/* [Exports] */
export function makeWrappedRendererData(
  renderGroup: RenderGroup,
  cameraState: PerspectiveCameraState
): WrappedRendererData {
  const solids: Solid[] = renderGroup.shapes.map((shape: Shape): Solid => shape.solid);
  const geometryEntities: GeometryEntity[] = solidsToGeometryEntities(solids);
  const extraEntities: Entity[] = makeExtraEntities(renderGroup, solids);
  const allEntities: Entity[] = [...geometryEntities, ...extraEntities];

  return {
    entities: allEntities,
    geometryEntities,

    camera: cameraState,

    rendering: {
      background: hexToAlphaColor(ACE_GUTTER_BACKGROUND_COLOR)
    },

    drawCommands
  };
}

export function makeWrappedRenderer(canvas: HTMLCanvasElement): WrappedRenderer {
  return prepareRender({
    // Used to initialise Regl from the REGL package constructor
    glOptions: { canvas }
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
  height: number
) {
  // Modify the projection, aspect ratio & viewport. As compared to the general
  // controls.orbit.update() or even cameras.perspective.update()
  cameras.perspective.setProjection(cameraState, cameraState, {
    width,
    height
  });
}

export function updateStates(
  cameraState: PerspectiveCameraState,
  controlsState: ControlsState
) {
  const states: UpdatedStates = (orbit.update({
    camera: cameraState,
    controls: controlsState
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
  geometryEntities: GeometryEntity[]
) {
  const states: ZoomToFitStates = (orbit.zoomToFit({
    camera: cameraState,
    controls: controlsState,
    entities: geometryEntities as any
  }) as unknown) as ZoomToFitStates;

  cameraState.target = states.camera.target;

  controlsState.scale = states.controls.scale;
}

export function rotate(
  cameraState: PerspectiveCameraState,
  controlsState: ControlsState,
  rotateX: number,
  rotateY: number
) {
  const states: RotateStates = (orbit.rotate(
    {
      camera: cameraState,
      controls: controlsState,
      speed: ROTATION_SPEED
    },
    [rotateX, rotateY]
  ) as unknown) as RotateStates;

  controlsState.thetaDelta = states.controls.thetaDelta;
  controlsState.phiDelta = states.controls.phiDelta;
}

export function pan(
  cameraState: PerspectiveCameraState,
  controlsState: ControlsState,
  panX: number,
  panY: number
) {
  const states: PanStates = (orbit.pan(
    {
      camera: cameraState,
      controls: controlsState
    },
    [panX * X_FACTOR, panY * Y_FACTOR]
  ) as unknown) as PanStates;

  cameraState.position = states.camera.position;
  cameraState.target = states.camera.target;
}
