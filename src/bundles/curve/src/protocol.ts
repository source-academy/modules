import type { CurveDrawn } from './curves_webgl';
import type { CurveSpace, DrawMode } from './types';

export const CURVE_CHANNEL_ID = 'sourceacademy-curve-channel';
export const CURVE_RUNNER_ID = 'curve-runner';
export const CURVE_WEB_ID = 'curve-web';
export const CURVE_TAB_ID = 'curve';
export const CURVE_TAB_NAME = 'Curve';

export type SerializedCurveDrawn = {
  drawMode: DrawMode;
  numPoints: number;
  space: CurveSpace;
  drawCubeArray: number[];
  curvePosArray: number[];
  curveColorArray: number[];
};

export type CurveRenderMessage = {
  type: 'render';
  curve: SerializedCurveDrawn;
};

export type CurveAnimationMessage = {
  type: 'animation';
  duration: number;
  fps: number;
  is3D: boolean;
  frames: SerializedCurveDrawn[];
};

export type CurveDisplayMessage = CurveRenderMessage | CurveAnimationMessage;

export type CurveChannelMessage = CurveDisplayMessage | {
  type: 'request';
};

export function serializeCurveDrawn(curve: CurveDrawn): SerializedCurveDrawn {
  return curve.toSerializable();
}
