import { Geometry as Solid } from '@jscad/modeling/src/geometries/types';
import { cameras, controls, drawCommands } from '@jscad/regl-renderer';
import makeDrawMultiGrid from '@jscad/regl-renderer/types/rendering/commands/drawGrid/multi';
import * as renderDefaults from '@jscad/regl-renderer/types/rendering/renderDefaults';
import * as orbitTypes from '@jscad/regl-renderer/types/controls/orbitControls';
import { InitializationOptions } from 'regl';

const orthographicCamera = cameras.orthographic;
const perspectiveCamera = cameras.perspective;
const orthographicCameraState = orthographicCamera.cameraState;
const perspectiveCameraState = perspectiveCamera.cameraState;

/* [Exports] */
// [Proper typing for JS in regl-renderer]
export namespace PrepareRender {
  // @jscad\regl-renderer\src\rendering\render.js
  export type Function = (options: AllOptions) => WrappedRenderer.Function;

  // @jscad\regl-renderer\src\rendering\render.js
  export type AllOptions = {
    // Used to initialise Regl from the REGL package constructor
    glOptions: InitializationOptions;
  };
}

export type OrthographicCamera = typeof orthographicCamera;
export type PerspectiveCamera = typeof perspectiveCamera;

// When called, the WrappedRenderer creates a main DrawCommand.
// This main DrawCommand then gets called as a scoped command,
// used to create & call more DrawCommands for the #entities.
// Nested DrawCommands get cached
// & may store some Entity properties during setup,
// but properties passed in from Props later may take precedence.
// The main DrawCommand is said to be in charge of injecting most uniforms into
// the Regl context, ie keeping track of all Regl global state
export namespace WrappedRenderer {
  // @jscad\regl-renderer\src\rendering\render.js
  export type Function = (data: AllData) => void;

  // @jscad\regl-renderer\src\rendering\render.js
  // Gets used in the WrappedRenderer.
  // Also gets passed as Props into the main DrawCommand,
  // where it is used in setup specified by the internal
  // renderContext.js/renderWrapper.
  // The lambda of the main DrawCommand does not use those Props, rather,
  // it references the data in the WrappedRenderer directly.
  // Therefore, regl.prop() is not called,
  // nor are Props used via the semantic equivalent (context, props) => {}.
  // The context passed to that lambda also remains unused
  export type AllData = {
    rendering?: RenderOptions;

    entities: Entity[];

    drawCommands: PrepareDrawCommands;

    // Along with all of the relevant Entity's & Entity#visuals's properties,
    // this gets stuffed into each nested DrawCommand as Props.
    // Messy & needs tidying in regl-renderer
    camera: CameraState;
  };
  // There are 4 rendering commands to use in regl-renderer:
  // drawAxis, drawGrid, drawLines & drawMesh.
  // drawExps appears abandoned.
  // Only once passed Regl & an Entity do they return an actual DrawCommand
  export type PrepareDrawCommands = Record<string, PrepareDrawCommandFunction>;
  export type PrepareDrawCommandFunction =
    | typeof drawCommands
    | typeof makeDrawMultiGrid;

  // @jscad\regl-renderer\src\rendering\renderDefaults.js
  export type RenderOptions = typeof renderDefaults & {
    // Custom value used early on in render.js.
    // Clears the canvas to this background colour
    background?: Rgba;

    // Default value used directly in V2's entitiesFromSolids.js as the default Geometry colour.
    // Default value also used directly in various rendering commands as their shader uniforms' default colour.
    // Custom value appears unused
    meshColor?: Rgba;

    // Custom value used in various rendering commands as shader uniforms
    lightColor?: Rgba;
    lightDirection?: VectorXYZ;
    ambientLightAmount?: number;
    diffuseLightAmount?: number;
    specularLightAmount?: number;
    materialShininess?: number; // as uMaterialShininess in main DrawCommand

    // Unused
    lightPosition?: CoordinatesXYZ; // see also lightDirection
  };
}
export type CameraState = OrthographicCameraState | PerspectiveCameraState;
export type OrthographicCameraState = typeof orthographicCameraState;
export type PerspectiveCameraState = typeof perspectiveCameraState;
export type Rgba = [number, number, number, number];
export type VectorXYZ = Numbers3;
export type CoordinatesXYZ = Numbers3;
export type Numbers3 = [number, number, number];
export type Numbers2 = [number, number];

// @jscad\regl-renderer\src\geometry-utils-V2\entitiesFromSolids.js
// @jscad\regl-renderer\demo-web.js
// There are still other Props used for uniforms in the various rendering
// commands, eg model, color, angle
export type Entity = {
  visuals: {
    // Key for the draw command that should be used on this Entity.
    // Key is used on WrappedRenderer.AllData#drawCommands.
    // Property must exist & match a drawCommand,
    // or behaviour is like show: false
    drawCmd: 'drawAxis' | 'drawGrid' | 'drawLines' | 'drawMesh';

    // Whether to actually draw the Entity via nested DrawCommand
    show: boolean;

    // Whether the Geometry is transparent.
    // Transparents need to be rendered before non-transparents
    transparent?: boolean;
  };
};

// @jscad\regl-renderer\src\geometry-utils-V2\entitiesFromSolids.js
export type GeometryEntity = Entity & {
  // For drawCmd, "2d" Geometry#type uses "drawLines", else "drawMesh"
  visuals: {
    // Eventually determines whether to use vColorShaders
    // (Geometry must also have colour) or meshShaders
    useVertexColors: boolean;
  };

  // The original Geometry used to make the GeometryEntity
  geometry: Geometry;
};

// @jscad\regl-renderer\src\rendering\commands\drawAxis\index.js
// @jscad\regl-renderer\demo-web.js
export type AxisEntity = Entity & {
  xColor?: Rgba;
  yColor?: Rgba;
  zColor?: Rgba;
  size?: number;
  alwaysVisible?: boolean;

  // Deprecated
  lineWidth?: number;
};

// @jscad\regl-renderer\src\rendering\commands\drawGrid\index.js
// @jscad\regl-renderer\demo-web.js
export type GridEntity = Entity & {
  visuals: {
    color?: Rgba;
    fadeOut?: boolean;
  };
  size?: [number, number];
  ticks?: number;
  centered?: boolean;

  // Deprecated
  lineWidth?: number;
};

// @jscad\regl-renderer\src\rendering\commands\drawGrid\multi.js
// @jscad\regl-renderer\demo-web.js
// @jscad\web\src\ui\views\viewer.js
// @jscad\regl-renderer\src\index.js
export type MultiGridEntity = Omit<GridEntity, 'ticks'> & {
  // Entity#visuals gets stuffed into the nested DrawCommand as Props.
  // The Props get passed on wholesale by makeDrawMultiGrid()'s returned lambda,
  // where the following properties then get used
  // (rather than while setting up the DrawCommands)
  visuals: {
    subColor?: Rgba; // as color
  };

  // First number used on the main grid, second number on sub grid
  ticks?: [number, number];
};

// @jscad\regl-renderer\src\rendering\commands\drawLines\index.js
export type LinesEntity = Entity & {
  color?: Rgba;
};

// @jscad\regl-renderer\src\rendering\commands\drawMesh\index.js
export type MeshEntity = Entity & {
  dynamicCulling?: boolean;
  color?: Rgba;
};

// @jscad\regl-renderer\src\geometry-utils-V2\geom3ToGeometries.js
// @jscad\regl-renderer\src\geometry-utils-V2\geom3ToGeometries.test.js
export type Geometry = {
  type: '2d' | '3d';
  positions: CoordinatesXYZ[];
  normals: CoordinatesXYZ[];
  indices: CoordinatesXYZ[];
  colors: Rgba[];
  transforms: Mat4;
  isTransparent: boolean;
};
export type Mat4 = Float32Array;

export type BoundingBox = [Numbers3, Numbers3];

const orbitControls = controls.orbit;
const orbitControlsState = orbitControls.defaults;

export type OrbitControls = typeof orbitControls;
export type OrbitControlsState = typeof orbitControlsState;

// @jscad\regl-renderer\src\controls\orbitControls.js
export type OrbitRotate = ReturnType<typeof orbitTypes.rotate>;

// @jscad\regl-renderer\src\controls\orbitControls.js
export type OrbitZoom = ReturnType<typeof orbitTypes.zoom>;

// @jscad\regl-renderer\src\controls\orbitControls.js
export type OrbitPan = ReturnType<typeof orbitTypes.pan>;

// @jscad\regl-renderer\src\controls\orbitControls.js
export type OrbitZoomToFit = ReturnType<typeof orbitTypes.zoomToFit>;

// @jscad\regl-renderer\src\controls\orbitControls.js
export type OrbitUpdate = ReturnType<typeof orbitTypes.update>;

// @jscad\regl-renderer\src\geometry-utils-V2\entitiesFromSolids.js
// Converts Solids into Geometries and then into Entities
export namespace EntitiesFromSolids {
  export type Function = (
    options?: Options,
    ...solids: Solid[]
  ) => GeometryEntity[];

  export type Options = {
    // Default colour for entity rendering if the solid does not have one
    color?: Rgba;

    // Whether to smooth the normals of 3D solids, rendering a smooth surface
    smoothNormals?: boolean;
  };
}
