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
export type curveFunction = (x: number) => Point;
export type renderFunction = (func: curveFunction) => void;
export type curveTransformer = (c: curveFunction) => curveFunction;
