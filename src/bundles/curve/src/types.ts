import type { DataType, IDataHandler, TypedValue } from '@sourceacademy/conductor/types';
import { glAnimation, type AnimFrame, type ReplResult } from '@sourceacademy/modules-lib/types';
import { isFunctionOfLength } from '@sourceacademy/modules-lib/utilities';
import { CurveDrawn, type Curve, type Point } from './curves_webgl';
import type { CurveAnimationMessage, SerializedCurveDrawn } from './protocol';

export type CurveModuleState = {
  drawnCurves: (AnimatedCurve | CurveDrawn)[];
};

/** A function that takes in CurveFunction and returns a tranformed CurveFunction. */
export type CurveTransformer = TypedValue<DataType.CLOSURE>;

export type DrawMode = 'lines' | 'points';
export type ScaleMode = 'fit' | 'none' | 'stretch';
export type CurveSpace = '2D' | '3D';

/**
 * A function that takes in a timestamp and returns a Curve
 */
export type CurveAnimation = TypedValue<DataType.CLOSURE>;

/**
 * A function that specifies additional rendering information when taking in
 * a {@link Curve|Curve} and returns a ShapeDrawn based on its specifications.
 */
export interface RenderFunction extends ReplResult {
  (func: Curve): AsyncGenerator<void, CurveDrawn, undefined>;
  /**
   * @hidden
   */
  is3D: boolean;
};

/**
 * A function that returns a {@link RenderFunction|RenderFunction} that is bound to
 * the specified number of points
 */
export interface RenderFunctionCreator {
  (evaluator: IDataHandler, numPoints: number): RenderFunction;

  /** @hidden */
  scaleMode: ScaleMode;

  /** @hidden */
  drawMode: DrawMode;

  /** @hidden */
  space: CurveSpace;

  /** @hidden */
  isFullView: boolean;
}

export class AnimatedCurve extends glAnimation implements ReplResult {
  constructor(
    duration: number,
    fps: number,
    private readonly frames: CurveDrawn[],
    public readonly is3D: boolean
  ) {
    super(duration, fps);
    this.angle = 0;
  }

  public getFrame(timestamp: number): AnimFrame {
    const frameIndex = Math.floor((timestamp / this.duration) * this.frames.length) % this.frames.length;
    const curveDrawn = this.frames[frameIndex];
    return {
      draw: (canvas: HTMLCanvasElement) => {
        curveDrawn.init(canvas);
        curveDrawn.redraw(this.angle);
      }
    };
  }

  /**
   * Viewport angle in radians
   */
  public angle: number;

  public toReplString = () => '<AnimatedCurve>';
  public toSerializable = (): CurveAnimationMessage => ({
    type: 'animation',
    duration: this.duration,
    fps: this.fps,
    is3D: this.is3D,
    frames: this.frames.map(frame => frame.toSerializable())
  });

  public static fromSerializable = (serialized: CurveAnimationMessage[]): AnimatedCurve => {
    const { duration, fps, is3D, frames } = serialized[0];
    return new AnimatedCurve(duration, fps, frames.map(frame => CurveDrawn.fromSerializable(frame)), is3D);
  };
}
