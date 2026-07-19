import { DataType, type IDataHandler, type TypedValue } from '@sourceacademy/conductor/types';
import context from 'js-slang/context';

import { generateCurve, type Curve, type CurveDrawn } from './curves_webgl';
import {
  AnimatedCurve,
  type CurveAnimation,
  type CurveSpace,
  type DrawMode,
  type RenderFunction,
  type RenderFunctionCreator,
  type ScaleMode
} from './types';
import { GeneralRuntimeError } from '@sourceacademy/modules-lib/errors';

const drawnCurves: (AnimatedCurve | CurveDrawn)[] = [];
context.moduleContexts.curve.state = {
  drawnCurves
};

function getRenderFunctionCreator(
  scaleMode: ScaleMode,
  drawMode: DrawMode,
  space: CurveSpace,
  isFullView: boolean,
  name: string
): RenderFunctionCreator {
  function renderFuncCreator(
    evaluator: IDataHandler,
    numPoints: number
  ) {
    if (numPoints <= 0 || numPoints > 65535 || !Number.isInteger(numPoints)) {
      throw new GeneralRuntimeError(
        `${name}: The number of points must be a positive integer less than or equal to 65535. ` +
        `Got: ${numPoints}`
      );
    }

    async function* renderFunc(curve: Curve) {
      try {
        await evaluator.closure_arity_assert(curve, 1);
      } catch {
        throw new GeneralRuntimeError(
          'The provided curve is not a valid Curve function. ' +
          'A Curve function must take exactly one parameter (a number t between 0 and 1) ' +
          'and return a Point or 3D Point depending on whether it is a 2D or 3D curve.'
        );
      }

      const curveDrawn = yield* generateCurve(
        evaluator,
        scaleMode,
        drawMode,
        numPoints,
        curve,
        space,
        isFullView
      );
      return curveDrawn;
    }

    renderFunc.is3D = space === '3D';
    renderFunc.toReplString = () => `<${space === '3D' ? '3D' : ''}RenderFunction(${numPoints})>`;

    return renderFunc;
  }

  Object.defineProperty(renderFuncCreator, 'name', { value: name });
  renderFuncCreator.scaleMode = scaleMode;
  renderFuncCreator.drawMode = drawMode;
  renderFuncCreator.space = space;
  renderFuncCreator.isFullView = isFullView;

  return renderFuncCreator;
}

// =============================================================================
// Module's Exposed Functions
//
// This file only includes the implementation and documentation of exposed
// functions of the module. For private functions dealing with the browser's
// graphics library context, see './curves_webgl.ts'.
// =============================================================================

/** @hidden */
export class RenderFunctionCreators {
  static draw_connected = getRenderFunctionCreator('none', 'lines', '2D', false, 'draw_connected');

  static draw_connected_full_view = getRenderFunctionCreator(
    'stretch',
    'lines',
    '2D',
    true,
    'draw_connected_full_view'
  );

  static draw_connected_full_view_proportional = getRenderFunctionCreator(
    'fit',
    'lines',
    '2D',
    true,
    'draw_connected_full_view_proportional'
  );

  static draw_points = getRenderFunctionCreator('none', 'points', '2D', false, 'draw_points');

  static draw_points_full_view = getRenderFunctionCreator(
    'stretch',
    'points',
    '2D',
    true,
    'draw_points_full_view'
  );

  static draw_points_full_view_proportional = getRenderFunctionCreator(
    'fit',
    'points',
    '2D',
    true,
    'draw_points_full_view_proportional'
  );

  static draw_3D_connected = getRenderFunctionCreator(
    'none',
    'lines',
    '3D',
    false,
    'draw_3D_connected'
  );

  static draw_3D_connected_full_view = getRenderFunctionCreator(
    'stretch',
    'lines',
    '3D',
    true,
    'draw_3D_connected_full_view'
  );

  static draw_3D_connected_full_view_proportional = getRenderFunctionCreator(
    'fit',
    'lines',
    '3D',
    true,
    'draw_3D_connected_full_view_proportional'
  );

  static draw_3D_points = getRenderFunctionCreator('none', 'points', '3D', false, 'draw_3D_points');

  static draw_3D_points_full_view = getRenderFunctionCreator(
    'stretch',
    'points',
    '3D',
    true,
    'draw_3D_points_full_view'
  );

  static draw_3D_points_full_view_proportional = getRenderFunctionCreator(
    'fit',
    'points',
    '3D',
    true,
    'draw_3D_points_full_view_proportional'
  );
}

export const draw_connected = RenderFunctionCreators.draw_connected;

export const draw_connected_full_view = RenderFunctionCreators.draw_connected_full_view;

export const draw_connected_full_view_proportional = RenderFunctionCreators.draw_connected_full_view_proportional;

export const draw_points = RenderFunctionCreators.draw_points;

export const draw_points_full_view = RenderFunctionCreators.draw_points_full_view;

export const draw_points_full_view_proportional = RenderFunctionCreators.draw_points_full_view_proportional;

export const draw_3D_connected = RenderFunctionCreators.draw_3D_connected;

export const draw_3D_connected_full_view = RenderFunctionCreators.draw_3D_connected_full_view;

export const draw_3D_connected_full_view_proportional = RenderFunctionCreators.draw_3D_connected_full_view_proportional;

export const draw_3D_points = RenderFunctionCreators.draw_3D_points;

export const draw_3D_points_full_view = RenderFunctionCreators.draw_3D_points_full_view;

export const draw_3D_points_full_view_proportional = RenderFunctionCreators.draw_3D_points_full_view_proportional;

class CurveAnimators {
  static async* animate_curve(
    evaluator: IDataHandler,
    duration: number,
    fps: number,
    drawer: RenderFunction,
    func: CurveAnimation
  ): AsyncGenerator<void, AnimatedCurve, undefined> {
    if (drawer.is3D) {
      throw new GeneralRuntimeError(`${animate_curve.name} cannot be used with 3D draw function!`);
    }

    const frameCount = Math.floor(fps * duration);
    const frames: CurveDrawn[] = [];
    for (let i = 0; i < fps * duration; i++) {
      const t = i / frameCount;
      frames.push(yield* drawer((yield* evaluator.closure_call(func, [{ type: DataType.NUMBER, value: t }], DataType.CLOSURE)) as TypedValue<DataType.CLOSURE>));
    }

    const anim = new AnimatedCurve(duration, fps, frames, false);
    drawnCurves.push(anim);
    return anim;
  }

  static async* animate_3D_curve(
    evaluator: IDataHandler,
    duration: number,
    fps: number,
    drawer: RenderFunction,
    func: CurveAnimation
  ): AsyncGenerator<void, AnimatedCurve, undefined> {
    if (!drawer.is3D) {
      throw new GeneralRuntimeError(`${animate_3D_curve.name} cannot be used with 2D draw function!`);
    }

    const frameCount = Math.floor(fps * duration);
    const frames: CurveDrawn[] = [];
    for (let i = 0; i < fps * duration; i++) {
      const t = i / frameCount;
      frames.push(yield* drawer((yield* evaluator.closure_call(func, [{ type: DataType.NUMBER, value: t }], DataType.CLOSURE)) as TypedValue<DataType.CLOSURE>));
    }

    const anim = new AnimatedCurve(duration, fps, frames, true);
    drawnCurves.push(anim);
    return anim;
  }
}

export const animate_curve = CurveAnimators.animate_curve;

export const animate_3D_curve = CurveAnimators.animate_3D_curve;
