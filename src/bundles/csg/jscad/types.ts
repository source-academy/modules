/* [Import] */
import type { RGB, RGBA } from '@jscad/modeling/src/colors/types.js';
import type { Geom3 } from '@jscad/modeling/src/geometries/types.js';
import { type cameras, type drawCommands, controls } from '@jscad/regl-renderer';
import type makeDrawMultiGrid from '@jscad/regl-renderer/types/rendering/commands/drawGrid/multi';

/* [Main] */
let { orbit } = controls;

/* [Exports] */
export type Color = RGB;
export type AlphaColor = RGBA;

export type Numbers2 = [number, number];
export type Numbers3 = [number, number, number];

export type Vector = Numbers3;
export type Coordinates = Numbers3;
export type BoundingBox = [Coordinates, Coordinates];

// @jscad\regl-renderer\src\rendering\renderDefaults.js
export type RenderOptions = {
  // Used early on in render.js. Clears the canvas to the specified background
  // colour
  background?: AlphaColor;

  // Specified values used in various rendering commands as shader uniforms
  lightColor?: AlphaColor;
  lightDirection?: Vector;
  ambientLightAmount?: number;
  diffuseLightAmount?: number;
  specularLightAmount?: number;
  materialShininess?: number; // As uMaterialShininess in main DrawCommand

  // Specified value is unused, which seems unintentional. Their default value
  // for this is used directly in V2's entitiesFromSolids.js as the default
  // Geometry colour. Also gets used directly in various rendering commands as
  // their shader uniforms' default colour
  meshColor?: AlphaColor;

  // Unused
  lightPosition?: Coordinates; // See also lightDirection
};

// @jscad\regl-renderer\src\geometry-utils-V2\entitiesFromSolids.js
// @jscad\regl-renderer\demo-web.js
// @jscad\regl-renderer\src\rendering\render.js
/*
  (This is not exhaustive. There are still other Props used for uniforms in the
  various rendering commands. Eg model, color, angle.)
  (There are other Entity subtypes not defined in this file - GridEntity,
  LineEntity & MeshEntity)
*/
export type Entity = {
  visuals: {
    // Key for the DrawCommandMaker that should be used on this Entity. Key gets
    // used on WrappedRendererData#drawCommands. Property must exist & match a
    // DrawCommandMaker, or behaviour is like show: false
    drawCmd: 'drawAxis' | 'drawGrid' | 'drawLines' | 'drawMesh';

    // Whether to actually draw the Entity via nested DrawCommand
    show: boolean;

    // Used to retrieve created DrawCommands from cache
    cacheId?: number | null;
  };
};

// @jscad\regl-renderer\src\geometry-utils-V2\geom3ToGeometries.js
// @jscad\regl-renderer\src\geometry-utils-V2\geom3ToGeometries.test.js
export type Geometry = {
  type: '2d' | '3d';
  positions: Coordinates[];
  normals: Coordinates[];
  indices: Coordinates[];
  colors: AlphaColor[];
  transforms: Mat4;
  isTransparent: boolean;
};

// @jscad\regl-renderer\src\geometry-utils-V2\entitiesFromSolids.js
export type GeometryEntity = Entity & {
  visuals: {
    drawCmd: 'drawLines' | 'drawMesh';

    // Whether the Geometry is transparent. Transparents need to be rendered
    // before non-transparents
    transparent: boolean;

    // Eventually determines whether to use vColorShaders (Geometry must also
    // have colour), or meshShaders
    useVertexColors: boolean;
  };

  // The original Geometry used to make the GeometryEntity
  geometry: Geometry;
};

// @jscad\regl-renderer\src\rendering\commands\drawGrid\multi.js
// @jscad\regl-renderer\src\rendering\commands\drawGrid\index.js
// @jscad\regl-renderer\demo-web.js
// @jscad\web\src\ui\views\viewer.js
// @jscad\regl-renderer\src\index.js
export type MultiGridEntityType = Entity & {
  // Entity#visuals gets stuffed into the nested DrawCommand as Props. The Props
  // get passed on wholesale by makeDrawMultiGrid()'s returned lambda, where the
  // following properties then get used (rather than while setting up the
  // DrawCommands)
  visuals: {
    drawCmd: 'drawGrid';

    color?: AlphaColor;
    subColor?: AlphaColor; // Also as color

    fadeOut?: boolean;
  };

  size?: Numbers2;
  // First number used on the main grid, second number on sub grid
  ticks?: [number, number];

  centered?: boolean;

  // Deprecated
  lineWidth?: number;
};

// @jscad\regl-renderer\src\rendering\commands\drawAxis\index.js
// @jscad\regl-renderer\demo-web.js
export type AxisEntityType = Entity & {
  visuals: {
    drawCmd: 'drawAxis';
  };

  size?: number;
  alwaysVisible?: boolean;

  xColor?: AlphaColor;
  yColor?: AlphaColor;
  zColor?: AlphaColor;

  // Deprecated
  lineWidth?: number;
};

// There are 4 rendering commands to use in regl-renderer: drawAxis, drawGrid,
// drawLines & drawMesh. drawExps appears abandoned. Only once passed Regl & an
// Entity do they return an actual DrawCommand
export type DrawCommandMaker = typeof drawCommands | typeof makeDrawMultiGrid;
export type DrawCommandMakers = Record<string, DrawCommandMaker>;

// @jscad\regl-renderer\src\cameras\perspectiveCamera.js
// @jscad\regl-renderer\src\cameras\orthographicCamera.js
/*
  (Not exhaustive, only defines well the important properties we need.)
  (Orthgraphic camera is ignored, this file assumes PerspectiveCameraState)
*/
export type Mat4 = Float32Array;
export type PerspectiveCameraState = Omit<
  typeof cameras.perspective.cameraState,
'target' | 'position' | 'view'
> & {
  target: Coordinates;

  position: Coordinates;
  view: Mat4;
};

// @jscad\regl-renderer\src\rendering\render.js
/*
  Gets used in the WrappedRenderer. Also gets passed as Props into the main
  DrawCommand, where it is used in setup specified by the internal
  renderContext.js/renderWrapper. The lambda of the main DrawCommand does not
  use those Props, rather, it references the data in the WrappedRenderer
  directly. Therefore, regl.prop() is not called, nor are Props used via the
  semantic equivalent (context, props) => {}. The context passed to that lambda
  also remains unused
*/
export type WrappedRendererData = {
  entities: Entity[];
  // A CUSTOM property used to easily pass only the GeometryEntities to
  // InputTracker for zoom to fit
  geometryEntities: GeometryEntity[];

  // Along with all of the relevant Entity's & Entity#visuals's properties, this
  // entire object gets destructured & stuffed into each nested DrawCommand as
  // Props. Messy & needs tidying in regl-renderer
  camera: PerspectiveCameraState;

  rendering?: RenderOptions;

  drawCommands: DrawCommandMakers;
};

// @jscad\regl-renderer\src\rendering\render.js
/*
  When called, the WrappedRenderer creates a main DrawCommand. This main
  DrawCommand then gets called as a scoped command, used to create & call more
  DrawCommands for the data.entities. Nested DrawCommands get cached & may store
  some Entity properties during setup, but properties passed in from Props later
  may take precedence. The main DrawCommand is said to be in charge of injecting
  most uniforms into the Regl context, ie keeping track of all Regl global state
*/
export type WrappedRenderer = (data: WrappedRendererData) => void;

// @jscad\regl-renderer\src\controls\orbitControls.js
/*
  (Not exhaustive, only defines well the important properties we need)
*/
export type ControlsState = Omit<
  typeof orbit.controlsState,
'scale' | 'thetaDelta' | 'phiDelta'
> &
  typeof orbit.controlsProps & {
  scale: number;

  thetaDelta: number;
  phiDelta: number;
};

export type Solid = Geom3;

// @jscad\regl-renderer\src\geometry-utils-V2\entitiesFromSolids.js
/*
  Options for the function that converts Solids into Geometries, then into
  GeometryEntities
*/
export type EntitiesFromSolidsOptions = {
  // Default colour for entity rendering if the solid does not have one
  color?: AlphaColor;

  // Whether to smooth the normals of 3D solids, rendering a smooth surface
  smoothNormals?: boolean;
};

// @jscad\regl-renderer\src\controls\orbitControls.js
export type UpdatedStates = {
  camera: {
    position: Coordinates;
    view: Mat4;
  };
  controls: {
    thetaDelta: number;
    phiDelta: number;
    scale: number;

    changed: boolean;
  };
};

// @jscad\regl-renderer\src\controls\orbitControls.js
export type ZoomToFitStates = {
  camera: {
    target: Vector;
  };
  controls: {
    scale: number;
  };
};

// @jscad\regl-renderer\src\controls\orbitControls.js
export type RotateStates = {
  camera: PerspectiveCameraState;
  controls: {
    thetaDelta: number;
    phiDelta: number;
  };
};

// @jscad\regl-renderer\src\controls\orbitControls.js
export type PanStates = {
  camera: {
    position: Coordinates;
    target: Vector;
  };
  controls: ControlsState;
};
