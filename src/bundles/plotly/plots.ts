import { ReplResult } from '../../typings/type_helpers';

export abstract class DrawnPlot implements ReplResult {
  public toReplString = () => '<Plot>';

  public abstract draw: (data: any, divId: string) => void;
}

export class Plot extends DrawnPlot {
  drawFn: any;
  data: any;
  constructor(drawFn: any, data: any) { super(); this.drawFn = drawFn; this.data = data; }

  public draw = (divId: string ) => {
    this.drawFn(this.data, divId);
  };
}

export class BarPlot extends DrawnPlot {
  drawFn: any;
  constructor(drawFn: any) { super(); this.drawFn = drawFn; }

  public draw = (divId: string) => {
    this.drawFn(divId);
  };
}

export class ScatterPlot extends DrawnPlot {
  drawFn: any;
  constructor(drawFn: any) { super(); this.drawFn = drawFn; }

  public draw = (divId: string) => {
    this.drawFn(divId);
  };
}
