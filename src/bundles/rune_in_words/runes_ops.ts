// =============================================================================
// Utility Functions
// =============================================================================
export function throwIfNotRune(name: string, ...runes: any) {
  runes.forEach((rune) => {
    if (!(typeof rune === 'string')) {
      throw Error(`${name} expects a rune (string) as argument.`);
    }
  });
}

// =============================================================================
// Basic Runes
// =============================================================================

/**
 * primitive Rune in the rune of a full square
 * */
export const getSquare: () => string = () => 'square';

export const getBlank: () => string = () => 'blank';

export const getRcross: () => string = () => 'rcross';

export const getSail: () => string = () => 'sail';

export const getTriangle: () => string = () => 'triangle';

export const getCorner: () => string = () => 'corner';

export const getNova: () => string = () => 'nova';

export const getCircle: () => string = () => 'circle';

export const getHeart: () => string = () => 'heart';

export const getPentagram: () => string = () => 'pentagram';

export const getRibbon: () => string = () => 'ribbon';

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
  return `color(${rune}, ${hex})`;
}
