import { ModuleContexts, ModuleParams } from '../../typings/type_helpers.js';
import {
  anaglyph,
  beside,
  beside_frac,
  black,
  blank,
  blue,
  brown,
  circle,
  color,
  corner,
  drawnRunes,
  flip_horiz,
  flip_vert,
  from_url,
  green,
  heart,
  hollusion,
  hollusion_magnitude,
  indigo,
  make_cross,
  nova,
  orange,
  overlay,
  overlay_frac,
  pentagram,
  pink,
  purple,
  quarter_turn_left,
  quarter_turn_right,
  random_color,
  rcross,
  red,
  repeat_pattern,
  ribbon,
  rotate,
  sail,
  scale,
  scale_independent,
  show,
  square,
  stack,
  stackn,
  stack_frac,
  translate,
  triangle,
  turn_upside_down,
  white,
  yellow,
} from './functions';
import { RunesModuleState } from './types';

/**
 * Bundle for Source Academy Runes module
 * @author Hou Ruomu
 */

export default function runes(
  moduleParams: ModuleParams,
  moduleContexts: ModuleContexts
) {
  // Update the module's global context
  let moduleContext = moduleContexts.get('rune');

  if (!moduleContext) {
    moduleContext = {
      tabs: [],
      state: {
        drawnRunes,
      },
    };

    moduleContexts.set('rune', moduleContext);
  } else if (!moduleContext.state) {
    moduleContext.state = {
      drawnRunes,
    };
  } else {
    (moduleContext.state as RunesModuleState).drawnRunes = drawnRunes;
  }

  return {
    square,
    blank,
    rcross,
    sail,
    triangle,
    corner,
    nova,
    circle,
    heart,
    pentagram,
    ribbon,

    from_url,

    scale_independent,
    scale,
    translate,
    rotate,
    stack_frac,
    stack,
    stackn,
    quarter_turn_left,
    quarter_turn_right,
    turn_upside_down,
    beside_frac,
    beside,
    flip_vert,
    flip_horiz,
    make_cross,
    repeat_pattern,

    overlay_frac,
    overlay,

    color,
    random_color,
    red,
    pink,
    purple,
    indigo,
    blue,
    green,
    yellow,
    orange,
    brown,
    black,
    white,

    show,
    anaglyph,
    hollusion_magnitude,
    hollusion,
  };
}
