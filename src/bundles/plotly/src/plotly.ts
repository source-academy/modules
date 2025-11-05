import type { Curve } from '@sourceacademy/bundle-curve/curves_webgl';
import type { ReplResult } from '@sourceacademy/modules-lib/types';
import type { Data, Layout } from 'plotly.js-dist';

/**
 * Represents plots with a draw method attached
 */
export class DrawnPlot implements ReplResult {
  constructor(
    private readonly drawFn: any,
    private readonly data: ListOfPairs
  ) {}

  public toReplString = () => '<Plot>';

  public draw = (divId: string) => {
    this.drawFn(this.data, divId);
  };
}

export class CurvePlot implements ReplResult {
  constructor(
    private readonly plotlyDrawFn: any,
    private readonly data: Data,
    private readonly layout: Partial<Layout>
  ) {}

  public toReplString = () => '<CurvePlot>';

  public draw = (divId: string) => {
    this.plotlyDrawFn(divId, this.data, this.layout);
  };
}

export type ListOfPairs = (ListOfPairs | any)[] | null;
export type Data2d = number[];

export type DataTransformer = (c: Data2d[]) => Data2d[];
export type CurvePlotFunction = (func: Curve) => CurvePlot;
