/**
 * The module `rune` provides functions for drawing runes.
 *
 * A *Rune* is defined by its vertices (x,y,z,t), the colors on its vertices (r,g,b,a), a transformation matrix for rendering the Rune and a (could be empty) list of its sub-Runes.
 * @module rune
 */
import { mat4, vec3 } from 'gl-matrix';
import { Rune } from './types';
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
  getEmptyRune,
  addColorFromHex,
  colorPalette,
  hexToColor,
  copyRune,
} from './runes_ops';

// =============================================================================
// Basic Runes
// =============================================================================

/**
 * Rune with the shape of a full square
 */
export const square: Rune = getSquare();
/**
 * Rune with the shape of a blank square
 */
export const blank: Rune = getBlank();
/**
 * Rune with the shape of a
 * smallsquare inside a large square,
 * each diagonally split into a
 * black and white half
 */
export const rcross: Rune = getRcross();
/**
 * Rune with the shape of a sail
 */
export const sail: Rune = getSail();
/**
 * Rune with the shape of a triangle
 */
export const triangle: Rune = getTriangle();
/**
 * Rune with black triangle,
 * filling upper right corner
 */
export const corner: Rune = getCorner();
/**
 * Rune with the shape of two overlapping
 * triangles, residing in the upper half
 * of the shape
 */
export const nova: Rune = getNova();
/**
 * Rune with the shape of a circle
 */
export const circle: Rune = getCircle();
/**
 * Rune with the shape of a heart
 */
export const heart: Rune = getHeart();
/**
 * Rune with the shape of a pentagram
 */
export const pentagram: Rune = getPentagram();
/**
 * Rune with the shape of a ribbon
 * winding outwards in an anticlockwise spiral
 */
export const ribbon: Rune = getRibbon();

// =============================================================================
// Textured Runes
// =============================================================================
/**
 * create a rune using the image provided in the url
 * @param {string} imageUrl a URL to the image that is used to create the rune.
 * note that the url must be from a domain that allows CORS.
 * @returns {Rune} a rune created using the image.
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
 * scales a given Rune by separate factors in x and y direction
 * @param {number} ratio_x - scaling factor in x direction
 * @param {number} ratio_y - scaling factor in y direction
 * @param {Rune} rune - given Rune
 * @return {Rune} resulting scaled Rune
 */
export function scale_independent(
  ratio_x: number,
  ratio_y: number,
  rune: Rune
): Rune {
  throwIfNotRune('scale_independent', rune);
  const scaleVec = vec3.fromValues(ratio_x, ratio_y, 1);
  const scaleMat = mat4.create();
  mat4.scale(scaleMat, scaleMat, scaleVec);
  const wrapper = getEmptyRune();
  wrapper.subRunes.push(rune);
  mat4.multiply(wrapper.transformMatrix, scaleMat, wrapper.transformMatrix);
  return wrapper;
}

/**
 * scales a given Rune by a given factor in both x and y direction
 * @param {number} ratio - scaling factor
 * @param {Rune} rune - given Rune
 * @return {Rune} resulting scaled Rune
 */
export function scale(ratio: number, rune: Rune): Rune {
  throwIfNotRune('scale', rune);
  return scale_independent(ratio, ratio, rune);
}

/**
 * translates a given Rune by given values in x and y direction
 * @param {number} x - translation in x direction
 * @param {number} y - translation in y direction
 * @param {Rune} rune - given Rune
 * @return {Rune} resulting translated Rune
 */
export function translate(x: number, y: number, rune: Rune): Rune {
  throwIfNotRune('translate', rune);
  const translateVec = vec3.fromValues(x, -y, 0);
  const translateMat = mat4.create();
  mat4.translate(translateMat, translateMat, translateVec);
  const wrapper = getEmptyRune();
  wrapper.subRunes.push(rune);
  mat4.multiply(wrapper.transformMatrix, translateMat, wrapper.transformMatrix);
  return wrapper;
}

/**
 * rotates a given Rune by a given angle,
 * given in radians, in anti-clockwise direction.
 * Note that parts of the Rune
 * may be cropped as a result.
 * @param {number} rad - angle in radians
 * @param {Rune} rune - given Rune
 * @return {Rune} rotated Rune
 */
export function rotate(rad: number, rune: Rune): Rune {
  throwIfNotRune('rotate', rune);
  const rotateMat = mat4.create();
  mat4.rotateZ(rotateMat, rotateMat, rad);
  const wrapper = getEmptyRune();
  wrapper.subRunes.push(rune);
  mat4.multiply(wrapper.transformMatrix, rotateMat, wrapper.transformMatrix);
  return wrapper;
}

/**
 * makes a new Rune from two given Runes by
 * placing the first on top of the second
 * such that the first one occupies frac
 * portion of the height of the result and
 * the second the rest
 * @param {number} frac - fraction between 0 and 1 (inclusive)
 * @param {Rune} rune1 - given Rune
 * @param {Rune} rune2 - given Rune
 * @return {Rune} resulting Rune
 */
export function stack_frac(frac: number, rune1: Rune, rune2: Rune): Rune {
  throwIfNotRune('stack_frac', rune1);
  throwIfNotRune('stack_frac', rune2);

  if (!(frac >= 0 && frac <= 1)) {
    throw Error('stack_frac can only take fraction in [0,1].');
  }

  const upper = translate(0, -(1 - frac), scale_independent(1, frac, rune1));
  const lower = translate(0, frac, scale_independent(1, 1 - frac, rune2));
  const combined = getEmptyRune();
  combined.subRunes.push(upper, lower);
  return combined;
}

/**
 * makes a new Rune from two given Runes by
 * placing the first on top of the second, each
 * occupying equal parts of the height of the
 * result
 * @param {Rune} rune1 - given Rune
 * @param {Rune} rune2 - given Rune
 * @return {Rune} resulting Rune
 */
export function stack(rune1: Rune, rune2: Rune): Rune {
  throwIfNotRune('stack', rune2);
  throwIfNotRune('stack', rune1);
  return stack_frac(1 / 2, rune1, rune2);
}

/**
 * makes a new Rune from a given Rune
 * by vertically stacking n copies of it
 * @param {number} n - positive integer
 * @param {Rune} rune - given Rune
 * @return {Rune} resulting Rune
 */
export function stackn(n: number, rune: Rune): Rune {
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
 * @param {Rune} rune - given Rune
 * @return {Rune} resulting Rune
 */
export function quarter_turn_right(rune: Rune): Rune {
  throwIfNotRune('quarter_turn_right', rune);
  return rotate(-Math.PI / 2, rune);
}

/**
 * makes a new Rune from a given Rune
 * by turning it a quarter-turn in
 * anti-clockwise direction.
 * @param {Rune} rune - given Rune
 * @return {Rune} resulting Rune
 */
export function quarter_turn_left(rune: Rune): Rune {
  throwIfNotRune('quarter_turn_left', rune);
  return rotate(Math.PI / 2, rune);
}

/**
 * makes a new Rune from a given Rune
 * by turning it upside-down
 * @param {Rune} rune - given Rune
 * @return {Rune} resulting Rune
 */
export function turn_upside_down(rune: Rune): Rune {
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
 * @param {Rune} rune1 - given Rune
 * @param {Rune} rune2 - given Rune
 * @return {Rune} resulting Rune
 */
export function beside_frac(frac: number, rune1: Rune, rune2: Rune): Rune {
  throwIfNotRune('beside_frac', rune1);
  throwIfNotRune('beside_frac', rune2);

  if (!(frac >= 0 && frac <= 1)) {
    throw Error('beside_frac can only take fraction in [0,1].');
  }

  const left = translate(-(1 - frac), 0, scale_independent(frac, 1, rune1));
  const right = translate(frac, 0, scale_independent(1 - frac, 1, rune2));
  const combined = getEmptyRune();
  combined.subRunes.push(left, right);
  return combined;
}

/**
 * makes a new Rune from two given Runes by
 * placing the first on the left of the second,
 * both occupying equal portions of the width
 * of the result
 * @param {Rune} rune1 - given Rune
 * @param {Rune} rune2 - given Rune
 * @return {Rune} resulting Rune
 */
export function beside(rune1: Rune, rune2: Rune): Rune {
  throwIfNotRune('beside', rune1);
  throwIfNotRune('beside', rune2);
  return beside_frac(1 / 2, rune1, rune2);
}

/**
 * makes a new Rune from a given Rune by
 * flipping it around a horizontal axis,
 * turning it upside down
 * @param {Rune} rune - given Rune
 * @return {Rune} resulting Rune
 */
export function flip_vert(rune: Rune): Rune {
  throwIfNotRune('flip_vert', rune);
  return scale_independent(1, -1, rune);
}

/**
 * makes a new Rune from a given Rune by
 * flipping it around a vertical axis,
 * creating a mirror image
 * @param {Rune} rune - given Rune
 * @return {Rune} resulting Rune
 */
export function flip_horiz(rune: Rune): Rune {
  throwIfNotRune('flip_horiz', rune);
  return scale_independent(-1, 1, rune);
}

/**
 * makes a new Rune from a given Rune by
 * arranging into a square for copies of the
 * given Rune in different orientations
 * @param {Rune} rune - given Rune
 * @return {Rune} resulting Rune
 */
export function make_cross(rune: Rune): Rune {
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
 * @param {Rune} initial - the initial Rune
 * @return {Rune} - result of n times application of
 *               pattern to initial: pattern(pattern(...pattern(pattern(initial))...))
 */
export function repeat_pattern(
  n: number,
  pattern: (a: Rune) => Rune,
  initial: Rune
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
 * the depth range of the z-axis of a rune is [0,-1], this function gives a [0, -frac] of the depth range to rune1 and the rest to rune2.
 * @param {number} frac - fraction between 0 and 1 (inclusive)
 * @param {Rune} rune1 - given Rune
 * @param {Rune} rune2 - given Rune
 * @return {Rune} resulting Rune
 */
export function overlay_frac(frac: number, rune1: Rune, rune2: Rune): Rune {
  // to developer: please read https://www.tutorialspoint.com/webgl/webgl_basics.htm to understand the webgl z-axis interpretation. The key point is that positive z is closer to the screen. Hence, the image at the back should have smaller z value. Primitive runes have z = 0.
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

  const front = getEmptyRune();
  front.subRunes.push(rune1);
  const frontMat = front.transformMatrix;
  // z: scale by frac
  mat4.scale(frontMat, frontMat, vec3.fromValues(1, 1, useFrac));

  const back = getEmptyRune();
  back.subRunes.push(rune2);
  const backMat = back.transformMatrix;
  // need to apply transformation in backwards order!
  mat4.translate(backMat, backMat, vec3.fromValues(0, 0, -useFrac));
  mat4.scale(backMat, backMat, vec3.fromValues(1, 1, 1 - useFrac));

  const combined = getEmptyRune();
  combined.subRunes = [front, back]; // render front first to avoid redrawing
  return combined;
}

/**
 * the depth range of the z-axis of a rune is [0,-1], this function maps the depth range of rune1 and rune2 to [0,-0.5] and [-0.5,-1] respectively.
 * @param {Rune} rune1 - given Rune
 * @param {Rune} rune2 - given Rune
 * @return {Rune} resulting Rune
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
 * adds color to rune by specifying
 * the red, green, blue (RGB) value, ranging from 0.0 to 1.0.
 * RGB is additive: if all values are 1, the color is white,
 * and if all values are 0, the color is black.
 * @param {Rune} rune - the rune to add color to
 * @param {number} r - red value [0.0-1.0]
 * @param {number} g - green value [0.0-1.0]
 * @param {number} b - blue value [0.0-1.0]
 * @returns {Rune} the colored Rune
 */
export function color(rune: Rune, r: number, g: number, b: number): Rune {
  throwIfNotRune('color', rune);
  const wrapper = getEmptyRune();
  wrapper.subRunes.push(rune);
  const colorVector = [r, g, b, 1];
  wrapper.colors = new Float32Array(colorVector);
  return wrapper;
}

/**
 * Gives random color to the given rune.
 * The color is chosen randomly from the following nine
 * colors: red, pink, purple, indigo, blue, green, yellow, orange, brown
 * @param {Rune} rune - the rune to color
 * @returns {Rune} the colored Rune
 */
export function random_color(rune: Rune): Rune {
  throwIfNotRune('random_color', rune);
  const wrapper = getEmptyRune();
  wrapper.subRunes.push(rune);
  const randomColor = hexToColor(
    colorPalette[Math.floor(Math.random() * colorPalette.length)]
  );
  wrapper.colors = new Float32Array(randomColor);
  return wrapper;
}

/**
 * colors the given rune red.
 * @param {Rune} rune - the rune to color
 * @returns {Rune} the colored Rune
 */
export function red(rune: Rune): Rune {
  throwIfNotRune('red', rune);
  return addColorFromHex(rune, '#F44336');
}

/**
 * colors the given rune pink.
 * @param {Rune} rune - the rune to color
 * @returns {Rune} the colored Rune
 */
export function pink(rune: Rune): Rune {
  throwIfNotRune('pink', rune);
  return addColorFromHex(rune, '#E91E63');
}

/**
 * colors the given rune purple.
 * @param {Rune} rune - the rune to color
 * @returns {Rune} the colored Rune
 */
export function purple(rune: Rune): Rune {
  throwIfNotRune('purple', rune);
  return addColorFromHex(rune, '#AA00FF');
}

/**
 * colors the given rune indigo.
 * @param {Rune} rune - the rune to color
 * @returns {Rune} the colored Rune
 */
export function indigo(rune: Rune): Rune {
  throwIfNotRune('indigo', rune);
  return addColorFromHex(rune, '#3F51B5');
}

/**
 * colors the given rune blue.
 * @param {Rune} rune - the rune to color
 * @returns {Rune} the colored Rune
 */
export function blue(rune: Rune): Rune {
  throwIfNotRune('blue', rune);
  return addColorFromHex(rune, '#2196F3');
}

/**
 * colors the given rune green.
 * @param {Rune} rune - the rune to color
 * @returns {Rune} the colored Rune
 */
export function green(rune: Rune): Rune {
  throwIfNotRune('green', rune);
  return addColorFromHex(rune, '#4CAF50');
}

/**
 * colors the given rune yellow.
 * @param {Rune} rune - the rune to color
 * @returns {Rune} the colored Rune
 */
export function yellow(rune: Rune): Rune {
  throwIfNotRune('yellow', rune);
  return addColorFromHex(rune, '#FFEB3B');
}

/**
 * colors the given rune orange.
 * @param {Rune} rune - the rune to color
 * @returns {Rune} the colored Rune
 */
export function orange(rune: Rune): Rune {
  throwIfNotRune('orange', rune);
  return addColorFromHex(rune, '#FF9800');
}

/**
 * colors the given rune brown.
 * @param {Rune} rune - the rune to color
 * @returns {Rune} the colored Rune
 */
export function brown(rune: Rune): Rune {
  throwIfNotRune('brown', rune);
  return addColorFromHex(rune, '#795548');
}

/**
 * colors the given rune black.
 * @param {Rune} rune - the rune to color
 * @returns {Rune} the colored Rune
 */
export function black(rune: Rune): Rune {
  throwIfNotRune('black', rune);
  return addColorFromHex(rune, '#000000');
}

/**
 * colors the given rune white.
 * @param {Rune} rune - the rune to color
 * @returns {Rune} the colored Rune
 */
export function white(rune: Rune): Rune {
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
 * @return {Rune} with drawing method set to normal
 */
export function show(rune: Rune): Rune {
  throwIfNotRune('show', rune);
  const normalRune = copyRune(rune);
  normalRune.drawMethod = 'normal';
  normalRune.toReplString = () => '<RENDERING>';
  return normalRune;
}

/**
 * render the given Rune in an Anaglyph. Use your 3D-glasses
 * to view the Anaglyph.
 * @param {Rune} rune - Rune to render
 * @return {Rune} with drawing method set to anaglyph
 */
export function anaglyph(rune: Rune): Rune {
  throwIfNotRune('anaglyph', rune);
  const analyphRune = copyRune(rune);
  analyphRune.drawMethod = 'anaglyph';
  analyphRune.toReplString = () => '<RENDERING>';
  return analyphRune;
}

/**
 * render the given Rune with hollusion, with adjustable magnitude.
 * @param {Rune} rune - Rune to render
 * @param {number} magnitude - (optional) the magnitude of hollusion
 * @return {Rune} with drawing method set to hollusion
 */
export function hollusion_magnitude(rune: Rune, magnitude: number = 0.1): Rune {
  throwIfNotRune('hollusion_magnitude', rune);
  const hollusionRune = copyRune(rune);
  hollusionRune.drawMethod = 'hollusion';
  hollusionRune.hollusionDistance = magnitude;
  hollusionRune.toReplString = () => '<RENDERING>';
  return hollusionRune;
}

/**
 * render the given Rune with hollusion, with default magnitude 0.1.
 * @param {Rune} rune - Rune to render
 * @return {Rune} with drawing method set to hollusion
 */
export function hollusion(rune: Rune): Rune {
  throwIfNotRune('hollusion', rune);
  return hollusion_magnitude(rune, 0.1);
}
