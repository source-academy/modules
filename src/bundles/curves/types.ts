/* eslint-disable no-unused-vars */
/** encapsulates 3D point with RGB values */
export type Point = {
  x: number;
  y: number;
  z: number;
  color: [r: number, g: number, b: number, t: number];
};
/** a function that takes in number from 0 to 1 and returns a Point */
export type CurveFunction = (t: number) => Point;
export type RenderFunction = (func: CurveFunction) => void;
/** a function that takes in CurveFunction and returns a tranformed CurveFunction */
export type CurveTransformer = (c: CurveFunction) => CurveFunction;
export type ShapeDrawn = {
  toReplString: () => string;
  init: (canvas: HTMLCanvasElement) => void;
};
export type ProgramInfo = {
  program: WebGLProgram;
  attribLocations: {
    vertexPosition: number;
    vertexColor: number;
  };
  uniformLocations: {
    projectionMatrix: WebGLUniformLocation | null;
    modelViewMatrix: WebGLUniformLocation | null;
  };
};
export type BufferInfo = {
  cubeBuffer: WebGLBuffer | null;
  curveBuffer: WebGLBuffer | null;
  curveColorBuffer: WebGLBuffer | null;
};
