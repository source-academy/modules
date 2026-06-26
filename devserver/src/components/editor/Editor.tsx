import { Card } from '@blueprintjs/core';
import MonacoReactEditor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { SOURCE_MONACO_THEME } from './setupMonaco';

interface EditorProps {
  editorValue: string;
  handleEditorValueChange: (newValue: string) => void;
  handlePromptAutocomplete: (
    row: number,
    col: number,
  ) => Promise<monaco.languages.CompletionList>;
}

// List of command IDs to retain within the
// context menu
const commandsIdsToKeep = [
  'editor.action.goToReferences',
  'editor.action.clipboardCopyAction',
  'editor.action.clipboardCutAction',
  'editor.action.clipboardPasteAction',
  'editor.action.rename',
  'editor.action.revealDefinition',
  'vs.actions.separator'
];

export default function Editor(props: EditorProps) {
  return (
    <div className="editor-container">
      <Card className="Editor">
        <div className="row editor-react-ace" data-testid="Editor">
          <MonacoReactEditor
            className="react-ace"
            height="100%"
            width="100%"
            path='file:///source.js'
            value={props.editorValue}
            onChange={value => {
              props.handleEditorValueChange(value ?? '');
            }}
            language='javascript'
            options={{
              fontFamily: "'Inconsolata', 'Consolas', monospace",
              fontSize: 17,
              folding: false,
              glyphMargin: false,
              // hover: { enabled: false },
              lineHeight: 17,
              lineNumbersMinChars: 4,
              minimap: { enabled: false },
              renderLineHighlight: 'none',
              scrollBeyondLastLine: false,
              suggest: {
                showKeywords: false,
                showModules: false
              },
              wordBasedSuggestions: 'off',
            }}
            theme={SOURCE_MONACO_THEME}
            beforeMount={(m: typeof monaco) => {
              m.typescript.javascriptDefaults.setEagerModelSync(true);
              m.typescript.javascriptDefaults.setCompilerOptions({
                allowJs: true,
                module: monaco.typescript.ModuleKind.ESNext,
                noLib: true,
                target: monaco.typescript.ScriptTarget.ES2020,
              });

              m.typescript.javascriptDefaults.addExtraLib(
                `
                declare interface AnimFrame {
                    draw: () => void;
                }

                declare class glAnimation {
                    getFrame: (t: number) => AnimFrame;
                }

                declare interface ReplResult {
                    toReplString: () => string;
                }

                declare module 'curve' {
                  /**
                   * Create a animation of curves using a curve generating function.
                   * @param duration The duration of the animation in seconds
                   * @param fps Framerate of the animation in frames per second
                   * @param drawer Draw function to the generated curves with
                   * @param func Curve generating function. Takes in a timestamp value and returns a curve
                   * @returns 3D Curve Animation
                   * @function
                   */
                  export declare const animate_3D_curve: typeof CurveAnimators.animate_3D_curve;

                  /**
                   * Create a animation of curves using a curve generating function.
                   * @param duration The duration of the animation in seconds
                   * @param fps Framerate of the animation in frames per second
                   * @param drawer Draw function to the generated curves with
                   * @param func Curve generating function. Takes in a timestamp value and returns a curve
                   * @returns Curve Animation
                   * @function
                   */
                  export declare const animate_curve: typeof CurveAnimators.animate_curve;

                  declare class AnimatedCurve extends glAnimation implements ReplResult {
                      private readonly func;
                      private readonly drawer;
                      readonly is3D: boolean;
                      constructor(duration: number, fps: number, func: (timestamp: number) => Curve, drawer: RenderFunction, is3D: boolean);
                      getFrame(timestamp: number): AnimFrame;
                      /**
                       * Viewport angle in radians
                       */
                      angle: number;
                      toReplString: () => string;
                  }

                  /**
                   * This function is a curve: a function from a fraction t to a point. The points
                   * lie on the right half of the unit circle. They start at Point (0,1) when t is
                   * 0. When t is 0.5, they reach Point (1,0), when t is 1, they reach Point
                   * (0, -1).
                   *
                   * @param t fraction between 0 and 1
                   * @returns Point in the arc at t
                   */
                  export declare const arc: Curve;

                  /**
                   * Retrieves the blue component of a given Point.
                   *
                   * @param pt given point
                   * @returns Blue component of the Point as a value between [0,255]
                   * @function
                   * @example
                   * \`\`\`
                   * const point = make_color_point(1, 2, 3, 50, 100, 150);
                   * b_of(point); // Returns 150
                   * \`\`\`
                   */
                  export declare const b_of: typeof CurveFunctions.b_of;

                  declare type Color = [r: number, g: number, b: number, t: number];

                  /**
                   * This function is a binary Curve operator: It takes two Curves as arguments
                   * and returns a new Curve. The two Curves are combined by using the full first
                   * Curve for the first portion of the result and by using the full second Curve
                   * for the second portion of the result. The second Curve is translated such
                   * that its point at fraction 0 is the same as the Point of the first Curve at
                   * fraction 1.
                   *
                   * @param curve1 first Curve
                   * @param curve2 second Curve
                   * @returns result Curve
                   * @function
                   */
                  export declare const connect_ends: typeof CurveFunctions.connect_ends;

                  /**
                   * This function is a binary Curve operator: It takes two Curves as arguments
                   * and returns a new Curve. The two Curves are combined by using the full first
                   * Curve for the first portion of the result and by using the full second Curve
                   * for the second portion of the result. The second Curve is not changed, and
                   * therefore there might be a big jump in the middle of the result Curve.
                   *
                   * @param curve1 first Curve
                   * @param curve2 second Curve
                   * @returns result Curve
                   * @function
                   */
                  export declare const connect_rigidly: typeof CurveFunctions.connect_rigidly;

                  /** A function that takes in number from 0 to 1 and returns a Point. */
                  declare type Curve = ((u: number) => Point) & {
                      shouldNotAppend?: boolean;
                  };

                  /**
                   * A function that takes in a timestamp and returns a Curve
                   */
                  declare type CurveAnimation = (t: number) => Curve;

                  declare class CurveAnimators {
                      static animate_curve(duration: number, fps: number, drawer: RenderFunction, func: CurveAnimation): AnimatedCurve;
                      static animate_3D_curve(duration: number, fps: number, drawer: RenderFunction, func: CurveAnimation): AnimatedCurve;
                  }

                  /**
                   * Represents a Curve that has been generated from the \`generateCurve\`
                   * function.
                   */
                  declare class CurveDrawn implements ReplResult {
                      private readonly drawMode;
                      readonly numPoints: number;
                      private readonly space;
                      private readonly drawCubeArray;
                      private readonly curvePosArray;
                      private readonly curveColorArray;
                      private renderingContext;
                      private programs;
                      private buffersInfo;
                      constructor(drawMode: DrawMode, numPoints: number, space: CurveSpace, drawCubeArray: number[], curvePosArray: number[], curveColorArray: number[]);
                      toReplString: () => string;
                      get is3D(): boolean;
                      init: (canvas: HTMLCanvasElement) => void;
                      redraw: (angle: number) => void;
                  }

                  declare class CurveFunctions {
                      static make_point(x: number, y: number): Point;
                      static make_3D_point(x: number, y: number, z: number): Point;
                      static make_color_point(x: number, y: number, r: number, g: number, b: number): Point;
                      static make_3D_color_point(x: number, y: number, z: number, r: number, g: number, b: number): Point;
                      static connect_ends(curve1: Curve, curve2: Curve): Curve;
                      static connect_rigidly(curve1: Curve, curve2: Curve): Curve;
                      static translate(x0: number, y0: number, z0: number): CurveTransformer;
                      static rainbow(repeats: number, phase: number): CurveTransformer;
                      static invert: CurveTransformer;
                      static put_in_standard_position: CurveTransformer;
                      static rotate_around_origin_3D(a: number, b: number, c: number): CurveTransformer;
                      static rotate_around_origin(a: number): CurveTransformer;
                      static scale(x: number, y: number, z: number): CurveTransformer;
                      static scale_proportional(s: number): CurveTransformer;
                      static x_of(pt: Point): number;
                      static y_of(pt: Point): number;
                      static z_of(pt: Point): number;
                      static r_of(pt: Point): number;
                      static g_of(pt: Point): number;
                      static b_of(pt: Point): number;
                      static unit_circle: Curve;
                      static unit_line: Curve;
                      static unit_line_at(y: number): Curve;
                      static arc: Curve;
                  }

                  declare type CurveSpace = '2D' | '3D';

                  /** A function that takes in CurveFunction and returns a tranformed CurveFunction. */
                  declare interface CurveTransformer extends ReplResult {
                      (c: Curve): Curve;
                  }

                  /**
                   * Returns a function that turns a given 3D Curve into a Drawing, by sampling
                   * the 3D Curve at \`num\` sample points and connecting each pair with
                   * a line. The parts between (0,0,0) and (1,1,1) of the resulting Drawing are
                   * shown within the unit cube.
                   *
                   * @function
                   * @param num determines the number of points, lower than 65535, to be sampled.
                   * Including 0 and 1, there are \`num + 1\` evenly spaced sample points
                   * @returns function of type Curve → Drawing
                   * @example
                   * \`\`\`
                   * draw_3D_connected(100)(t => make_3D_point(t, t, t));
                   * \`\`\`
                   */
                  export declare const draw_3D_connected: RenderFunctionCreator;

                  /**
                   * Returns a function that turns a given 3D Curve into a Drawing, by sampling
                   * the 3D Curve at \`num\` sample points and connecting each pair with
                   * a line. The Drawing is translated and stretched/shrunk to show the full
                   * curve and maximize its width and height within the cube.
                   *
                   * @function
                   * @param num determines the number of points, lower than 65535, to be sampled.
                   * Including 0 and 1, there are \`num + 1\` evenly spaced sample points
                   * @returns function of type Curve → Drawing
                   * @example
                   * \`\`\`
                   * draw_3D_connected_full_view(100)(t => make_3D_point(t, t, t));
                   * \`\`\`
                   */
                  export declare const draw_3D_connected_full_view: RenderFunctionCreator;

                  /**
                   * Returns a function that turns a given 3D Curve into a Drawing, by sampling
                   * the 3D Curve at \`num + 1\` sample points and connecting each pair with
                   * a line. The Drawing is translated and scaled proportionally with its size
                   * maximized to fit entirely inside the cube.
                   *
                   * @function
                   * @param num determines the number of points, lower than 65535, to be sampled.
                   * Including 0 and 1, there are \`num + 1\` evenly spaced sample points
                   * @returns function of type Curve → Drawing
                   * @example
                   * \`\`\`
                   * draw_3D_connected_full_view_proportional(100)(t => make_3D_point(t, t, t));
                   * \`\`\`
                   */
                  export declare const draw_3D_connected_full_view_proportional: RenderFunctionCreator;

                  /**
                   * Returns a function that turns a given 3D Curve into a Drawing, by sampling
                   * the 3D Curve at \`num + 1\` sample points. The Drawing consists of
                   * isolated points, and does not connect them. The parts between (0,0,0)
                   * and (1,1,1) of the resulting Drawing are shown within the unit cube.
                   *
                   * @function
                   * @param num determines the number of points, lower than 65535, to be sampled.
                   * Including 0 and 1, there are \`num + 1\` evenly spaced sample points
                   * @returns function of type Curve → Drawing
                   * @example
                   * \`\`\`
                   * draw_3D_points(100)(t => make_3D_point(t, t, t));
                   * \`\`\`
                   */
                  export declare const draw_3D_points: RenderFunctionCreator;

                  /**
                   * Returns a function that turns a given 3D Curve into a Drawing, by sampling
                   * the 3D Curve at \`num + 1\` sample points. The Drawing consists of
                   * isolated points, and does not connect them. The Drawing is translated and
                   * stretched/shrunk to maximize its size to fit entirely inside the cube.
                   *
                   * @function
                   * @param num determines the number of points, lower than 65535, to be sampled.
                   * Including 0 and 1, there are \`num + 1\` evenly spaced sample points
                   * @returns function of type Curve → Drawing
                   * @example
                   * \`\`\`
                   * draw_3D_points_full_view(100)(t => make_3D_point(t, t, t));
                   * \`\`\`
                   */
                  export declare const draw_3D_points_full_view: RenderFunctionCreator;

                  /**
                   * Returns a function that turns a given 3D Curve into a Drawing, by sampling
                   * the 3D Curve at \`num + 1\` sample points. The Drawing consists of
                   * isolated points, and does not connect them. The Drawing is translated and
                   * scaled proportionally with its size maximized to fit entirely inside the cube.
                   *
                   * @function
                   * @param num determines the number of points, lower than 65535, to be sampled.
                   * Including 0 and 1, there are \`num + 1\` evenly spaced sample points
                   * @returns function of type Curve → Drawing
                   * @example
                   * \`\`\`
                   * draw_3D_points_full_view_proportional(100)(t => make_3D_point(t, t, t));
                   * \`\`\`
                   */
                  export declare const draw_3D_points_full_view_proportional: RenderFunctionCreator;

                  /**
                   * Returns a function that turns a given Curve into a Drawing, by sampling the
                   * Curve at \`num + 1\` sample points and connecting each pair with a line.
                   * The parts between (0,0) and (1,1) of the resulting Drawing are shown in the window.
                   *
                   * @function
                   * @param num determines the number of points, lower than 65535, to be sampled.
                   * Including 0 and 1, there are \`num + 1\` evenly spaced sample points
                   * @returns function of type Curve → Drawing
                   * @example
                   * \`\`\`
                   * draw_connected(100)(t => make_point(t, t));
                   * \`\`\`
                   */
                  export declare const draw_connected: RenderFunctionCreator;

                  /**
                   * Returns a function that turns a given Curve into a Drawing, by sampling the
                   * Curve at \`num + 1\` sample points and connecting each pair with a line. The Drawing is
                   * translated and stretched/shrunk to show the full curve and maximize its width
                   * and height, with some padding.
                   *
                   * @function
                   * @param num determines the number of points, lower than 65535, to be sampled.
                   * Including 0 and 1, there are \`num + 1\` evenly spaced sample points
                   * @returns function of type Curve → Drawing
                   * @example
                   * \`\`\`
                   * draw_connected_full_view(100)(t => make_point(t, t));
                   * \`\`\`
                   */
                  export declare const draw_connected_full_view: RenderFunctionCreator;

                  /**
                   * Returns a function that turns a given Curve into a Drawing, by sampling the
                   * Curve at \`num + 1\` sample points and connecting each pair with a line. The Drawing
                   * is translated and scaled proportionally to show the full curve and maximize
                   * its size, with some padding.
                   *
                   * @function
                   * @param num determines the number of points, lower than 65535, to be sampled.
                   * Including 0 and 1, there are \`num + 1\` evenly spaced sample points
                   * @returns function of type Curve → Drawing
                   * @example
                   * \`\`\`
                   * draw_connected_full_view_proportional(100)(t => make_point(t, t));
                   * \`\`\`
                   */
                  export declare const draw_connected_full_view_proportional: RenderFunctionCreator;

                  /**
                   * Returns a function that turns a given Curve into a Drawing, by sampling the
                   * Curve at \`num + 1\` sample points. The Drawing consists of isolated
                   * points, and does not connect them. The parts between (0,0) and (1,1) of the
                   * resulting Drawing are shown in the window.
                   *
                   * @function
                   * @param num determines the number of points, lower than 65535, to be sampled.
                   * Including 0 and 1,there are \`num + 1\` evenly spaced sample points
                   * @returns function of type Curve → Drawing
                   * @example
                   * \`\`\`
                   * draw_points(100)(t => make_point(t, t));
                   * \`\`\`
                   */
                  export declare const draw_points: RenderFunctionCreator;

                  /**
                   * Returns a function that turns a given Curve into a Drawing, by sampling the
                   * Curve at \`num + 1\` sample points. The Drawing consists of isolated
                   * points, and does not connect them. The Drawing is translated and
                   * stretched/shrunk to show the full curve and maximize its width and height,
                   * with some padding.
                   *
                   * @function
                   * @param num determines the number of points, lower than 65535, to be sampled.
                   * Including 0 and 1, there are \`num + 1\` evenly spaced sample points
                   * @returns function of type Curve → Drawing
                   * @example
                   * \`\`\`
                   * draw_points_full_view(100)(t => make_point(t, t));
                   * \`\`\`
                   */
                  export declare const draw_points_full_view: RenderFunctionCreator;

                  /**
                   * Returns a function that turns a given Curve into a Drawing, by sampling the
                   * Curve at \`num + 1\` sample points. The Drawing consists of isolated
                   * points, and does not connect them. The Drawing is translated and scaled
                   * proportionally with its size maximized to fit entirely inside the window,
                   * with some padding.
                   *
                   * @function
                   * @param num determines the number of points, lower than 65535, to be sampled.
                   * Including 0 and 1, there are \`num + 1\` evenly spaced sample points
                   * @returns function of type Curve → Drawing
                   * @example
                   * \`\`\`
                   * draw_points_full_view_proportional(100)(t => make_point(t, t));
                   * \`\`\`
                   */
                  export declare const draw_points_full_view_proportional: RenderFunctionCreator;

                  declare type DrawMode = 'lines' | 'points';

                  /**
                   * Retrieves the green component of a given Point.
                   *
                   * @param pt given point
                   * @returns Green component of the Point as a value between [0,255]
                   * @function
                   * @example
                   * \`\`\`
                   * const point = make_color_point(1, 2, 3, 50, 100, 150);
                   * g_of(point); // Returns 100
                   * \`\`\`
                   */
                  export declare const g_of: typeof CurveFunctions.g_of;

                  /**
                   * This function is a Curve transformation: a function from a Curve to a Curve.
                   * The points of the result Curve are the same points as the points of the
                   * original Curve, but in reverse: The result Curve applied to 0 is the original
                   * Curve applied to 1 and vice versa.
                   *
                   * @param original original Curve
                   * @returns result Curve
                   */
                  export declare const invert: CurveTransformer;

                  /**
                   * Makes a 3D color Point with given x, y and z coordinates, and RGB values
                   * ranging from 0 to 255. Any input lower than 0 for RGB will be rounded up to
                   * 0, and any input higher than 255 will be rounded down to 255.
                   *
                   * @param x x-coordinate of new point
                   * @param y y-coordinate of new point
                   * @param z z-coordinate of new point
                   * @param r red component of new point
                   * @param g green component of new point
                   * @param b blue component of new point
                   * @function
                   * @returns with x, y and z as coordinates, and r, g and b as RGB values
                   * @example
                   * \`\`\`
                   * const redPoint = make_color_point(0.5, 0.5, 0.5, 255, 0, 0);
                   * \`\`\`
                   */
                  export declare const make_3D_color_point: typeof CurveFunctions.make_3D_color_point;

                  /**
                   * Makes a 3D Point with given x, y and z coordinates.
                   *
                   * @param x x-coordinate of new point
                   * @param y y-coordinate of new point
                   * @param z z-coordinate of new point
                   * @function
                   * @returns with x, y and z as coordinates
                   * @example
                   * \`\`\`
                   * const point = make_3D_point(0.5, 0.5, 0.5);
                   * \`\`\`
                   */
                  export declare const make_3D_point: typeof CurveFunctions.make_3D_point;

                  /**
                   * Makes a color Point with given x and y coordinates, and RGB values ranging
                   * from 0 to 255. Any input lower than 0 for RGB will be rounded up to 0, and
                   * any input higher than 255 will be rounded down to 255.
                   *
                   * @param x x-coordinate of new point
                   * @param y y-coordinate of new point
                   * @param r red component of new point
                   * @param g green component of new point
                   * @param b blue component of new point
                   * @function
                   * @returns with x and y as coordinates, and r, g and b as RGB values
                   * @example
                   * \`\`\`
                   * const redPoint = make_color_point(0.5, 0.5, 255, 0, 0);
                   * \`\`\`
                   */
                  export declare const make_color_point: typeof CurveFunctions.make_color_point;

                  /**
                   * Makes a Point with given x and y coordinates.
                   *
                   * @param x x-coordinate of new point
                   * @param y y-coordinate of new point
                   * @returns with x and y as coordinates
                   * @function
                   * @example
                   * \`\`\`
                   * const point = make_point(0.5, 0.5);
                   * \`\`\`
                   */
                  export declare const make_point: typeof CurveFunctions.make_point;

                  /** Encapsulates 3D point with RGB values. */
                  declare class Point implements ReplResult {
                      readonly x: number;
                      readonly y: number;
                      readonly z: number;
                      readonly color: Color;
                      constructor(x: number, y: number, z: number, color: Color);
                      toReplString: () => string;
                  }

                  /**
                   * This function is a Curve transformation: It takes a Curve as argument and
                   * returns a new Curve, as follows. A Curve is in standard position if it
                   * starts at (0,0) ends at (1,0). This function puts the given Curve in
                   * standard position by rigidly translating it so its start Point is at the
                   * origin (0,0), then rotating it about the origin to put its endpoint on the
                   * x axis, then scaling it to put the endpoint at (1,0). Behavior is unspecified
                   * on closed Curves where start-point equal end-point.
                   *
                   * @param curve given Curve
                   * @returns result Curve
                   */
                  export declare const put_in_standard_position: CurveTransformer;

                  /**
                   * Retrieves the red component of a given Point.
                   *
                   * @param pt given point
                   * @returns Red component of the Point as a value between [0,255]
                   * @example
                   * \`\`\`
                   * const point = make_color_point(1, 2, 3, 50, 100, 150);
                   * r_of(point); // Returns 50
                   * \`\`\`
                   */
                  export declare const r_of: typeof CurveFunctions.r_of;

                  /**
                   * Returns a Curve transformation that recolours a curve with a repeating
                   * rainbow. The \`repeats\` parameter controls how many full hue cycles occur
                   * as \`t\` goes from 0 to 1. The \`phase\` shifts the starting hue.
                   *
                   * @param repeats number of rainbow cycles across the curve parameter interval
                   * @param phase hue offset, where 0 starts at red
                   * @returns Curve transformation
                   */
                  export declare const rainbow: typeof CurveFunctions.rainbow;

                  /**
                   * A function that specifies additional rendering information when taking in
                   * a {@link Curve|Curve} and returns a ShapeDrawn based on its specifications.
                   */
                  declare interface RenderFunction extends ReplResult {
                      (func: Curve): CurveDrawn;
                      is3D: boolean;
                  }

                  /**
                   * A function that returns a {@link RenderFunction|RenderFunction} that is bound to
                   * the specified number of points
                   */
                  declare interface RenderFunctionCreator {
                      (numPoints: number): RenderFunction;
                      scaleMode: ScaleMode;
                      drawMode: DrawMode;
                      space: CurveSpace;
                      isFullView: boolean;
                  }

                  /**
                   * This function an angle a in radians as parameter
                   * and returns a Curve transformation: a function that takes a Curve as argument
                   * and returns a new Curve, which is the original Curve rotated
                   * extrinsically with Euler angle a about the z axis.
                   *
                   * @param a given angle
                   * @returns function that takes a Curve and returns a Curve
                   * @function
                   */
                  export declare const rotate_around_origin: typeof CurveFunctions.rotate_around_origin;

                  /**
                   * This function takes 3 angles, a, b and c in radians as parameter
                   * and returns a Curve transformation: a function that takes a 3D Curve as argument
                   * and returns a new 3D Curve, which is the original Curve rotated
                   * extrinsically with Euler angles (a, b, c) about x, y,
                   * and z axes.
                   * @param a given angle
                   * @param b given angle
                   * @param c given angle
                   * @returns function that takes a Curve and returns a Curve
                   * @function
                   */
                  export declare const rotate_around_origin_3D: typeof CurveFunctions.rotate_around_origin_3D;

                  /**
                   * This function takes scaling factors \`a\`, \`b\` and
                   * \`c\`, as arguments and returns a
                   * Curve transformation that scales a given Curve by \`a\` in
                   * x-direction, \`b\` in y-direction and \`c\` in z-direction.
                   *
                   * @param x scaling factor in x-direction
                   * @param y scaling factor in y-direction
                   * @param z scaling factor in z-direction
                   * @returns function that takes a Curve and returns a Curve
                   * @function
                   */
                  export declare const scale: typeof CurveFunctions.scale;

                  /**
                   * This function takes a scaling factor s argument and returns a Curve
                   * transformation that scales a given Curve by s in x, y and z direction.
                   *
                   * @param s scaling factor
                   * @returns function that takes a Curve and returns a Curve
                   * @function
                   */
                  export declare const scale_proportional: typeof CurveFunctions.scale_proportional;

                  declare type ScaleMode = 'fit' | 'none' | 'stretch';

                  /**
                   * This function returns a Curve transformation: It takes an x-value x0, a
                   * y-value y0 and a z-value z0, as arguments and
                   * returns a Curve transformation that takes a Curve as argument and returns a
                   * new Curve, by translating the original by x0 in x-direction, y0 in
                   * y-direction and z0 in z-direction.
                   *
                   * @param x0 x-value
                   * @param y0 y-value
                   * @param z0 z-value
                   * @returns Curve transformation
                   */
                  export declare const translate: typeof CurveFunctions.translate;

                  /** @hidden */
                  export declare const type_map: Record<string, string>;

                  /**
                   * This function is a curve: a function from a fraction t to a point. The points
                   * lie on the unit circle. They start at Point (1,0) when t is 0. When t is
                   * 0.25, they reach Point (0,1), when t is 0.5, they reach Point (-1, 0), etc.
                   *
                   * @param t fraction between 0 and 1
                   * @returns Point on the circle at t
                   */
                  export declare const unit_circle: Curve;

                  /**
                   * This function is a curve: a function from a fraction t to a point. The
                   * x-coordinate at fraction t is t, and the y-coordinate is 0.
                   *
                   * @param t fraction between 0 and 1
                   * @returns Point on the line at t
                   */
                  export declare const unit_line: Curve;

                  /**
                   * This function is a Curve generator: it takes a number and returns a
                   * horizontal curve. The number is a y-coordinate, and the Curve generates only
                   * points with the given y-coordinate.
                   *
                   * @param y fraction between 0 and 1
                   * @returns horizontal Curve
                   * @function
                   */
                  export declare const unit_line_at: typeof CurveFunctions.unit_line_at;

                  /**
                   * Retrieves the x-coordinate of a given Point.
                   *
                   * @param pt given point
                   * @returns x-coordinate of the Point
                   * @function
                   * @example
                   * \`\`\`
                   * const point = make_color_point(1, 2, 3, 50, 100, 150);
                   * x_of(point); // Returns 1
                   * \`\`\`
                   */
                  export declare const x_of: typeof CurveFunctions.x_of;

                  /**
                   * Retrieves the y-coordinate of a given Point.
                   *
                   * @param pt given point
                   * @returns y-coordinate of the Point
                   * @example
                   * \`\`\`
                   * const point = make_color_point(1, 2, 3, 50, 100, 150);
                   * y_of(point); // Returns 2
                   * \`\`\`
                   */
                  export declare const y_of: typeof CurveFunctions.y_of;

                  /**
                   * Retrieves the z-coordinate of a given Point.
                   *
                   * @param pt given point
                   * @returns z-coordinate of the Point
                   * @function
                   * @example
                   * \`\`\`
                   * const point = make_color_point(1, 2, 3, 50, 100, 150);
                   * z_of(point); // Returns 3
                   * \`\`\`
                   */
                  export declare const z_of: typeof CurveFunctions.z_of;
                }
                `,
                'ts:node_modules/curve/index.d.ts'
              );

              // m.languages.registerCompletionItemProvider('javascript', {
              //   async provideCompletionItems(_model, position) {
              //     const items = await props.handlePromptAutocomplete(position.lineNumber, position.column);
              //     console.log(items);
              //     return items;
              //   },
              // });
            }}
            onMount={editor => {
              // Remove unnecessary context menu options
              // Solution taken from here: https://github.com/microsoft/monaco-editor/issues/1280
              const contextmenu: any = editor.getContribution('editor.contrib.contextmenu');
              const originalMethod = contextmenu._getMenuActions;
              contextmenu._getMenuActions = (...args: any[]) => {
                const items = originalMethod.apply(contextmenu, args);
                // console.log(items);
                return items.filter(({ id }: any) => commandsIdsToKeep.includes(id));
              };

              // Remove the command palette keyboard shortcut
              editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP, () => { });
            }}
          />
        </div>
      </Card>
    </div>
  );
}
