import { DESCRIPTION_VERSION, fn, fun, opaque, type ModuleDescription } from '@sourceacademy/modules-lib/description';

const Rune = opaque('Rune');
const AnimatedRune = opaque('AnimatedRune');

/**
 * The types of the functions and shapes that the `rune` module exports, for typed languages (#996, #997).
 * An animation (`animate_rune`, `animate_anaglyph`) is an `AnimatedRune`, not a `Rune`: no rune function takes one
 * (the plugin's `@publicReturnType`s say which). `show`, `anaglyph`, `hollusion`, `hollusion_magnitude`, `animate_rune` and `animate_anaglyph` are defined
 * on the plugin, and the shapes are exported when the plugin is initialised, so this is the list of what
 * `plugin.exports` has then (checked in `description.test.ts`).
 */
export const description: ModuleDescription = {
  version: DESCRIPTION_VERSION,
  module: 'rune',
  opaqueTypes: ['Rune', 'AnimatedRune'],
  functions: [
    fn('anaglyph', [['rune', Rune]], Rune),
    fn('animate_anaglyph', [['duration', 'number'], ['fps', 'number'], ['func', fun(['number'], Rune)]], AnimatedRune),
    fn('animate_rune', [['duration', 'number'], ['fps', 'number'], ['func', fun(['number'], Rune)]], AnimatedRune),
    fn('beside', [['rune1', Rune], ['rune2', Rune]], Rune),
    fn('beside_frac', [['frac', 'number'], ['rune1', Rune], ['rune2', Rune]], Rune),
    fn('black', [['rune', Rune]], Rune),
    fn('blue', [['rune', Rune]], Rune),
    fn('brown', [['rune', Rune]], Rune),
    fn('color', [['rune', Rune], ['r', 'number'], ['g', 'number'], ['b', 'number']], Rune),
    fn('colour_with_hue', [['rune', Rune], ['hue', 'number']], Rune),
    fn('flip_horiz', [['rune', Rune]], Rune),
    fn('flip_vert', [['rune', Rune]], Rune),
    fn('from_url', [['imageUrl', 'string']], Rune),
    fn('green', [['rune', Rune]], Rune),
    fn('hollusion', [['rune', Rune]], Rune),
    fn('hollusion_magnitude', [['rune', Rune], ['magnitude', 'number']], Rune),
    fn('indigo', [['rune', Rune]], Rune),
    fn('make_cross', [['rune', Rune]], Rune),
    fn('orange', [['rune', Rune]], Rune),
    fn('overlay', [['rune1', Rune], ['rune2', Rune]], Rune),
    fn('overlay_frac', [['frac', 'number'], ['rune1', Rune], ['rune2', Rune]], Rune),
    fn('pink', [['rune', Rune]], Rune),
    fn('purple', [['rune', Rune]], Rune),
    fn('quarter_turn_left', [['rune', Rune]], Rune),
    fn('quarter_turn_right', [['rune', Rune]], Rune),
    fn('random_color', [['rune', Rune]], Rune),
    fn('red', [['rune', Rune]], Rune),
    fn('rotate', [['rad', 'number'], ['rune', Rune]], Rune),
    fn('scale', [['ratio', 'number'], ['rune', Rune]], Rune),
    fn('scale_independent', [['ratio_x', 'number'], ['ratio_y', 'number'], ['rune', Rune]], Rune),
    fn('show', [['rune', Rune]], Rune),
    fn('stack', [['rune1', Rune], ['rune2', Rune]], Rune),
    fn('stack_frac', [['frac', 'number'], ['rune1', Rune], ['rune2', Rune]], Rune),
    fn('stackn', [['n', 'integer'], ['rune', Rune]], Rune),
    fn('translate', [['x', 'number'], ['y', 'number'], ['rune', Rune]], Rune),
    fn('turn_upside_down', [['rune', Rune]], Rune),
    fn('white', [['rune', Rune]], Rune),
    fn('yellow', [['rune', Rune]], Rune),
  ],
  constants: [
    { name: 'blank', type: Rune },
    { name: 'circle', type: Rune },
    { name: 'corner', type: Rune },
    { name: 'heart', type: Rune },
    { name: 'nova', type: Rune },
    { name: 'pentagram', type: Rune },
    { name: 'rcross', type: Rune },
    { name: 'ribbon', type: Rune },
    { name: 'sail', type: Rune },
    { name: 'square', type: Rune },
    { name: 'triangle', type: Rune },
  ]
};
