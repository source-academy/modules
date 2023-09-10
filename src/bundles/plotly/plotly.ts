import { type Data, type Layout } from 'plotly.js-dist';
import { type ReplResult } from '../../typings/type_helpers';

/**
 * Represents plots with a draw method attached
 */
export class DrawnPlot implements ReplResult {
  drawFn: any;
  data: ListOfPairs;
  constructor(drawFn: any, data: ListOfPairs) {
    this.drawFn = drawFn;
    this.data = data;
  }

  public toReplString = () => '<Plot>';

  public draw = (divId: string) => {
    this.drawFn(this.data, divId);
  };
}

export class CurvePlot implements ReplResult {
  plotlyDrawFn: any;
  data: Data;
  layout: Partial<Layout>;
  constructor(plotlyDrawFn: any, data: Data, layout: Partial<Layout>) {
    this.plotlyDrawFn = plotlyDrawFn;
    this.data = data;
    this.layout = layout;
  }
  public toReplString = () => '<CurvePlot>';

  public draw = (divId: string) => {
    this.plotlyDrawFn(divId, this.data, this.layout);
  };
}

export type ListOfPairs = (ListOfPairs | any)[] | null;
export type Data2d = number[];
export type Color = { r: number, g: number, b: number };

export type DataTransformer = (c: Data2d[]) => Data2d[];
export type CurvePlotFunction = ((func: Curve) => CurvePlot);

export type Curve = ((n: number) => Point);
export type CurveTransformer = (c: Curve) => Curve;


/** Encapsulates 3D point with RGB values. */
export class Point implements ReplResult {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly z: number,
    public readonly color: Color,
  ) {}

  public toReplString = () => `(${this.x}, ${this.y}, ${this.z}, Color: ${this.color})`;
}
