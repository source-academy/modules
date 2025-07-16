import { glAnimation, type AnimFrame, type ReplResult } from '@sourceacademy/modules-lib/types';
import type { Curve, CurveDrawn } from './curves_webgl';

export type CurveModuleState = {
  drawnCurves: (AnimatedCurve | CurveDrawn)[]
};

/** A function that takes in CurveFunction and returns a tranformed CurveFunction. */
export type CurveTransformer = (c: Curve) => Curve;

export type DrawMode = 'lines' | 'points';
export type ScaleMode = 'fit' | 'none' | 'stretch';
export type CurveSpace = '2D' | '3D';

/**
 * A function that takes in a timestamp and returns a Curve
 */
export type CurveAnimation = (t: number) => Curve;

/**
 * A function that specifies additional rendering information when taking in
 * a CurveFunction and returns a ShapeDrawn based on its specifications.
 */
export interface RenderFunction extends ReplResult {
  (func: Curve): CurveDrawn
  is3D: boolean
};

export class AnimatedCurve extends glAnimation implements ReplResult {
  constructor(
    duration: number,
    fps: number,
    private readonly func: (timestamp: number) => Curve,
    private readonly drawer: RenderFunction,
    public readonly is3D: boolean
  ) {
    super(duration, fps);
    this.angle = 0;
  }

  public getFrame(timestamp: number): AnimFrame {
    const curve = this.func(timestamp);
    curve.shouldNotAppend = true;
    const curveDrawn = this.drawer(curve);

    return {
      draw: (canvas: HTMLCanvasElement) => {
        curveDrawn.init(canvas);
        curveDrawn.redraw(this.angle);
      }
    };
  }

  public angle: number;

  public toReplString = () => '<AnimatedCurve>';
}
