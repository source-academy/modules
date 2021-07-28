/**
 * RUNES provide functions for drawing runes.
 *
 * A *Rune* is defined by its vertices (x,y,z,t), the colors on its vertices (r,g,b,a), a transformation matrix for rendering the Rune and a (could be empty) list of its sub-Runes.
 * @module runes
 */
import { mat4, vec3 } from 'gl-matrix';
import { Rune } from './types';
import {
  getSquare,
  getBlank,
  getRcross,
  getSail,
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
// XY-axis Transformation functions
// =============================================================================

/**
 * scales a given Rune by separate factors in x and y direction
 * @param {number} ratio_x - scaling factor in x direction
 * @param {number} ratio_y - scaling factor in y direction
 * @param {Rune} rune - given Rune
 * @return {Rune} resulting scaled Rune
 */
export function scale_independent(ratio_x, ratio_y, rune) {
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
export function scale(ratio, rune) {
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
export function translate(x, y, rune) {
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
 * @param {number} rad - fraction between 0 and 1
 * @param {Rune} rune - given Rune
 * @return {Rune} rotated Rune
 */
export function rotate(rad, rune) {
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
 * @param {number} frac - fraction between 0 and 1
 * @param {Rune} rune1 - given Rune
 * @param {Rune} rune2 - given Rune
 * @return {Rune} resulting Rune
 */
export function stack_frac(frac, rune1, rune2) {
  throwIfNotRune('stack_frac', rune1);
  throwIfNotRune('stack_frac', rune2);

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
export function stack(rune1, rune2) {
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
export function stackn(n, rune) {
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
export function quarter_turn_right(rune) {
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
export function quarter_turn_left(rune) {
  throwIfNotRune('quarter_turn_left', rune);
  return rotate(Math.PI / 2, rune);
}

/**
 * makes a new Rune from a given Rune
 * by turning it upside-down
 * @param {Rune} rune - given Rune
 * @return {Rune} resulting Rune
 */
export function turn_upside_down(rune) {
  throwIfNotRune('turn_upside_down', rune);
  return rotate(Math.PI, rune);
}

/**
 * makes a new Rune from two given Runes by
 * placing the first on the left of the second
 * such that the first one occupies frac
 * portion of the width of the result and
 * the second the rest
 * @param {number} frac - fraction between 0 and 1
 * @param {Rune} rune1 - given Rune
 * @param {Rune} rune2 - given Rune
 * @return {Rune} resulting Rune
 */
export function beside_frac(frac, rune1, rune2) {
  throwIfNotRune('beside_frac', rune1);
  throwIfNotRune('beside_frac', rune2);

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
export function beside(rune1, rune2) {
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
export function flip_vert(rune) {
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
export function flip_horiz(rune) {
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
export function make_cross(rune) {
  throwIfNotRune('make_cross', rune);
  return stack(
    beside(quarter_turn_right(rune), rotate(Math.PI, rune)),
    beside(rune, rotate(Math.PI / 2, rune))
  );
}

/**
 * applies a given function n times to an initial value
 * @param {number} n - a non-negative integer
 * @param {function} f - unary function from t to t
 * @param {t} initial - argument
 * @return {t} - result of n times application of
 *               f to rune: f(f(...f(f(rune))...))
 */
export function repeat_pattern(n, pattern, initial) {
  if (n === 0) {
    return initial;
  }
  return pattern(repeat_pattern(n - 1, pattern, initial));
}

// =============================================================================
// Z-axis Transformation functions
// =============================================================================

/**
 * makes a 3D-Rune from two given Runes by
 * overlaying the first with the second
 * such that the first one occupies frac
 * portion of the depth of the 3D result
 * and the second the rest
 * @param {number} frac - fraction between 0 and 1
 * @param {Rune} rune1 - given Rune
 * @param {Rune} rune2 - given Rune
 * @return {Rune} resulting Rune
 */
export function overlay_frac(frac, rune1, rune2) {
  throwIfNotRune('overlay_frac', rune1);
  throwIfNotRune('overlay_frac', rune2);

  const front = getEmptyRune();
  front.subRunes.push(rune1);
  const frontMat = front.transformMatrix;
  // z: scale by frac
  mat4.scale(frontMat, frontMat, vec3.fromValues(1, 1, frac));

  const back = getEmptyRune();
  back.subRunes.push(rune2);
  const backMat = back.transformMatrix;
  // z: scale by (1-frac), translate by -frac
  mat4.scale(
    backMat,
    mat4.translate(backMat, backMat, vec3.fromValues(0, 0, -frac)),
    vec3.fromValues(1, 1, 1 - frac)
  );

  const combined = getEmptyRune();
  combined.subRunes = [front, back]; // render front first to avoid redrawing
  return combined;
}

/**
 * makes a 3D-Rune from two given Runes by
 * overlaying the first with the second, each
 * occupying equal parts of the depth of the
 * result
 * @param {Rune} rune1 - given Rune
 * @param {Rune} rune2 - given Rune
 * @return {Rune} resulting Rune
 */
export function overlay(rune1, rune2) {
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
 * @param {number} r - red value (0.0-1.0)
 * @param {number} g - green value (0.0-1.0)
 * @param {number} b - blue value (0.0-1.0)
 * @returns {Rune} the colored Rune
 */
export function color(rune: Rune, r, g, b): Rune {
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
export function random_color(rune) {
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
export function red(rune) {
  throwIfNotRune('red', rune);
  return addColorFromHex(rune, '#F44336');
}

/**
 * colors the given rune pink.
 * @param {Rune} rune - the rune to color
 * @returns {Rune} the colored Rune
 */
export function pink(rune) {
  throwIfNotRune('pink', rune);
  return addColorFromHex(rune, '#E91E63');
}

/**
 * colors the given rune purple.
 * @param {Rune} rune - the rune to color
 * @returns {Rune} the colored Rune
 */
export function purple(rune) {
  throwIfNotRune('purple', rune);
  return addColorFromHex(rune, '#AA00FF');
}

/**
 * colors the given rune indigo.
 * @param {Rune} rune - the rune to color
 * @returns {Rune} the colored Rune
 */
export function indigo(rune) {
  throwIfNotRune('indigo', rune);
  return addColorFromHex(rune, '#3F51B5');
}

/**
 * colors the given rune blue.
 * @param {Rune} rune - the rune to color
 * @returns {Rune} the colored Rune
 */
export function blue(rune) {
  throwIfNotRune('blue', rune);
  return addColorFromHex(rune, '#2196F3');
}

/**
 * colors the given rune green.
 * @param {Rune} rune - the rune to color
 * @returns {Rune} the colored Rune
 */
export function green(rune) {
  throwIfNotRune('green', rune);
  return addColorFromHex(rune, '#4CAF50');
}

/**
 * colors the given rune yellow.
 * @param {Rune} rune - the rune to color
 * @returns {Rune} the colored Rune
 */
export function yellow(rune) {
  throwIfNotRune('yellow', rune);
  return addColorFromHex(rune, '#FFEB3B');
}

/**
 * colors the given rune orange.
 * @param {Rune} rune - the rune to color
 * @returns {Rune} the colored Rune
 */
export function orange(rune) {
  throwIfNotRune('orange', rune);
  return addColorFromHex(rune, '#FF9800');
}

/**
 * colors the given rune brown.
 * @param {Rune} rune - the rune to color
 * @returns {Rune} the colored Rune
 */
export function brown(rune) {
  throwIfNotRune('brown', rune);
  return addColorFromHex(rune, '#795548');
}

/**
 * colors the given rune black.
 * @param {Rune} rune - the rune to color
 * @returns {Rune} the colored Rune
 */
export function black(rune) {
  throwIfNotRune('black', rune);
  return addColorFromHex(rune, '#000000');
}

/**
 * colors the given rune white.
 * @param {Rune} rune - the rune to color
 * @returns {Rune} the colored Rune
 */
export function white(rune) {
  throwIfNotRune('white', rune);
  return addColorFromHex(rune, '#FFFFFF');
}

// =============================================================================
// Drawing functions
// =============================================================================

/**
 * Show the rune on the tab.
 *
 * @param rune a Rune to be drawn
 */
export function show(rune: Rune): Rune {
  throwIfNotRune('show', rune);
  return rune;
}

/**
 * turns a given Rune into an Anaglyph
 * @param {Rune} rune - given Rune
 * @return {Picture}
 * If the result of evaluating a program is an Anaglyph,
 * the REPL displays it graphically, using anaglyph
 * technology, instead of textually. Use your 3D-glasses
 * to view the Anaglyph.
 */
export function anaglyph(rune: Rune): Rune {
  throwIfNotRune('show', rune);
  const analyphRune = copyRune(rune);
  analyphRune.drawMethod = 'anaglyph';
  return analyphRune;
}

/**
 * turns a given Rune into Hollusion
 * @param {Rune} rune - given Rune
 * @return {Picture}
 * If the result of evaluating a program is a Hollusion,
 * the REPL displays it graphically, using hollusion
 * technology, instead of textually.
 */
export function hollusion(rune: Rune): Rune {
  throwIfNotRune('show', rune);
  const hollusionRune = copyRune(rune);
  hollusionRune.drawMethod = 'hollusion';
  return hollusionRune;
}
