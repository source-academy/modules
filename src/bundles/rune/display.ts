import context from 'js-slang/context';
import { AnaglyphRune, HollusionRune } from './functions';
import { type DrawnRune, AnimatedRune, type Rune, NormalRune, type RuneAnimation } from './rune';
import { throwIfNotRune } from './runes_ops';

// =============================================================================
// Drawing functions
// =============================================================================

const drawnRunes: (AnimatedRune | DrawnRune)[] = [];
context.moduleContexts.rune.state = {
  drawnRunes
};

class RuneDisplay {
  /**
   * Renders the specified Rune in a tab as a basic drawing.
   * @param rune - The Rune to render
   * @return {Rune} The specified Rune
   *
   * @category Main
   */
  static show(rune: Rune): Rune {
    throwIfNotRune(RuneDisplay.show.name, rune);
    drawnRunes.push(new NormalRune(rune));
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
  static anaglyph(rune: Rune): Rune {
    throwIfNotRune(RuneDisplay.anaglyph.name, rune);
    drawnRunes.push(new AnaglyphRune(rune));
    return rune;
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
  static hollusion_magnitude(rune: Rune, magnitude: number): Rune {
    throwIfNotRune(RuneDisplay.hollusion_magnitude.name, rune);
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
  static hollusion(rune: Rune): Rune {
    throwIfNotRune(RuneDisplay.hollusion.name, rune);
    return RuneDisplay.hollusion_magnitude(rune, 0.1);
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
  static animate_rune(duration: number, fps: number, func: RuneAnimation) {
    const anim = new AnimatedRune(duration, fps, (n) => {
      const rune = func(n);
      throwIfNotRune(RuneDisplay.animate_rune.name, rune);
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
  static animate_anaglyph(duration: number, fps: number, func: RuneAnimation) {
    const anim = new AnimatedRune(duration, fps, (n) => {
      const rune = func(n);
      throwIfNotRune(RuneDisplay.animate_anaglyph.name, rune);
      return new AnaglyphRune(rune);
    });
    drawnRunes.push(anim);
    return anim;
  }
}

export const show = RuneDisplay.show;
export const anaglyph = RuneDisplay.anaglyph;
export const hollusion = RuneDisplay.hollusion;
export const animate_rune = RuneDisplay.animate_rune;
export const animate_anaglyph = RuneDisplay.animate_anaglyph;
