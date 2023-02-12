/**
 * The module `rune` provides functions for drawing runes.
 *
 * A *Rune* is defined by its vertices (x,y,z,t), the colors on its vertices (r,g,b,a), a transformation matrix for rendering the Rune and a (could be empty) list of its sub-Runes.
 * @module rune
 */
import { context } from 'js-slang/moduleHelpers';
import { mat4, vec3 } from 'gl-matrix';
import {
  Rune,
  NormalRune,
  type RuneAnimation,
  DrawnRune,
  drawRunesToFrameBuffer,
  AnimatedRune,
} from './rune';
import {
  getSquare,
  getBlank,
  getRcross,
  getSail,
  getTriangle,
  getCorner,
  getNova,
  getCircle,
  getHeart,
  getPentagram,
  getRibbon,
  throwIfNotRune,
  addColorFromHex,
  colorPalette,
  hexToColor,
} from './runes_ops';
import {
  type FrameBufferWithTexture,
  getWebGlFromCanvas,
  initFramebufferObject,
  initShaderProgram,
} from './runes_webgl';

const drawnRunes: (DrawnRune | AnimatedRune)[] = [];
context.moduleContexts.rune.state = {
  drawnRunes,
};

// =============================================================================
// Basic Runes
// =============================================================================

/**
 * Rune with the shape of a full square
 *
 * @category Primitive
 */
export const square: Rune = getSquare();
/**
 * Rune with the shape of a blank square
 *
 * @category Primitive
 */
export const blank: Rune = getBlank();
/**
 * Rune with the shape of a
 * small square inside a large square,
 * each diagonally split into a
 * black and white half
 *
 * @category Primitive
 */
export const rcross: Rune = getRcross();
/**
 * Rune with the shape of a sail
 *
 * @category Primitive
 */
export const sail: Rune = getSail();
/**
 * Rune with the shape of a triangle
 *
 * @category Primitive
 */
export const triangle: Rune = getTriangle();
/**
 * Rune with black triangle,
 * filling upper right corner
 *
 * @category Primitive
 */
export const corner: Rune = getCorner();
/**
 * Rune with the shape of two overlapping
 * triangles, residing in the upper half
 * of the shape
 *
 * @category Primitive
 */
export const nova: Rune = getNova();
/**
 * Rune with the shape of a circle
 *
 * @category Primitive
 */
export const circle: Rune = getCircle();
/**
 * Rune with the shape of a heart
 *
 * @category Primitive
 */
export const heart: Rune = getHeart();
/**
 * Rune with the shape of a pentagram
 *
 * @category Primitive
 */
export const pentagram: Rune = getPentagram();
/**
 * Rune with the shape of a ribbon
 * winding outwards in an anticlockwise spiral
 *
 * @category Primitive
 */
export const ribbon: Rune = getRibbon();

// =============================================================================
// Textured Runes
// =============================================================================
/**
 * Create a rune using the image provided in the url
 * @param {string} imageUrl URL to the image that is used to create the rune.
 * Note that the url must be from a domain that allows CORS.
 * @returns {Rune} Rune created using the image.
 *
 * @category Main
 */
export function from_url(imageUrl: string): Rune {
  const rune = getSquare();
  rune.texture = new Image();
  rune.texture.crossOrigin = 'anonymous';
  rune.texture.src = imageUrl;
  return rune;
}

// =============================================================================
// XY-axis Transformation functions
// =============================================================================

/**
 * Scales a given Rune by separate factors in x and y direction
 * @param {number} ratio_x - Scaling factor in x direction
 * @param {number} ratio_y - Scaling factor in y direction
 * @param {Rune} rune - Given Rune
 * @return {Rune} Resulting scaled Rune
 *
 * @category Main
 */
export function scale_independent(
  ratio_x: number,
  ratio_y: number,
  rune: Rune,
): Rune {
  throwIfNotRune('scale_independent', rune);
  const scaleVec = vec3.fromValues(ratio_x, ratio_y, 1);
  const scaleMat = mat4.create();
  mat4.scale(scaleMat, scaleMat, scaleVec);

  const wrapperMat = mat4.create();
  mat4.multiply(wrapperMat, scaleMat, wrapperMat);
  return Rune.of({
    subRunes: [rune],
    transformMatrix: wrapperMat,
  });
}

/**
 * Scales a given Rune by a given factor in both x and y direction
 * @param {number} ratio - Scaling factor
 * @param {Rune} rune - Given Rune
 * @return {Rune} Resulting scaled Rune
 *
 * @category Main
 */
export function scale(ratio: number, rune: Rune): Rune {
  throwIfNotRune('scale', rune);
  return scale_independent(ratio, ratio, rune);
}

/**
 * Translates a given Rune by given values in x and y direction
 * @param {number} x - Translation in x direction
 * @param {number} y - Translation in y direction
 * @param {Rune} rune - Given Rune
 * @return {Rune} Resulting translated Rune
 *
 * @category Main
 */
export function translate(x: number, y: number, rune: Rune): Rune {
  throwIfNotRune('translate', rune);
  const translateVec = vec3.fromValues(x, -y, 0);
  const translateMat = mat4.create();
  mat4.translate(translateMat, translateMat, translateVec);

  const wrapperMat = mat4.create();
  mat4.multiply(wrapperMat, translateMat, wrapperMat);
  return Rune.of({
    subRunes: [rune],
    transformMatrix: wrapperMat,
  });
}

/**
 * Rotates a given Rune by a given angle,
 * given in radians, in anti-clockwise direction.
 * Note that parts of the Rune
 * may be cropped as a result.
 * @param {number} rad - Angle in radians
 * @param {Rune} rune - Given Rune
 * @return {Rune} Rotated Rune
 *
 * @category Main
 */
export function rotate(rad: number, rune: Rune): Rune {
  throwIfNotRune('rotate', rune);
  const rotateMat = mat4.create();
  mat4.rotateZ(rotateMat, rotateMat, rad);

  const wrapperMat = mat4.create();
  mat4.multiply(wrapperMat, rotateMat, wrapperMat);
  return Rune.of({
    subRunes: [rune],
    transformMatrix: wrapperMat,
  });
}

/**
 * Makes a new Rune from two given Runes by
 * placing the first on top of the second
 * such that the first one occupies frac
 * portion of the height of the result and
 * the second the rest
 * @param {number} frac - Fraction between 0 and 1 (inclusive)
 * @param {Rune} rune1 - Given Rune
 * @param {Rune} rune2 - Given Rune
 * @return {Rune} Resulting Rune
 *
 * @category Main
 */
export function stack_frac(frac: number, rune1: Rune, rune2: Rune): Rune {
  throwIfNotRune('stack_frac', rune1);
  throwIfNotRune('stack_frac', rune2);

  if (!(frac >= 0 && frac <= 1)) {
    throw Error('stack_frac can only take fraction in [0,1].');
  }

  const upper = translate(0, -(1 - frac), scale_independent(1, frac, rune1));
  const lower = translate(0, frac, scale_independent(1, 1 - frac, rune2));
  return Rune.of({
    subRunes: [upper, lower],
  });
}

/**
 * Makes a new Rune from two given Runes by
 * placing the first on top of the second, each
 * occupying equal parts of the height of the
 * result
 * @param {Rune} rune1 - Given Rune
 * @param {Rune} rune2 - Given Rune
 * @return {Rune} Resulting Rune
 *
 * @category Main
 */
export function stack(rune1: Rune, rune2: Rune): Rune {
  throwIfNotRune('stack', rune1, rune2);
  return stack_frac(1 / 2, rune1, rune2);
}

/**
 * Makes a new Rune from a given Rune
 * by vertically stacking n copies of it
 * @param {number} n - Positive integer
 * @param {Rune} rune - Given Rune
 * @return {Rune} Resulting Rune
 *
 * @category Main
 */
export function stackn(n: number, rune: Rune): Rune {
  throwIfNotRune('stackn', rune);
  if (n === 1) {
    return rune;
  }
  return stack_frac(1 / n, rune, stackn(n - 1, rune));
}

/**
 * Makes a new Rune from a given Rune
 * by turning it a quarter-turn around the centre in
 * clockwise direction.
 * @param {Rune} rune - Given Rune
 * @return {Rune} Resulting Rune
 *
 * @category Main
 */
export function quarter_turn_right(rune: Rune): Rune {
  throwIfNotRune('quarter_turn_right', rune);
  return rotate(-Math.PI / 2, rune);
}

/**
 * Makes a new Rune from a given Rune
 * by turning it a quarter-turn in
 * anti-clockwise direction.
 * @param {Rune} rune - Given Rune
 * @return {Rune} Resulting Rune
 *
 * @category Main
 */
export function quarter_turn_left(rune: Rune): Rune {
  throwIfNotRune('quarter_turn_left', rune);
  return rotate(Math.PI / 2, rune);
}

/**
 * Makes a new Rune from a given Rune
 * by turning it upside-down
 * @param {Rune} rune - Given Rune
 * @return {Rune} Resulting Rune
 *
 * @category Main
 */
export function turn_upside_down(rune: Rune): Rune {
  throwIfNotRune('turn_upside_down', rune);
  return rotate(Math.PI, rune);
}

/**
 * Makes a new Rune from two given Runes by
 * placing the first on the left of the second
 * such that the first one occupies frac
 * portion of the width of the result and
 * the second the rest
 * @param {number} frac - Fraction between 0 and 1 (inclusive)
 * @param {Rune} rune1 - Given Rune
 * @param {Rune} rune2 - Given Rune
 * @return {Rune} Resulting Rune
 *
 * @category Main
 */
export function beside_frac(frac: number, rune1: Rune, rune2: Rune): Rune {
  throwIfNotRune('beside_frac', rune1, rune2);

  if (!(frac >= 0 && frac <= 1)) {
    throw Error('beside_frac can only take fraction in [0,1].');
  }

  const left = translate(-(1 - frac), 0, scale_independent(frac, 1, rune1));
  const right = translate(frac, 0, scale_independent(1 - frac, 1, rune2));
  return Rune.of({
    subRunes: [left, right],
  });
}

/**
 * Makes a new Rune from two given Runes by
 * placing the first on the left of the second,
 * both occupying equal portions of the width
 * of the result
 * @param {Rune} rune1 - Given Rune
 * @param {Rune} rune2 - Given Rune
 * @return {Rune} Resulting Rune
 *
 * @category Main
 */
export function beside(rune1: Rune, rune2: Rune): Rune {
  throwIfNotRune('beside', rune1, rune2);
  return beside_frac(1 / 2, rune1, rune2);
}

/**
 * Makes a new Rune from a given Rune by
 * flipping it around a horizontal axis,
 * turning it upside down
 * @param {Rune} rune - Given Rune
 * @return {Rune} Resulting Rune
 *
 * @category Main
 */
export function flip_vert(rune: Rune): Rune {
  throwIfNotRune('flip_vert', rune);
  return scale_independent(1, -1, rune);
}

/**
 * Makes a new Rune from a given Rune by
 * flipping it around a vertical axis,
 * creating a mirror image
 * @param {Rune} rune - Given Rune
 * @return {Rune} Resulting Rune
 *
 * @category Main
 */
export function flip_horiz(rune: Rune): Rune {
  throwIfNotRune('flip_horiz', rune);
  return scale_independent(-1, 1, rune);
}

/**
 * Makes a new Rune from a given Rune by
 * arranging into a square for copies of the
 * given Rune in different orientations
 * @param {Rune} rune - Given Rune
 * @return {Rune} Resulting Rune
 *
 * @category Main
 */
export function make_cross(rune: Rune): Rune {
  throwIfNotRune('make_cross', rune);
  return stack(
    beside(quarter_turn_right(rune), rotate(Math.PI, rune)),
    beside(rune, rotate(Math.PI / 2, rune)),
  );
}

/**
 * Applies a given function n times to an initial value
 * @param {number} n - A non-negative integer
 * @param {function} pattern - Unary function from Rune to Rune
 * @param {Rune} initial - The initial Rune
 * @return {Rune} - Result of n times application of pattern to initial:
 * pattern(pattern(...pattern(pattern(initial))...))
 *
 * @category Main
 */
export function repeat_pattern(
  n: number,
  pattern: (a: Rune) => Rune,
  initial: Rune,
): Rune {
  if (n === 0) {
    return initial;
  }
  return pattern(repeat_pattern(n - 1, pattern, initial));
}

// =============================================================================
// Z-axis Transformation functions
// =============================================================================

/**
 * The depth range of the z-axis of a rune is [0,-1], this function gives a [0, -frac] of the depth range to rune1 and the rest to rune2.
 * @param {number} frac - Fraction between 0 and 1 (inclusive)
 * @param {Rune} rune1 - Given Rune
 * @param {Rune} rune2 - Given Rune
 * @return {Rune} Resulting Rune
 *
 * @category Main
 */
export function overlay_frac(frac: number, rune1: Rune, rune2: Rune): Rune {
  // to developer: please read https://www.tutorialspoint.com/webgl/webgl_basics.htm to understand the webgl z-axis interpretation.
  // The key point is that positive z is closer to the screen. Hence, the image at the back should have smaller z value. Primitive runes have z = 0.
  throwIfNotRune('overlay_frac', rune1);
  throwIfNotRune('overlay_frac', rune2);
  if (!(frac >= 0 && frac <= 1)) {
    throw Error('overlay_frac can only take fraction in [0,1].');
  }
  // by definition, when frac == 0 or 1, the back rune will overlap with the front rune.
  // however, this would cause graphical glitch because overlapping is physically impossible
  // we hack this problem by clipping the frac input from [0,1] to [1E-6, 1-1E-6]
  // this should not be graphically noticable
  let useFrac = frac;
  const minFrac = 0.000001;
  const maxFrac = 1 - minFrac;
  if (useFrac < minFrac) {
    useFrac = minFrac;
  }
  if (useFrac > maxFrac) {
    useFrac = maxFrac;
  }

  const frontMat = mat4.create();
  // z: scale by frac
  mat4.scale(frontMat, frontMat, vec3.fromValues(1, 1, useFrac));
  const front = Rune.of({
    subRunes: [rune1],
    transformMatrix: frontMat,
  });

  const backMat = mat4.create();
  // need to apply transformation in backwards order!
  mat4.translate(backMat, backMat, vec3.fromValues(0, 0, -useFrac));
  mat4.scale(backMat, backMat, vec3.fromValues(1, 1, 1 - useFrac));
  const back = Rune.of({
    subRunes: [rune2],
    transformMatrix: backMat,
  });

  return Rune.of({
    subRunes: [front, back], // render front first to avoid redrawing
  });
}

/**
 * The depth range of the z-axis of a rune is [0,-1], this function maps the depth range of rune1 and rune2 to [0,-0.5] and [-0.5,-1] respectively.
 * @param {Rune} rune1 - Given Rune
 * @param {Rune} rune2 - Given Rune
 * @return {Rune} Resulting Runes
 *
 * @category Main
 */
export function overlay(rune1: Rune, rune2: Rune): Rune {
  throwIfNotRune('overlay', rune1);
  throwIfNotRune('overlay', rune2);
  return overlay_frac(0.5, rune1, rune2);
}

// =============================================================================
// Color functions
// =============================================================================

/**
 * Adds color to rune by specifying
 * the red, green, blue (RGB) value, ranging from 0.0 to 1.0.
 * RGB is additive: if all values are 1, the color is white,
 * and if all values are 0, the color is black.
 * @param {Rune} rune - The rune to add color to
 * @param {number} r - Red value [0.0-1.0]
 * @param {number} g - Green value [0.0-1.0]
 * @param {number} b - Blue value [0.0-1.0]
 * @returns {Rune} The colored Rune
 *
 * @category Color
 */
export function color(rune: Rune, r: number, g: number, b: number): Rune {
  throwIfNotRune('color', rune);

  const colorVector = [r, g, b, 1];
  return Rune.of({
    colors: new Float32Array(colorVector),
    subRunes: [rune],
  });
}

/**
 * Gives random color to the given rune.
 * The color is chosen randomly from the following nine
 * colors: red, pink, purple, indigo, blue, green, yellow, orange, brown
 * @param {Rune} rune - The rune to color
 * @returns {Rune} The colored Rune
 *
 * @category Color
 */
export function random_color(rune: Rune): Rune {
  throwIfNotRune('random_color', rune);
  const randomColor = hexToColor(
    colorPalette[Math.floor(Math.random() * colorPalette.length)],
  );

  return Rune.of({
    colors: new Float32Array(randomColor),
    subRunes: [rune],
  });
}

/**
 * Colors the given rune red (#F44336).
 * @param {Rune} rune - The rune to color
 * @returns {Rune} The colored Rune
 *
 * @category Color
 */
export function red(rune: Rune): Rune {
  throwIfNotRune('red', rune);
  return addColorFromHex(rune, '#F44336');
}

/**
 * Colors the given rune pink (#E91E63s).
 * @param {Rune} rune - The rune to color
 * @returns {Rune} The colored Rune
 *
 * @category Color
 */
export function pink(rune: Rune): Rune {
  throwIfNotRune('pink', rune);
  return addColorFromHex(rune, '#E91E63');
}

/**
 * Colors the given rune purple (#AA00FF).
 * @param {Rune} rune - The rune to color
 * @returns {Rune} The colored Rune
 *
 * @category Color
 */
export function purple(rune: Rune): Rune {
  throwIfNotRune('purple', rune);
  return addColorFromHex(rune, '#AA00FF');
}

/**
 * Colors the given rune indigo (#3F51B5).
 * @param {Rune} rune - The rune to color
 * @returns {Rune} The colored Rune
 *
 * @category Color
 */
export function indigo(rune: Rune): Rune {
  throwIfNotRune('indigo', rune);
  return addColorFromHex(rune, '#3F51B5');
}

/**
 * Colors the given rune blue (#2196F3).
 * @param {Rune} rune - The rune to color
 * @returns {Rune} The colored Rune
 *
 * @category Color
 */
export function blue(rune: Rune): Rune {
  throwIfNotRune('blue', rune);
  return addColorFromHex(rune, '#2196F3');
}

/**
 * Colors the given rune green (#4CAF50).
 * @param {Rune} rune - The rune to color
 * @returns {Rune} The colored Rune
 *
 * @category Color
 */
export function green(rune: Rune): Rune {
  throwIfNotRune('green', rune);
  return addColorFromHex(rune, '#4CAF50');
}

/**
 * Colors the given rune yellow (#FFEB3B).
 * @param {Rune} rune - The rune to color
 * @returns {Rune} The colored Rune
 *
 * @category Color
 */
export function yellow(rune: Rune): Rune {
  throwIfNotRune('yellow', rune);
  return addColorFromHex(rune, '#FFEB3B');
}

/**
 * Colors the given rune orange (#FF9800).
 * @param {Rune} rune - The rune to color
 * @returns {Rune} The colored Rune
 *
 * @category Color
 */
export function orange(rune: Rune): Rune {
  throwIfNotRune('orange', rune);
  return addColorFromHex(rune, '#FF9800');
}

/**
 * Colors the given rune brown.
 * @param {Rune} rune - The rune to color
 * @returns {Rune} The colored Rune
 *
 * @category Color
 */
export function brown(rune: Rune): Rune {
  throwIfNotRune('brown', rune);
  return addColorFromHex(rune, '#795548');
}

/**
 * Colors the given rune black (#000000).
 * @param {Rune} rune - The rune to color
 * @returns {Rune} The colored Rune
 *
 * @category Color
 */
export function black(rune: Rune): Rune {
  throwIfNotRune('black', rune);
  return addColorFromHex(rune, '#000000');
}

/**
 * Colors the given rune white (#FFFFFF).
 * @param {Rune} rune - The rune to color
 * @returns {Rune} The colored Rune
 *
 * @category Color
 */
export function white(rune: Rune): Rune {
  throwIfNotRune('white', rune);
  return addColorFromHex(rune, '#FFFFFF');
}

// =============================================================================
// Drawing functions
// =============================================================================

/**
 * Renders the specified Rune in a tab as a basic drawing.
 * @param rune - The Rune to render
 * @return {Rune} The specified Rune
 *
 * @category Main
 */
export function show(rune: Rune): Rune {
  throwIfNotRune('show', rune);
  drawnRunes.push(new NormalRune(rune));
  return rune;
}

/** @hidden */
export class AnaglyphRune extends DrawnRune {
  private static readonly anaglyphVertexShader = `
    precision mediump float;
    attribute vec4 a_position;
    varying highp vec2 v_texturePosition;
    void main() {
        gl_Position = a_position;
        // texture position is in [0,1], vertex position is in [-1,1]
        v_texturePosition.x = (a_position.x + 1.0) / 2.0;
        v_texturePosition.y = (a_position.y + 1.0) / 2.0;
    }
    `;

  private static readonly anaglyphFragmentShader = `
    precision mediump float;
    uniform sampler2D u_sampler_red;
    uniform sampler2D u_sampler_cyan;
    varying highp vec2 v_texturePosition;
    void main() {
        gl_FragColor = texture2D(u_sampler_red, v_texturePosition)
                + texture2D(u_sampler_cyan, v_texturePosition) - 1.0;
        gl_FragColor.a = 1.0;
    }
    `;

  constructor(rune: Rune) {
    super(rune, false);
  }

  public draw = (canvas: HTMLCanvasElement) => {
    const gl = getWebGlFromCanvas(canvas);

    // before draw the runes to framebuffer, we need to first draw a white background to cover the transparent places
    const runes = white(overlay_frac(0.999999999, blank, scale(2.2, square)))
      .flatten()
      .concat(this.rune.flatten());

    // calculate the left and right camera matrices
    const halfEyeDistance = 0.03;
    const leftCameraMatrix = mat4.create();
    mat4.lookAt(
      leftCameraMatrix,
      vec3.fromValues(-halfEyeDistance, 0, 0),
      vec3.fromValues(0, 0, -0.4),
      vec3.fromValues(0, 1, 0),
    );
    const rightCameraMatrix = mat4.create();
    mat4.lookAt(
      rightCameraMatrix,
      vec3.fromValues(halfEyeDistance, 0, 0),
      vec3.fromValues(0, 0, -0.4),
      vec3.fromValues(0, 1, 0),
    );

    // left/right eye images are drawn into respective framebuffers
    const leftBuffer = initFramebufferObject(gl);
    const rightBuffer = initFramebufferObject(gl);
    drawRunesToFrameBuffer(
      gl,
      runes,
      leftCameraMatrix,
      new Float32Array([1, 0, 0, 1]),
      leftBuffer.framebuffer,
      true,
    );
    drawRunesToFrameBuffer(
      gl,
      runes,
      rightCameraMatrix,
      new Float32Array([0, 1, 1, 1]),
      rightBuffer.framebuffer,
      true,
    );

    // prepare to draw to screen by setting framebuffer to null
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    // prepare the shader program to combine the left/right eye images
    const shaderProgram = initShaderProgram(
      gl,
      AnaglyphRune.anaglyphVertexShader,
      AnaglyphRune.anaglyphFragmentShader,
    );
    gl.useProgram(shaderProgram);
    const reduPt = gl.getUniformLocation(shaderProgram, 'u_sampler_red');
    const cyanuPt = gl.getUniformLocation(shaderProgram, 'u_sampler_cyan');
    const vertexPositionPointer = gl.getAttribLocation(
      shaderProgram,
      'a_position',
    );

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, leftBuffer.texture);
    gl.uniform1i(cyanuPt, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, rightBuffer.texture);
    gl.uniform1i(reduPt, 1);

    // draw a square, which will allow the texture to be used
    // load position buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, square.vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(vertexPositionPointer, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPositionPointer);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };
}

/**
 * Renders the specified Rune in a tab as an anaglyph. Use 3D glasses to view the
 * anaglyph.
 * @param rune - The Rune to render
 * @return {Rune} The specified Rune
 *
 * @category Main
 */
export function anaglyph(rune: Rune): Rune {
  throwIfNotRune('anaglyph', rune);
  drawnRunes.push(new AnaglyphRune(rune));
  return rune;
}

/** @hidden */
export class HollusionRune extends DrawnRune {
  constructor(rune: Rune, magnitude: number) {
    super(rune, true);
    this.rune.hollusionDistance = magnitude;
  }

  private static readonly copyVertexShader = `
    precision mediump float;
    attribute vec4 a_position;
    varying highp vec2 v_texturePosition;
    void main() {
        gl_Position = a_position;
        // texture position is in [0,1], vertex position is in [-1,1]
        v_texturePosition.x = (a_position.x + 1.0) / 2.0;
        v_texturePosition.y = (a_position.y + 1.0) / 2.0;
    }
    `;

  private static readonly copyFragmentShader = `
    precision mediump float;
    uniform sampler2D uTexture;
    varying highp vec2 v_texturePosition;
    void main() {
        gl_FragColor = texture2D(uTexture, v_texturePosition);
    }
    `;

  public draw = (canvas: HTMLCanvasElement) => {
    const gl = getWebGlFromCanvas(canvas);

    const runes = white(overlay_frac(0.999999999, blank, scale(2.2, square)))
      .flatten()
      .concat(this.rune.flatten());

    // first render all the frames into a framebuffer
    const xshiftMax = runes[0].hollusionDistance;
    const period = 2000; // animations loops every 2 seconds
    const frameCount = 50; // in total 50 frames, gives rise to 25 fps
    const frameBuffer: FrameBufferWithTexture[] = [];

    const renderFrame = (framePos: number): FrameBufferWithTexture => {
      const fb = initFramebufferObject(gl);
      // prepare camera projection array
      const cameraMatrix = mat4.create();
      // let the object shift in the x direction
      // the following calculation will let x oscillate in (-xshiftMax, xshiftMax) with time
      let xshift = (framePos * (period / frameCount)) % period;
      if (xshift > period / 2) {
        xshift = period - xshift;
      }
      xshift = xshiftMax * (2 * ((2 * xshift) / period) - 1);
      mat4.lookAt(
        cameraMatrix,
        vec3.fromValues(xshift, 0, 0),
        vec3.fromValues(0, 0, -0.4),
        vec3.fromValues(0, 1, 0),
      );

      drawRunesToFrameBuffer(
        gl,
        runes,
        cameraMatrix,
        new Float32Array([1, 1, 1, 1]),
        fb.framebuffer,
        true,
      );
      return fb;
    };

    for (let i = 0; i < frameCount; i += 1) {
      frameBuffer.push(renderFrame(i));
    }

    // Then, draw a frame from framebuffer for each update
    const copyShaderProgram = initShaderProgram(
      gl,
      HollusionRune.copyVertexShader,
      HollusionRune.copyFragmentShader,
    );
    gl.useProgram(copyShaderProgram);
    const texturePt = gl.getUniformLocation(copyShaderProgram, 'uTexture');
    const vertexPositionPointer = gl.getAttribLocation(
      copyShaderProgram,
      'a_position',
    );
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, square.vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(vertexPositionPointer, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPositionPointer);

    let lastTime = 0;
    function render(timeInMs: number) {
      if (timeInMs - lastTime < period / frameCount) return;

      lastTime = timeInMs;

      const framePos
        = Math.floor(timeInMs / (period / frameCount)) % frameCount;
      const fbObject = frameBuffer[framePos];
      gl.clearColor(1.0, 1.0, 1.0, 1.0); // Set clear color to white, fully opaque
      // eslint-disable-next-line no-bitwise
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the viewport

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, fbObject.texture);
      gl.uniform1i(texturePt, 0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    return render;
  };
}

/**
 * Renders the specified Rune in a tab as a hollusion, using the specified
 * magnitude.
 * @param rune - The Rune to render
 * @param {number} magnitude - The hollusion's magnitude
 * @return {Rune} The specified Rune
 *
 * @category Main
 */
export function hollusion_magnitude(rune: Rune, magnitude: number): Rune {
  throwIfNotRune('hollusion_magnitude', rune);
  drawnRunes.push(new HollusionRune(rune, magnitude));
  return rune;
}

/**
 * Renders the specified Rune in a tab as a hollusion, with a default magnitude
 * of 0.1.
 * @param rune - The Rune to render
 * @return {Rune} The specified Rune
 *
 * @category Main
 */
export function hollusion(rune: Rune): Rune {
  throwIfNotRune('hollusion', rune);
  return hollusion_magnitude(rune, 0.1);
}

/**
 * Create an animation of runes
 * @param duration Duration of the entire animation in seconds
 * @param fps Duration of each frame in frames per seconds
 * @param func Takes in the timestamp and returns a Rune to draw
 * @returns A rune animation
 *
 * @category Main
 */
export function animate_rune(
  duration: number,
  fps: number,
  func: RuneAnimation,
) {
  const anim = new AnimatedRune(duration, fps, (n) => {
    const rune = func(n);
    throwIfNotRune('animate_rune', rune);
    return new NormalRune(rune);
  });
  drawnRunes.push(anim);
  return anim;
}

/**
 * Create an animation of anaglyph runes
 * @param duration Duration of the entire animation in seconds
 * @param fps Duration of each frame in frames per seconds
 * @param func Takes in the timestamp and returns a Rune to draw
 * @returns A rune animation
 *
 * @category Main
 */
export function animate_anaglyph(
  duration: number,
  fps: number,
  func: RuneAnimation,
) {
  const anim = new AnimatedRune(duration, fps, (n) => {
    const rune = func(n);
    throwIfNotRune('animate_anaglyph', rune);
    return new AnaglyphRune(rune);
  });
  drawnRunes.push(anim);
  return anim;
}
