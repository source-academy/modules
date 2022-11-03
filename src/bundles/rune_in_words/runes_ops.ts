/**
 * This file contains the bundle's private functions for runes.
 */
import { Rune } from './rune';

// =============================================================================
// Utility Functions
// =============================================================================
export function throwIfNotRune(name, ...runes) {
  runes.forEach((rune) => {
    if (!(typeof rune === 'string')) {
      throw Error(`${name} expects a rune as argument.`);
    }
  });
}

// =============================================================================
// Basic Runes
// =============================================================================

/**
 * primitive Rune in the rune of a full square
 * */
export const getSquare: () => Rune = () => 'square';

export const getBlank: () => Rune = () => 'blank';

export const getRcross: () => Rune = () => 'rcross';

export const getSail: () => Rune = () => 'sail';

export const getTriangle: () => Rune = () => 'triangle';

export const getCorner: () => Rune = () => 'corner';

export const getNova: () => Rune = () => 'nova';

export const getCircle: () => Rune = () => 'circle';

export const getHeart: () => Rune = () => 'heart';

export const getPentagram: () => Rune = () => 'pentagram';

export const getRibbon: () => Rune = () => 'ribbon';

// =============================================================================
// Coloring Functions
// =============================================================================
// black and white not included because they are boring colors
// colorPalette is used in generateFlattenedRuneList to generate a random color
export const colorPalette = [
  '#F44336',
  '#E91E63',
  '#AA00FF',
  '#3F51B5',
  '#2196F3',
  '#4CAF50',
  '#FFEB3B',
  '#FF9800',
  '#795548',
];

export function addColorFromHex(rune, hex) {
  throwIfNotRune('addColorFromHex', rune);
  return 'color(' + rune + ', ' + hex + ')';
}
