export type CurveObject = {
  drawCube: number[];
  color: number[];
  curvePos: number[];
};
class Point {
  x: number;

  y: number;

  z: number;

  color: number[];

  constructor(
    x: number,
    y: number,
    z: number,
    r: number,
    g: number,
    b: number
  ) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.color = [r, g, b, 1];
  }

  getColor(): number[] {
    return this.color;
  }

  getX(): number {
    return this.x;
  }

  getY(): number {
    return this.y;
  }

  getZ(): number {
    return this.z;
  }
}
export type curveFunction = (x: number) => Point;
export type renderFunction = (func: curveFunction) => void;
export type curveTransformer = (c: curveFunction) => curveFunction;
