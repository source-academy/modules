/* [Imports] */
import type { AlphaColor, Color } from '@sourceacademy/bundle-csg/jscad/types';
import { hexToColor } from '@sourceacademy/modules-lib/utilities';

/* [Exports] */
export function colorToAlphaColor(
  color: Color,
  opacity: number = 1
): AlphaColor {
  return [...color, opacity];
}

export function hexToAlphaColor(hex: string): AlphaColor {
  return colorToAlphaColor(hexToColor(hex));
}
