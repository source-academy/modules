/* eslint-disable max-classes-per-file */

import { ModuleState } from 'js-slang';
import { glAnimation, AnimFrame } from '../../typings/anim_types';
import { ReplResult } from '../../typings/type_helpers';
import { Curve, CurveDrawn } from './curves_webgl';

/** A function that takes in CurveFunction and returns a tranformed CurveFunction. */
export type CurveTransformer = (c: Curve) => Curve;

export type DrawMode = 'lines' | 'points';
export type ScaleMode = 'none' | 'stretch' | 'fit';
export type CurveSpace = '2D' | '3D';

/**
 * A function that takes in a timestamp and returns a Curve
 */
export type CurveAnimation = (t: number) => Curve;

/**
 * A function that specifies additional rendering information when taking in
 * a CurveFunction and returns a ShapeDrawn based on its specifications.
 */
export type RenderFunction = (func: Curve) => CurveDrawn;

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
    (curve as any).shouldAppend = false;
    const curveDrawn = this.drawer(curve);

    return {
      draw: (canvas: HTMLCanvasElement) => {
        curveDrawn.init(canvas);
        curveDrawn.redraw(this.angle);
      },
    };
  }

  public angle: number;

  public toReplString = () => '<AnimatedCurve>';
}

export class CurveModuleState implements ModuleState {
  constructor() {
    this.drawnCurves = [];
  }

  public drawnCurves: (CurveDrawn | AnimatedCurve)[];
}
