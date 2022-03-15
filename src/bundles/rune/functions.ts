/* eslint-disable max-classes-per-file */
/**
 * The module `rune` provides functions for drawing runes.
 *
 * A *Rune* is defined by its vertices (x,y,z,t), the colors on its vertices (r,g,b,a), a transformation matrix for rendering the Rune and a (could be empty) list of its sub-Runes.
 * @module rune
 */
import { mat4, vec3 } from 'gl-matrix';
import { NormalRune, Rune, RuneAnimation } from './rune';
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
  FrameBufferWithTexture,
  getWebGlFromCanvas,
  initFramebufferObject,
  initShaderProgram,
} from './runes_webgl';

/** @hidden */
export const drawnRunes: (Rune | RuneAnimation)[] = [];

// =============================================================================
// Basic Runes
// =============================================================================

/**
 * Rune with the shape of a full square
 */
export const square: NormalRune = getSquare();
/**
 * Rune with the shape of a blank square
 */
export const blank: NormalRune = getBlank();
/**
 * Rune with the shape of a
 * smallsquare inside a large square,
 * each diagonally split into a
 * black and white half
 */
export const rcross: NormalRune = getRcross();
/**
 * Rune with the shape of a sail
 */
export const sail: NormalRune = getSail();
/**
 * Rune with the shape of a triangle
 */
export const triangle: NormalRune = getTriangle();
/**
 * Rune with black triangle,
 * filling upper right corner
 */
export const corner: NormalRune = getCorner();
/**
 * Rune with the shape of two overlapping
 * triangles, residing in the upper half
 * of the shape
 */
export const nova: NormalRune = getNova();
/**
 * Rune with the shape of a circle
 */
export const circle: NormalRune = getCircle();
/**
 * Rune with the shape of a heart
 */
export const heart: NormalRune = getHeart();
/**
 * Rune with the shape of a pentagram
 */
export const pentagram: NormalRune = getPentagram();
/**
 * Rune with the shape of a ribbon
 * winding outwards in an anticlockwise spiral
 */
export const ribbon: NormalRune = getRibbon();

// =============================================================================
// Textured Runes
// =============================================================================
/**
 * create a rune using the image provided in the url
 * @param {string} imageUrl a URL to the image that is used to create the rune.
 * note that the url must be from a domain that allows CORS.
 * @returns {NormalRune} a rune created using the image.
 */
export function from_url(imageUrl: string): NormalRune {
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
 * scales a given Rune by separate factors in x and y direction
 * @param {number} ratio_x - scaling factor in x direction
 * @param {number} ratio_y - scaling factor in y direction
 * @param {NormalRune} rune - given Rune
 * @return {NormalRune} resulting scaled Rune
 */
export function scale_independent(
  ratio_x: number,
  ratio_y: number,
  rune: NormalRune
): NormalRune {
  throwIfNotRune('scale_independent', rune);
  const scaleVec = vec3.fromValues(ratio_x, ratio_y, 1);
  const scaleMat = mat4.create();
  mat4.scale(scaleMat, scaleMat, scaleVec);

  const wrapperMat = mat4.create();
  mat4.multiply(wrapperMat, scaleMat, wrapperMat);
  return NormalRune.of({
    subRunes: [rune],
    transformMatrix: wrapperMat,
  });
}

/**
 * scales a given Rune by a given factor in both x and y direction
 * @param {number} ratio - scaling factor
 * @param {NormalRune} rune - given Rune
 * @return {NormalRune} resulting scaled Rune
 */
export function scale(ratio: number, rune: NormalRune): NormalRune {
  throwIfNotRune('scale', rune);
  return scale_independent(ratio, ratio, rune);
}

/**
 * translates a given Rune by given values in x and y direction
 * @param {number} x - translation in x direction
 * @param {number} y - translation in y direction
 * @param {NormalRune} rune - given Rune
 * @return {NormalRune} resulting translated Rune
 */
export function translate(x: number, y: number, rune: NormalRune): NormalRune {
  throwIfNotRune('translate', rune);
  const translateVec = vec3.fromValues(x, -y, 0);
  const translateMat = mat4.create();
  mat4.translate(translateMat, translateMat, translateVec);

  const wrapperMat = mat4.create();
  mat4.multiply(wrapperMat, translateMat, wrapperMat);
  return NormalRune.of({
    subRunes: [rune],
    transformMatrix: wrapperMat,
  });
}

/**
 * rotates a given Rune by a given angle,
 * given in radians, in anti-clockwise direction.
 * Note that parts of the Rune
 * may be cropped as a result.
 * @param {number} rad - angle in radians
 * @param {NormalRune} rune - given Rune
 * @return {NormalRune} rotated Rune
 */
export function rotate(rad: number, rune: NormalRune): NormalRune {
  throwIfNotRune('rotate', rune);
  const rotateMat = mat4.create();
  mat4.rotateZ(rotateMat, rotateMat, rad);

  const wrapperMat = mat4.create();
  mat4.multiply(wrapperMat, rotateMat, wrapperMat);
  return NormalRune.of({
    subRunes: [rune],
    transformMatrix: wrapperMat,
  });
}

/**
 * makes a new Rune from two given Runes by
 * placing the first on top of the second
 * such that the first one occupies frac
 * portion of the height of the result and
 * the second the rest
 * @param {number} frac - fraction between 0 and 1 (inclusive)
 * @param {NormalRune} rune1 - given Rune
 * @param {NormalRune} rune2 - given Rune
 * @return {NormalRune} resulting Rune
 */
export function stack_frac(
  frac: number,
  rune1: NormalRune,
  rune2: NormalRune
): NormalRune {
  throwIfNotRune('stack_frac', rune1);
  throwIfNotRune('stack_frac', rune2);

  if (!(frac >= 0 && frac <= 1)) {
    throw Error('stack_frac can only take fraction in [0,1].');
  }

  const upper = translate(0, -(1 - frac), scale_independent(1, frac, rune1));
  const lower = translate(0, frac, scale_independent(1, 1 - frac, rune2));
  return NormalRune.of({
    subRunes: [upper, lower],
  });
}

/**
 * makes a new Rune from two given Runes by
 * placing the first on top of the second, each
 * occupying equal parts of the height of the
 * result
 * @param {NormalRune} rune1 - given Rune
 * @param {NormalRune} rune2 - given Rune
 * @return {NormalRune} resulting Rune
 */
export function stack(rune1: NormalRune, rune2: NormalRune): NormalRune {
  throwIfNotRune('stack', rune2);
  throwIfNotRune('stack', rune1);
  return stack_frac(1 / 2, rune1, rune2);
}

/**
 * makes a new Rune from a given Rune
 * by vertically stacking n copies of it
 * @param {number} n - positive integer
 * @param {NormalRune} rune - given Rune
 * @return {NormalRune} resulting Rune
 */
export function stackn(n: number, rune: NormalRune): NormalRune {
  throwIfNotRune('stackn', rune);
  if (n === 1) {
    return rune;
  }
  return stack_frac(1 / n, rune, stackn(n - 1, rune));
}

/**
 * makes a new Rune from a given Rune
 * by turning it a quarter-turn around the centre in
 * clockwise direction.
 * @param {NormalRune} rune - given Rune
 * @return {NormalRune} resulting Rune
 */
export function quarter_turn_right(rune: NormalRune): NormalRune {
  throwIfNotRune('quarter_turn_right', rune);
  return rotate(-Math.PI / 2, rune);
}

/**
 * makes a new Rune from a given Rune
 * by turning it a quarter-turn in
 * anti-clockwise direction.
 * @param {NormalRune} rune - given Rune
 * @return {NormalRune} resulting Rune
 */
export function quarter_turn_left(rune: NormalRune): NormalRune {
  throwIfNotRune('quarter_turn_left', rune);
  return rotate(Math.PI / 2, rune);
}

/**
 * makes a new Rune from a given Rune
 * by turning it upside-down
 * @param {NormalRune} rune - given Rune
 * @return {NormalRune} resulting Rune
 */
export function turn_upside_down(rune: NormalRune): NormalRune {
  throwIfNotRune('turn_upside_down', rune);
  return rotate(Math.PI, rune);
}

/**
 * makes a new Rune from two given Runes by
 * placing the first on the left of the second
 * such that the first one occupies frac
 * portion of the width of the result and
 * the second the rest
 * @param {number} frac - fraction between 0 and 1 (inclusive)
 * @param {NormalRune} rune1 - given Rune
 * @param {NormalRune} rune2 - given Rune
 * @return {NormalRune} resulting Rune
 */
export function beside_frac(
  frac: number,
  rune1: NormalRune,
  rune2: NormalRune
): NormalRune {
  throwIfNotRune('beside_frac', rune1);
  throwIfNotRune('beside_frac', rune2);

  if (!(frac >= 0 && frac <= 1)) {
    throw Error('beside_frac can only take fraction in [0,1].');
  }

  const left = translate(-(1 - frac), 0, scale_independent(frac, 1, rune1));
  const right = translate(frac, 0, scale_independent(1 - frac, 1, rune2));
  return NormalRune.of({
    subRunes: [left, right],
  });
}

/**
 * makes a new Rune from two given Runes by
 * placing the first on the left of the second,
 * both occupying equal portions of the width
 * of the result
 * @param {NormalRune} rune1 - given Rune
 * @param {NormalRune} rune2 - given Rune
 * @return {NormalRune} resulting Rune
 */
export function beside(rune1: NormalRune, rune2: NormalRune): NormalRune {
  throwIfNotRune('beside', rune1);
  throwIfNotRune('beside', rune2);
  return beside_frac(1 / 2, rune1, rune2);
}

/**
 * makes a new Rune from a given Rune by
 * flipping it around a horizontal axis,
 * turning it upside down
 * @param {NormalRune} rune - given Rune
 * @return {NormalRune} resulting Rune
 */
export function flip_vert(rune: NormalRune): NormalRune {
  throwIfNotRune('flip_vert', rune);
  return scale_independent(1, -1, rune);
}

/**
 * makes a new Rune from a given Rune by
 * flipping it around a vertical axis,
 * creating a mirror image
 * @param {NormalRune} rune - given Rune
 * @return {NormalRune} resulting Rune
 */
export function flip_horiz(rune: NormalRune): NormalRune {
  throwIfNotRune('flip_horiz', rune);
  return scale_independent(-1, 1, rune);
}

/**
 * makes a new Rune from a given Rune by
 * arranging into a square for copies of the
 * given Rune in different orientations
 * @param {NormalRune} rune - given Rune
 * @return {NormalRune} resulting Rune
 */
export function make_cross(rune: NormalRune): NormalRune {
  throwIfNotRune('make_cross', rune);
  return stack(
    beside(quarter_turn_right(rune), rotate(Math.PI, rune)),
    beside(rune, rotate(Math.PI / 2, rune))
  );
}

/**
 * applies a given function n times to an initial value
 * @param {number} n - a non-negative integer
 * @param {function} pattern - unary function from Rune to Rune
 * @param {NormalRune} initial - the initial Rune
 * @return {NormalRune} - result of n times application of
 *               pattern to initial: pattern(pattern(...pattern(pattern(initial))...))
 */
export function repeat_pattern(
  n: number,
  pattern: (a: NormalRune) => NormalRune,
  initial: NormalRune
): NormalRune {
  if (n === 0) {
    return initial;
  }
  return pattern(repeat_pattern(n - 1, pattern, initial));
}

// =============================================================================
// Z-axis Transformation functions
// =============================================================================

/**
 * the depth range of the z-axis of a rune is [0,-1], this function gives a [0, -frac] of the depth range to rune1 and the rest to rune2.
 * @param {number} frac - fraction between 0 and 1 (inclusive)
 * @param {NormalRune} rune1 - given Rune
 * @param {NormalRune} rune2 - given Rune
 * @return {NormalRune} resulting Rune
 */
export function overlay_frac(
  frac: number,
  rune1: NormalRune,
  rune2: NormalRune
): NormalRune {
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
  const front = NormalRune.of({
    subRunes: [rune1],
    transformMatrix: frontMat,
  });

  const backMat = mat4.create();
  // need to apply transformation in backwards order!
  mat4.translate(backMat, backMat, vec3.fromValues(0, 0, -useFrac));
  mat4.scale(backMat, backMat, vec3.fromValues(1, 1, 1 - useFrac));
  const back = NormalRune.of({
    subRunes: [rune2],
    transformMatrix: backMat,
  });

  return NormalRune.of({
    subRunes: [front, back], // render front first to avoid redrawing
  });
}

/**
 * the depth range of the z-axis of a rune is [0,-1], this function maps the depth range of rune1 and rune2 to [0,-0.5] and [-0.5,-1] respectively.
 * @param {NormalRune} rune1 - given Rune
 * @param {NormalRune} rune2 - given Rune
 * @return {NormalRune} resulting Rune
 */
export function overlay(rune1: NormalRune, rune2: NormalRune): NormalRune {
  throwIfNotRune('overlay', rune1);
  throwIfNotRune('overlay', rune2);
  return overlay_frac(0.5, rune1, rune2);
}

// =============================================================================
// Color functions
// =============================================================================

/**
 * adds color to rune by specifying
 * the red, green, blue (RGB) value, ranging from 0.0 to 1.0.
 * RGB is additive: if all values are 1, the color is white,
 * and if all values are 0, the color is black.
 * @param {NormalRune} rune - the rune to add color to
 * @param {number} r - red value [0.0-1.0]
 * @param {number} g - green value [0.0-1.0]
 * @param {number} b - blue value [0.0-1.0]
 * @returns {NormalRune} the colored Rune
 */
export function color(
  rune: NormalRune,
  r: number,
  g: number,
  b: number
): NormalRune {
  throwIfNotRune('color', rune);

  const colorVector = [r, g, b, 1];
  return NormalRune.of({
    colors: new Float32Array(colorVector),
    subRunes: [rune],
  });
}

/**
 * Gives random color to the given rune.
 * The color is chosen randomly from the following nine
 * colors: red, pink, purple, indigo, blue, green, yellow, orange, brown
 * @param {NormalRune} rune - the rune to color
 * @returns {NormalRune} the colored Rune
 */
export function random_color(rune: NormalRune): NormalRune {
  throwIfNotRune('random_color', rune);
  const randomColor = hexToColor(
    colorPalette[Math.floor(Math.random() * colorPalette.length)]
  );

  return NormalRune.of({
    colors: new Float32Array(randomColor),
    subRunes: [rune],
  });
}

/**
 * colors the given rune red.
 * @param {NormalRune} rune - the rune to color
 * @returns {NormalRune} the colored Rune
 */
export function red(rune: NormalRune): NormalRune {
  throwIfNotRune('red', rune);
  return addColorFromHex(rune, '#F44336');
}

/**
 * colors the given rune pink.
 * @param {NormalRune} rune - the rune to color
 * @returns {NormalRune} the colored Rune
 */
export function pink(rune: NormalRune): NormalRune {
  throwIfNotRune('pink', rune);
  return addColorFromHex(rune, '#E91E63');
}

/**
 * colors the given rune purple.
 * @param {NormalRune} rune - the rune to color
 * @returns {NormalRune} the colored Rune
 */
export function purple(rune: NormalRune): NormalRune {
  throwIfNotRune('purple', rune);
  return addColorFromHex(rune, '#AA00FF');
}

/**
 * colors the given rune indigo.
 * @param {NormalRune} rune - the rune to color
 * @returns {NormalRune} the colored Rune
 */
export function indigo(rune: NormalRune): NormalRune {
  throwIfNotRune('indigo', rune);
  return addColorFromHex(rune, '#3F51B5');
}

/**
 * colors the given rune blue.
 * @param {NormalRune} rune - the rune to color
 * @returns {NormalRune} the colored Rune
 */
export function blue(rune: NormalRune): NormalRune {
  throwIfNotRune('blue', rune);
  return addColorFromHex(rune, '#2196F3');
}

/**
 * colors the given rune green.
 * @param {NormalRune} rune - the rune to color
 * @returns {NormalRune} the colored Rune
 */
export function green(rune: NormalRune): NormalRune {
  throwIfNotRune('green', rune);
  return addColorFromHex(rune, '#4CAF50');
}

/**
 * colors the given rune yellow.
 * @param {NormalRune} rune - the rune to color
 * @returns {NormalRune} the colored Rune
 */
export function yellow(rune: NormalRune): NormalRune {
  throwIfNotRune('yellow', rune);
  return addColorFromHex(rune, '#FFEB3B');
}

/**
 * colors the given rune orange.
 * @param {NormalRune} rune - the rune to color
 * @returns {NormalRune} the colored Rune
 */
export function orange(rune: NormalRune): NormalRune {
  throwIfNotRune('orange', rune);
  return addColorFromHex(rune, '#FF9800');
}

/**
 * colors the given rune brown.
 * @param {NormalRune} rune - the rune to color
 * @returns {NormalRune} the colored Rune
 */
export function brown(rune: NormalRune): NormalRune {
  throwIfNotRune('brown', rune);
  return addColorFromHex(rune, '#795548');
}

/**
 * colors the given rune black.
 * @param {NormalRune} rune - the rune to color
 * @returns {NormalRune} the colored Rune
 */
export function black(rune: NormalRune): NormalRune {
  throwIfNotRune('black', rune);
  return addColorFromHex(rune, '#000000');
}

/**
 * colors the given rune white.
 * @param {NormalRune} rune - the rune to color
 * @returns {NormalRune} the colored Rune
 */
export function white(rune: NormalRune): NormalRune {
  throwIfNotRune('white', rune);
  return addColorFromHex(rune, '#FFFFFF');
}

// =============================================================================
// Drawing functions
// =============================================================================

/**
 * Show the rune on the tab using the basic drawing.
 *
 * @param rune - Rune to render
 * @return {NormalRune} with drawing method set to normal
 */
export function show(rune: NormalRune): NormalRune {
  throwIfNotRune('show', rune);
  drawnRunes.push(rune.copy());
  return rune;
}

export class AnaglyphRune extends Rune {
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

  public copy = () =>
    new AnaglyphRune(
      this.vertices,
      this.colors,
      mat4.clone(this.transformMatrix),
      this.subRunes,
      this.texture,
      this.hollusionDistance
    );

  public draw = (canvas: HTMLCanvasElement) => {
    const gl = getWebGlFromCanvas(canvas);
    // stopAnimation(canvas);

    // before draw the runes to framebuffer, we need to first draw a white background to cover the transparent places
    const runes = white(overlay_frac(0.999999999, blank, scale(2.2, square)))
      .flatten()
      .concat(this.flatten());

    // calculate the left and right camera matrices
    const halfEyeDistance = 0.03;
    const leftCameraMatrix = mat4.create();
    mat4.lookAt(
      leftCameraMatrix,
      vec3.fromValues(-halfEyeDistance, 0, 0),
      vec3.fromValues(0, 0, -0.4),
      vec3.fromValues(0, 1, 0)
    );
    const rightCameraMatrix = mat4.create();
    mat4.lookAt(
      rightCameraMatrix,
      vec3.fromValues(halfEyeDistance, 0, 0),
      vec3.fromValues(0, 0, -0.4),
      vec3.fromValues(0, 1, 0)
    );

    // left/right eye images are drawn into respective framebuffers
    const leftBuffer = initFramebufferObject(gl);
    const rightBuffer = initFramebufferObject(gl);
    this.drawRunesToFrameBuffer(
      gl,
      runes,
      leftCameraMatrix,
      new Float32Array([1, 0, 0, 1]),
      leftBuffer.framebuffer,
      true
    );
    this.drawRunesToFrameBuffer(
      gl,
      runes,
      rightCameraMatrix,
      new Float32Array([0, 1, 1, 1]),
      rightBuffer.framebuffer,
      true
    );

    // prepare to draw to screen by setting framebuffer to null
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    // prepare the shader program to combine the left/right eye images
    const shaderProgram = initShaderProgram(
      gl,
      AnaglyphRune.anaglyphVertexShader,
      AnaglyphRune.anaglyphFragmentShader
    );
    gl.useProgram(shaderProgram);
    const reduPt = gl.getUniformLocation(shaderProgram, 'u_sampler_red');
    const cyanuPt = gl.getUniformLocation(shaderProgram, 'u_sampler_cyan');
    const vertexPositionPointer = gl.getAttribLocation(
      shaderProgram,
      'a_position'
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

  public static fromRune(rune: NormalRune) {
    return rune.copy() as AnaglyphRune;
  }
}

/**
 * render the given Rune in an Anaglyph. Use your 3D-glasses
 * to view the Anaglyph.
 * @param {NormalRune} rune - Rune to render
 * @return {NormalRune} with drawing method set to anaglyph
 */
export function anaglyph(rune: NormalRune): NormalRune {
  throwIfNotRune('anaglyph', rune);
  drawnRunes.push(AnaglyphRune.fromRune(rune));
  return rune;
}

export class HollusionRune extends Rune {
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

  public copy = () =>
    new HollusionRune(
      this.vertices,
      this.colors,
      mat4.clone(this.transformMatrix),
      this.subRunes,
      this.texture,
      this.hollusionDistance
    );

  public draw = (canvas: HTMLCanvasElement) => {
    const gl = getWebGlFromCanvas(canvas);
    // stopAnimation(canvas);

    const runes = white(overlay_frac(0.999999999, blank, scale(2.2, square)))
      .flatten()
      .concat(this.flatten());

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
        vec3.fromValues(0, 1, 0)
      );

      this.drawRunesToFrameBuffer(
        gl,
        runes,
        cameraMatrix,
        new Float32Array([1, 1, 1, 1]),
        fb.framebuffer,
        true
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
      HollusionRune.copyFragmentShader
    );
    gl.useProgram(copyShaderProgram);
    const texturePt = gl.getUniformLocation(copyShaderProgram, 'uTexture');
    const vertexPositionPointer = gl.getAttribLocation(
      copyShaderProgram,
      'a_position'
    );
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, square.vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(vertexPositionPointer, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPositionPointer);

    let lastTime = 0;
    function render(timeInMs: number) {
      // if (!canvas.isEqualNode(document.getElementById('runesCanvas'))) {
      //   return;
      // }
      // const id = requestAnimationFrame(render);
      // canvas.setAttribute('animRequestID', `${id}`);

      if (timeInMs - lastTime < period / frameCount) {
        return;
      }
      lastTime = timeInMs;

      const framePos =
        Math.floor(timeInMs / (period / frameCount)) % frameCount;
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
    // requestAnimationFrame(render);
  };

  public static fromRune(rune: NormalRune, hollusionDistance: number) {
    const runeCopy = rune.copy();
    runeCopy.hollusionDistance = hollusionDistance;
    return runeCopy as HollusionRune;
  }
}

/**
 * render the given Rune with hollusion, with adjustable magnitude.
 * @param {NormalRune} rune - Rune to render
 * @param {number} magnitude - (optional) the magnitude of hollusion
 * @return {NormalRune} with drawing method set to hollusion
 */
export function hollusion_magnitude(
  rune: NormalRune,
  magnitude: number = 0.1
): NormalRune {
  throwIfNotRune('hollusion_magnitude', rune);
  drawnRunes.push(HollusionRune.fromRune(rune, magnitude));
  return rune;
}

/**
 * render the given Rune with hollusion, with default magnitude 0.1.
 * @param {NormalRune} rune - Rune to render
 * @return {NormalRune} with drawing method set to hollusion
 */
export function hollusion(rune: NormalRune): NormalRune {
  throwIfNotRune('hollusion', rune);
  return hollusion_magnitude(rune, 0.1);
}

/**
 * Create an animation of runes
 * @param frames Number of frames
 * @param func Takes in a number between 0 and 1 and returns the Rune to draw
 * @returns A rune animation
 */
export function rune_animation(frames: number, func: (frame: number) => Rune) {
  const anim = new RuneAnimation(frames, func);
  drawnRunes.push(anim);
  return anim;
}
