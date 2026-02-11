import { isFunctionOfLength } from '@sourceacademy/modules-lib/utilities';
import context from 'js-slang/context';

import { generateCurve, type Curve, type CurveDrawn } from './curves_webgl';
import { functionDeclaration } from './type_interface';
import {
  AnimatedCurve,
  type CurveAnimation,
  type CurveSpace,
  type DrawMode,
  type RenderFunction,
  type RenderFunctionCreator,
  type ScaleMode
} from './types';

const drawnCurves: (AnimatedCurve | CurveDrawn)[] = [];
context.moduleContexts.curve.state = {
  drawnCurves
};

function createDrawFunction(
  scaleMode: ScaleMode,
  drawMode: DrawMode,
  space: CurveSpace,
  isFullView: boolean,
  name: string
): RenderFunctionCreator {
  function renderFuncCreator(numPoints: number) {
    if (numPoints <= 0 || numPoints > 65535 || !Number.isInteger(numPoints)) {
      throw new Error(
        `${name}: The number of points must be a positive integer less than or equal to 65535. ` +
        `Got: ${numPoints}`
      );
    }

    function renderFunc(curve: Curve) {
      if (!isFunctionOfLength(curve, 1)) {
        throw new Error(
          'The provided curve is not a valid Curve function. ' +
          'A Curve function must take exactly one parameter (a number t between 0 and 1) ' +
          'and return a Point or 3D Point depending on whether it is a 2D or 3D curve.'
        );
      }

      const curveDrawn = generateCurve(
        scaleMode,
        drawMode,
        numPoints,
        curve,
        space,
        isFullView
      );

      if (!curve.shouldNotAppend) {
        drawnCurves.push(curveDrawn);
      }

      return curveDrawn;
    }

    renderFunc.is3D = space === '3D';

    const stringifier = () => `<${space === '3D' ? '3D' : ''}RenderFunction(${numPoints})>`;

    // Retain both properties for compatibility
    renderFunc.toString = stringifier;
    renderFunc.toReplString = stringifier;

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
  @functionDeclaration('numPoints: number', '(func: Curve) => Curve')
  static draw_connected = createDrawFunction('none', 'lines', '2D', false, 'draw_connected');

  @functionDeclaration('numPoints: number', '(func: Curve) => Curve')
  static draw_connected_full_view = createDrawFunction(
    'stretch',
    'lines',
    '2D',
    true,
    'draw_connected_full_view'
  );

  @functionDeclaration('numPoints: number', '(func: Curve) => Curve')
  static draw_connected_full_view_proportional = createDrawFunction(
    'fit',
    'lines',
    '2D',
    true,
    'draw_connected_full_view_proportional'
  );

  @functionDeclaration('numPoints: number', '(func: Curve) => Curve')
  static draw_points = createDrawFunction('none', 'points', '2D', false, 'draw_points');

  @functionDeclaration('numPoints: number', '(func: Curve) => Curve')
  static draw_points_full_view = createDrawFunction(
    'stretch',
    'points',
    '2D',
    true,
    'draw_points_full_view'
  );

  @functionDeclaration('numPoints: number', '(func: Curve) => Curve')
  static draw_points_full_view_proportional = createDrawFunction(
    'fit',
    'points',
    '2D',
    true,
    'draw_points_full_view_proportional'
  );

  @functionDeclaration('numPoints: number', '(func: Curve) => Curve')
  static draw_3D_connected = createDrawFunction(
    'none',
    'lines',
    '3D',
    false,
    'draw_3D_connected'
  );

  @functionDeclaration('numPoints: number', '(func: Curve) => Curve')
  static draw_3D_connected_full_view = createDrawFunction(
    'stretch',
    'lines',
    '3D',
    true,
    'draw_3D_connected_full_view'
  );

  @functionDeclaration('numPoints: number', '(func: Curve) => Curve')
  static draw_3D_connected_full_view_proportional = createDrawFunction(
    'fit',
    'lines',
    '3D',
    true,
    'draw_3D_connected_full_view_proportional'
  );

  @functionDeclaration('numPoints: number', '(func: Curve) => Curve')
  static draw_3D_points = createDrawFunction('none', 'points', '3D', false, 'draw_3D_points');

  @functionDeclaration('numPoints: number', '(func: Curve) => Curve')
  static draw_3D_points_full_view = createDrawFunction(
    'stretch',
    'points',
    '3D',
    true,
    'draw_3D_points_full_view'
  );

  @functionDeclaration('numPoints: number', '(func: Curve) => Curve')
  static draw_3D_points_full_view_proportional = createDrawFunction(
    'fit',
    'points',
    '3D',
    true,
    'draw_3D_points_full_view_proportional'
  );
}

/**
 * Returns a function that turns a given Curve into a Drawing, by sampling the
 * Curve at `num` sample points and connecting each pair with a line.
 * The parts between (0,0) and (1,1) of the resulting Drawing are shown in the window.
 *
 * @function
 * @param num determines the number of points, lower than 65535, to be sampled.
 * Including 0 and 1, there are `num + 1` evenly spaced sample points
 * @returns function of type Curve → Drawing
 * @example
 * ```
 * draw_connected(100)(t => make_point(t, t));
 * ```
 */
export const draw_connected = RenderFunctionCreators.draw_connected;

/**
 * Returns a function that turns a given Curve into a Drawing, by sampling the
 * Curve at `num` sample points and connecting each pair with a line. The Drawing is
 * translated and stretched/shrunk to show the full curve and maximize its width
 * and height, with some padding.
 *
 * @function
 * @param num determines the number of points, lower than 65535, to be sampled.
 * Including 0 and 1, there are `num + 1` evenly spaced sample points
 * @returns function of type Curve → Drawing
 * @example
 * ```
 * draw_connected_full_view(100)(t => make_point(t, t));
 * ```
 */
export const draw_connected_full_view = RenderFunctionCreators.draw_connected_full_view;

/**
 * Returns a function that turns a given Curve into a Drawing, by sampling the
 * Curve at `num` sample points and connecting each pair with a line. The Drawing
 * is translated and scaled proportionally to show the full curve and maximize
 * its size, with some padding.
 *
 * @function
 * @param num determines the number of points, lower than 65535, to be sampled.
 * Including 0 and 1, there are `num + 1` evenly spaced sample points
 * @returns function of type Curve → Drawing
 * @example
 * ```
 * draw_connected_full_view_proportional(100)(t => make_point(t, t));
 * ```
 */
export const draw_connected_full_view_proportional = RenderFunctionCreators.draw_connected_full_view_proportional;

/**
 * Returns a function that turns a given Curve into a Drawing, by sampling the
 * Curve at `num` sample points. The Drawing consists of isolated
 * points, and does not connect them. The parts between (0,0) and (1,1) of the
 * resulting Drawing are shown in the window.
 *
 * @function
 * @param num determines the number of points, lower than 65535, to be sampled.
 * Including 0 and 1,there are `num + 1` evenly spaced sample points
 * @returns function of type Curve → Drawing
 * @example
 * ```
 * draw_points(100)(t => make_point(t, t));
 * ```
 */
export const draw_points = RenderFunctionCreators.draw_points;

/**
 * Returns a function that turns a given Curve into a Drawing, by sampling the
 * Curve at `num` sample points. The Drawing consists of isolated
 * points, and does not connect them. The Drawing is translated and
 * stretched/shrunk to show the full curve and maximize its width and height,
 * with some padding.
 *
 * @function
 * @param num determines the number of points, lower than 65535, to be sampled.
 * Including 0 and 1, there are `num + 1` evenly spaced sample points
 * @returns function of type Curve → Drawing
 * @example
 * ```
 * draw_points_full_view(100)(t => make_point(t, t));
 * ```
 */
export const draw_points_full_view = RenderFunctionCreators.draw_points_full_view;

/**
 * Returns a function that turns a given Curve into a Drawing, by sampling the
 * Curve at `num` sample points. The Drawing consists of isolated
 * points, and does not connect them. The Drawing is translated and scaled
 * proportionally with its size maximized to fit entirely inside the window,
 * with some padding.
 *
 * @function
 * @param num determines the number of points, lower than 65535, to be sampled.
 * Including 0 and 1, there are `num + 1` evenly spaced sample points
 * @returns function of type Curve → Drawing
 * @example
 * ```
 * draw_points_full_view_proportional(100)(t => make_point(t, t));
 * ```
 */
export const draw_points_full_view_proportional = RenderFunctionCreators.draw_points_full_view_proportional;

/**
 * Returns a function that turns a given 3D Curve into a Drawing, by sampling
 * the 3D Curve at `num` sample points and connecting each pair with
 * a line. The parts between (0,0,0) and (1,1,1) of the resulting Drawing are
 * shown within the unit cube.
 *
 * @function
 * @param num determines the number of points, lower than 65535, to be sampled.
 * Including 0 and 1, there are `num + 1` evenly spaced sample points
 * @returns function of type Curve → Drawing
 * @example
 * ```
 * draw_3D_connected(100)(t => make_3D_point(t, t, t));
 * ```
 */
export const draw_3D_connected = RenderFunctionCreators.draw_3D_connected;

/**
 * Returns a function that turns a given 3D Curve into a Drawing, by sampling
 * the 3D Curve at `num` sample points and connecting each pair with
 * a line. The Drawing is translated and stretched/shrunk to show the full
 * curve and maximize its width and height within the cube.
 *
 * @function
 * @param num determines the number of points, lower than 65535, to be sampled.
 * Including 0 and 1, there are `num + 1` evenly spaced sample points
 * @returns function of type Curve → Drawing
 * @example
 * ```
 * draw_3D_connected_full_view(100)(t => make_3D_point(t, t, t));
 * ```
 */
export const draw_3D_connected_full_view = RenderFunctionCreators.draw_3D_connected_full_view;

/**
 * Returns a function that turns a given 3D Curve into a Drawing, by sampling
 * the 3D Curve at `num` sample points and connecting each pair with
 * a line. The Drawing is translated and scaled proportionally with its size
 * maximized to fit entirely inside the cube.
 *
 * @function
 * @param num determines the number of points, lower than 65535, to be sampled.
 * Including 0 and 1, there are `num + 1` evenly spaced sample points
 * @returns function of type Curve → Drawing
 * @example
 * ```
 * draw_3D_connected_full_view_proportional(100)(t => make_3D_point(t, t, t));
 * ```
 */
export const draw_3D_connected_full_view_proportional = RenderFunctionCreators.draw_3D_connected_full_view_proportional;

/**
 * Returns a function that turns a given 3D Curve into a Drawing, by sampling
 * the 3D Curve at `num` sample points. The Drawing consists of
 * isolated points, and does not connect them. The parts between (0,0,0)
 * and (1,1,1) of the resulting Drawing are shown within the unit cube.
 *
 * @function
 * @param num determines the number of points, lower than 65535, to be sampled.
 * Including 0 and 1, there are `num + 1` evenly spaced sample points
 * @returns function of type Curve → Drawing
 * @example
 * ```
 * draw_3D_points(100)(t => make_3D_point(t, t, t));
 * ```
 */
export const draw_3D_points = RenderFunctionCreators.draw_3D_points;

/**
 * Returns a function that turns a given 3D Curve into a Drawing, by sampling
 * the 3D Curve at `num` sample points. The Drawing consists of
 * isolated points, and does not connect them. The Drawing is translated and
 * stretched/shrunk to maximize its size to fit entirely inside the cube.
 *
 * @function
 * @param num determines the number of points, lower than 65535, to be sampled.
 * Including 0 and 1, there are `num + 1` evenly spaced sample points
 * @returns function of type Curve → Drawing
 * @example
 * ```
 * draw_3D_points_full_view(100)(t => make_3D_point(t, t, t));
 * ```
 */
export const draw_3D_points_full_view = RenderFunctionCreators.draw_3D_points_full_view;

/**
 * Returns a function that turns a given 3D Curve into a Drawing, by sampling
 * the 3D Curve at `num` sample points. The Drawing consists of
 * isolated points, and does not connect them. The Drawing is translated and
 * scaled proportionally with its size maximized to fit entirely inside the cube.
 *
 * @function
 * @param num determines the number of points, lower than 65535, to be sampled.
 * Including 0 and 1, there are `num + 1` evenly spaced sample points
 * @returns function of type Curve → Drawing
 * @example
 * ```
 * draw_3D_points_full_view_proportional(100)(t => make_3D_point(t, t, t));
 * ```
 */
export const draw_3D_points_full_view_proportional = RenderFunctionCreators.draw_3D_points_full_view_proportional;

class CurveAnimators {
  @functionDeclaration('duration: number, fps: number, drawer: (func: Curve) => Curve, func: (func: Curve) => Curve', 'AnimatedCurve')
  static animate_curve(
    duration: number,
    fps: number,
    drawer: RenderFunction,
    func: CurveAnimation
  ): AnimatedCurve {
    if (drawer.is3D) {
      throw new Error(`${animate_curve.name} cannot be used with 3D draw function!`);
    }

    const anim = new AnimatedCurve(duration, fps, func, drawer, false);
    drawnCurves.push(anim);
    return anim;
  }

  @functionDeclaration('duration: number, fps: number, drawer: (func: Curve) => Curve, func: (func: Curve) => Curve', 'AnimatedCurve')
  static animate_3D_curve(
    duration: number,
    fps: number,
    drawer: RenderFunction,
    func: CurveAnimation
  ): AnimatedCurve {
    if (!drawer.is3D) {
      throw new Error(`${animate_3D_curve.name} cannot be used with 2D draw function!`);
    }

    const anim = new AnimatedCurve(duration, fps, func, drawer, true);
    drawnCurves.push(anim);
    return anim;
  }
}

/**
 * Create a animation of curves using a curve generating function.
 * @param duration The duration of the animation in seconds
 * @param fps Framerate of the animation in frames per second
 * @param drawer Draw function to the generated curves with
 * @param func Curve generating function. Takes in a timestamp value and returns a curve
 * @returns Curve Animation
 */
export const animate_curve = CurveAnimators.animate_curve;

/**
 * Create a animation of curves using a curve generating function.
 * @param duration The duration of the animation in seconds
 * @param fps Framerate of the animation in frames per second
 * @param drawer Draw function to the generated curves with
 * @param func Curve generating function. Takes in a timestamp value and returns a curve
 * @returns 3D Curve Animation
 */
export const animate_3D_curve = CurveAnimators.animate_3D_curve;
