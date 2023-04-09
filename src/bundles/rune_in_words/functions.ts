import type { Rune } from './rune';
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
} from './runes_ops';

// =============================================================================
// Basic Runes
// =============================================================================

/**
 * Rune with the shape of a full square
 *
 * @category Primitive
 */
export const square: string = getSquare();
/**
 * Rune with the shape of a blank square
 *
 * @category Primitive
 */
export const blank: string = getBlank();
/**
 * Rune with the shape of a
 * small square inside a large square,
 * each diagonally split into a
 * black and white half
 *
 * @category Primitive
 */
export const rcross: string = getRcross();
/**
 * Rune with the shape of a sail
 *
 * @category Primitive
 */
export const sail: string = getSail();
/**
 * Rune with the shape of a triangle
 *
 * @category Primitive
 */
export const triangle: string = getTriangle();
/**
 * Rune with black triangle,
 * filling upper right corner
 *
 * @category Primitive
 */
export const corner: string = getCorner();
/**
 * Rune with the shape of two overlapping
 * triangles, residing in the upper half
 * of the shape
 *
 * @category Primitive
 */
export const nova: string = getNova();
/**
 * Rune with the shape of a circle
 *
 * @category Primitive
 */
export const circle: string = getCircle();
/**
 * Rune with the shape of a heart
 *
 * @category Primitive
 */
export const heart: string = getHeart();
/**
 * Rune with the shape of a pentagram
 *
 * @category Primitive
 */
export const pentagram: string = getPentagram();
/**
 * Rune with the shape of a ribbon
 * winding outwards in an anticlockwise spiral
 *
 * @category Primitive
 */
export const ribbon: string = getRibbon();

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
export function from_url(imageUrl: string): string {
  return `url(${imageUrl})`;
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
  rune: string,
): string {
  throwIfNotRune('scale_independent', rune);
  return `scaled(${rune}, ${ratio_x}, ${ratio_y})`;
}

/**
 * Scales a given Rune by a given factor in both x and y direction
 * @param {number} ratio - Scaling factor
 * @param {Rune} rune - Given Rune
 * @return {Rune} Resulting scaled Rune
 *
 * @category Main
 */
export function scale(ratio: number, rune: string): string {
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
export function translate(x: number, y: number, rune: string): string {
  throwIfNotRune('translate', rune);
  return `translated(${rune}, ${x}, ${y})`;
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
export function rotate(rad: number, rune: string): string {
  throwIfNotRune('rotate', rune);
  return `rotated(${rune}, ${rad})`;
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
export function stack_frac(frac: number, rune1: string, rune2: string): string {
  throwIfNotRune('stack_frac', rune1);
  throwIfNotRune('stack_frac', rune2);

  return `stack_frac(${frac}, ${rune1}, ${rune2})`;
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
export function stack(rune1: string, rune2: string): string {
  throwIfNotRune('stack', rune1, rune2);
  return `stack(${rune1}, ${rune2})`;
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
export function stackn(n: number, rune: string): string {
  throwIfNotRune('stackn', rune);

  return `stackn(${n}, ${rune})`;
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
export function quarter_turn_right(rune: string): string {
  throwIfNotRune('quarter_turn_right', rune);
  return `quarter_turn_right(${rune})`;
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
export function quarter_turn_left(rune: string): string {
  throwIfNotRune('quarter_turn_left', rune);
  return `quarter_turn_left(${rune})`;
}

/**
 * Makes a new Rune from a given Rune
 * by turning it upside-down
 * @param {Rune} rune - Given Rune
 * @return {Rune} Resulting Rune
 *
 * @category Main
 */
export function turn_upside_down(rune: string): string {
  throwIfNotRune('turn_upside_down', rune);
  return `quarter_upside_down(${rune})`;
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
export function beside_frac(frac: number, rune1: string, rune2: string): string {
  throwIfNotRune('beside_frac', rune1, rune2);

  return `beside_frac(${frac}, ${rune1}, ${rune2})`;
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
export function beside(rune1: string, rune2: string): string {
  throwIfNotRune('beside', rune1, rune2);
  return `stack(${rune1}, ${rune2})`;
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
export function flip_vert(rune: string): string {
  throwIfNotRune('flip_vert', rune);
  return `flip_vert(${rune})`;
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
export function flip_horiz(rune: string): string {
  throwIfNotRune('flip_horiz', rune);
  return `flip_horiz(${rune})`;
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
export function make_cross(rune: string): string {
  throwIfNotRune('make_cross', rune);
  return stack(
    beside(quarter_turn_right(rune), turn_upside_down(rune)),
    beside(rune, quarter_turn_left(rune)),
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
  pattern: (a: string) => Rune,
  initial: string,
): string {
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
export function overlay_frac(frac: number, rune1: string, rune2: string): string {
  throwIfNotRune('overlay_frac', rune1);
  throwIfNotRune('overlay_frac', rune2);
  return `overlay_frac(${frac}, ${rune1}, ${rune2})`;
}

/**
 * The depth range of the z-axis of a rune is [0,-1], this function maps the depth range of rune1 and rune2 to [0,-0.5] and [-0.5,-1] respectively.
 * @param {Rune} rune1 - Given Rune
 * @param {Rune} rune2 - Given Rune
 * @return {Rune} Resulting Runes
 *
 * @category Main
 */
export function overlay(rune1: string, rune2: string): string {
  throwIfNotRune('overlay', rune1);
  throwIfNotRune('overlay', rune2);
  return `overlay(${rune1}, ${rune2})`;
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
export function color(rune: string, r: number, g: number, b: number): string {
  throwIfNotRune('color', rune);
  return `color(${rune}, ${r}, ${g}, ${b})`;
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
export function random_color(rune: string): string {
  throwIfNotRune('random_color', rune);
  return `random(${rune})`;
}

/**
 * Colors the given rune red (#F44336).
 * @param {Rune} rune - The rune to color
 * @returns {Rune} The colored Rune
 *
 * @category Color
 */
export function red(rune: string): string {
  throwIfNotRune('red', rune);
  return `red(${rune})`;
}

/**
 * Colors the given rune pink (#E91E63s).
 * @param {Rune} rune - The rune to color
 * @returns {Rune} The colored Rune
 *
 * @category Color
 */
export function pink(rune: string): string {
  throwIfNotRune('pink', rune);
  return `pink(${rune})`;
}

/**
 * Colors the given rune purple (#AA00FF).
 * @param {Rune} rune - The rune to color
 * @returns {Rune} The colored Rune
 *
 * @category Color
 */
export function purple(rune: string): string {
  throwIfNotRune('purple', rune);
  return `purple(${rune})`;
}

/**
 * Colors the given rune indigo (#3F51B5).
 * @param {Rune} rune - The rune to color
 * @returns {Rune} The colored Rune
 *
 * @category Color
 */
export function indigo(rune: string): string {
  throwIfNotRune('indigo', rune);
  return `indigo(${rune})`;
}

/**
 * Colors the given rune blue (#2196F3).
 * @param {Rune} rune - The rune to color
 * @returns {Rune} The colored Rune
 *
 * @category Color
 */
export function blue(rune: string): string {
  throwIfNotRune('blue', rune);
  return `blue(${rune})`;
}

/**
 * Colors the given rune green (#4CAF50).
 * @param {Rune} rune - The rune to color
 * @returns {Rune} The colored Rune
 *
 * @category Color
 */
export function green(rune: string): string {
  throwIfNotRune('green', rune);
  return `green(${rune})`;
}

/**
 * Colors the given rune yellow (#FFEB3B).
 * @param {Rune} rune - The rune to color
 * @returns {Rune} The colored Rune
 *
 * @category Color
 */
export function yellow(rune: string): string {
  throwIfNotRune('yellow', rune);
  return `yellow(${rune})`;
}

/**
 * Colors the given rune orange (#FF9800).
 * @param {Rune} rune - The rune to color
 * @returns {Rune} The colored Rune
 *
 * @category Color
 */
export function orange(rune: string): string {
  throwIfNotRune('orange', rune);
  return `orange(${rune})`;
}

/**
 * Colors the given rune brown.
 * @param {Rune} rune - The rune to color
 * @returns {Rune} The colored Rune
 *
 * @category Color
 */
export function brown(rune: string): string {
  throwIfNotRune('brown', rune);
  return `brown(${rune})`;
}

/**
 * Colors the given rune black (#000000).
 * @param {Rune} rune - The rune to color
 * @returns {Rune} The colored Rune
 *
 * @category Color
 */
export function black(rune: string): string {
  throwIfNotRune('black', rune);
  return `black(${rune})`;
}

/**
 * Colors the given rune white (#FFFFFF).
 * @param {Rune} rune - The rune to color
 * @returns {Rune} The colored Rune
 *
 * @category Color
 */
export function white(rune: string): string {
  throwIfNotRune('white', rune);
  return `white(${rune})`;
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
export function show(rune: string): string {
  throwIfNotRune('show', rune);
  return rune;
}

/**
 * Renders the specified Rune in a tab as an anaglyph. Use 3D glasses to view the
 * anaglyph.
 * @param rune - The Rune to render
 * @return {Rune} The specified Rune
 *
 * @category Main
 */
export function anaglyph(rune: string): string {
  throwIfNotRune('anaglyph', rune);
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
export function hollusion(rune: string): string {
  throwIfNotRune('hollusion', rune);
  return rune;
}
