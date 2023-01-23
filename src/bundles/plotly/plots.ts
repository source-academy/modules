import { ReplResult } from '../../typings/type_helpers';

export abstract class DrawnPlot implements ReplResult {
  public toReplString = () => '<Plot>';

  public abstract draw: (drawingFn: () => void) => void;
}

export class BarPlot extends DrawnPlot {
  drawFn: any;
  constructor(drawFn: any) { super(); this.drawFn = drawFn; }

  public draw = () => {
    this.drawFn();
  };
}

export class ScatterPlot extends DrawnPlot {
  drawFn: any;
  constructor(drawFn: any) { super(); this.drawFn = drawFn; }

  public draw = () => {
    this.drawFn();
  };
}
