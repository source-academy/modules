import type { DataType, TypedValue } from '@sourceacademy/conductor/types';
import type { ReplResult } from '@sourceacademy/modules-lib/types';
import type { Data, Layout } from 'plotly.js-dist';

/**
 * Represents plots with a draw method attached
 */
export class DrawnPlot implements ReplResult {
  constructor(
    private readonly data: Data
  ) { }

  public toReplString = () => '<Plot>';
}

export class CurvePlot implements ReplResult {
  constructor(
    private readonly data: Data,
    private readonly layout: Partial<Layout>
  ) { }

  public toReplString = () => '<CurvePlot>';

  public toSerialized = () => ({
    data: this.data,
    layout: this.layout
  });

  static fromSerialized = (serialized: { data: Data, layout: Partial<Layout> }) => {
    return new CurvePlot(serialized.data, serialized.layout);
  };
}

export type ListOfPairs = (ListOfPairs | any)[] | null;
export type Data2d = number[];

export type DataTransformer = TypedValue<DataType.CLOSURE>;
export type CurvePlotFunction = TypedValue<DataType.CLOSURE>;
