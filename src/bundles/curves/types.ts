export type CurveObject = {
  drawCube: number[];
  color: number[];
  curvePos: number[];
};
export type Point = {
  x: number;
  y: number;
  z: number;
  color: [r: number, g: number, b: number, t: number];
};
/** A function that takes in number from 0 to 1 and returns a Point */
export type CurveFunction = (t: number) => Point;
export type RenderFunction = (func: CurveFunction) => void;
/** A function that takes in CurveFunction and returns a tranformed CurveFunction */
export type CurveTransformer = (c: CurveFunction) => CurveFunction;
