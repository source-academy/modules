import type { ReplResult } from '../../typings/type_helpers';
import type { Data, Layout } from 'plotly.js-dist';

export class LinePlot implements ReplResult {
  plotlyDrawFn: any;
  data: Data;
  layout: Partial<Layout>;
  constructor(plotlyDrawFn: any, data: Data, layout: Partial<Layout>) {
    this.plotlyDrawFn = plotlyDrawFn;
    this.data = data;
    this.layout = layout;
  }
  public toReplString = () => '<LinePlot>';

  public draw = (divId: string) => {
    this.plotlyDrawFn(divId, this.data, this.layout);
  };
}

type Vector = number[];
export type Frame = Vector[];
