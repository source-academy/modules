import { ReplResult } from '../../typings/type_helpers';


/**
 * Represents plots with a draw method attached
 */
export class DrawnPlot implements ReplResult {
  drawFn: any;
  data: any;
  constructor(drawFn: any, data: any) {  this.drawFn = drawFn; this.data = data; }
  public toReplString = () => '<Plot>';
  

  public draw = (divId: string ) => {
    this.drawFn(this.data, divId);
  };
}
