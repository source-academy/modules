/* eslint-disable max-classes-per-file */

import { ModuleState } from 'js-slang';
import { glAnimation, AnimFrame } from '../../typings/anim_types';
import { ReplResult } from '../../typings/type_helpers';
import { Curve, CurveDrawn } from './curves_webgl';

/** A function that takes in CurveFunction and returns a tranformed CurveFunction. */
export type CurveTransformer = (c: Curve) => Curve;

/**
 * A function that specifies additional rendering information when taking in
 * a CurveFunction and returns a ShapeDrawn based on its specifications.
 */
export type RenderFunction = (func: Curve) => CurveDrawn;

export class CurveAnimation extends glAnimation implements ReplResult {
  constructor(
    duration: number,
    numFrames: number,
    private readonly func: (step: number) => Curve,
    private readonly drawer: RenderFunction
  ) {
    super(duration, numFrames);
  }

  public getFrame(step: number): AnimFrame {
    const curve = this.func(step);
    (curve as any).shouldAppend = false;
    const curveDrawn = this.drawer(curve);

    return {
      draw: (canvas: HTMLCanvasElement) => {
        curveDrawn.init(canvas);
        curveDrawn.redraw(0);
      },
    };
  }

  public toReplString = () => '<CurveAnimation>';
}

export class CurveModuleState implements ModuleState {
  constructor() {
    this.drawnCurves = [];
  }

  public drawnCurves: (CurveDrawn | CurveAnimation)[];
}
