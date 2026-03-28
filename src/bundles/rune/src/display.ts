import context from 'js-slang/context';
import { AnaglyphRune, HollusionRune } from './functions';
import { AnimatedRune, NormalRune, Rune, type DrawnRune, type RuneAnimation } from './rune';
import { throwIfNotRune } from './runes_ops';
import { functionDeclaration } from './type_map';

// =============================================================================
// Drawing functions
// =============================================================================

const drawnRunes: (AnimatedRune | DrawnRune)[] = [];
context.moduleContexts.rune.state = {
  drawnRunes
};

class RuneDisplay {
  @functionDeclaration('rune: Rune', 'Rune')
  static show(rune: Rune): Rune {
    throwIfNotRune(RuneDisplay.show.name, rune);
    drawnRunes.push(new NormalRune(rune));
    return rune;
  }

  @functionDeclaration('rune: Rune', 'Rune')
  static anaglyph(rune: Rune): Rune {
    throwIfNotRune(RuneDisplay.anaglyph.name, rune);
    drawnRunes.push(new AnaglyphRune(rune));
    return rune;
  }

  @functionDeclaration('rune: Rune, magnitude: number', 'Rune')
  static hollusion_magnitude(rune: Rune, magnitude: number): Rune {
    throwIfNotRune(RuneDisplay.hollusion_magnitude.name, rune);
    drawnRunes.push(new HollusionRune(rune, magnitude));
    return rune;
  }

  @functionDeclaration('rune: Rune', 'Rune')
  static hollusion(rune: Rune): Rune {
    throwIfNotRune(RuneDisplay.hollusion.name, rune);
    return RuneDisplay.hollusion_magnitude(rune, 0.1);
  }

  @functionDeclaration('duration: number, fps: number, func: RuneAnimation', 'AnimatedRune')
  static animate_rune(duration: number, fps: number, func: RuneAnimation) {
    const anim = new AnimatedRune(duration, fps, (n) => {
      const rune = func(n);
      throwIfNotRune(RuneDisplay.animate_rune.name, rune);
      return new NormalRune(rune);
    });
    drawnRunes.push(anim);
    return anim;
  }

  @functionDeclaration('duration: number, fps: number, func: RuneAnimation', 'AnimatedRune')
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

/**
 * Renders the specified Rune in a tab as a basic drawing.
 * @function
 * @param rune - The Rune to render
 * @returns {Rune} The specified Rune
 *
 * @category Main
 */
export const show = RuneDisplay.show;

/**
 * Renders the specified Rune in a tab as an anaglyph. Use 3D glasses to view the
 * anaglyph.
 * @function
 * @param rune - The Rune to render
 * @returns {Rune} The specified Rune
 *
 * @category Main
 */
export const anaglyph = RuneDisplay.anaglyph;

/**
 * Renders the specified Rune in a tab as a hollusion, with a default magnitude
 * of 0.1.
 * @function
 * @param rune - The Rune to render
 * @returns {Rune} The specified Rune
 *
 * @category Main
 */
export const hollusion = RuneDisplay.hollusion;

/**
 * Renders the specified Rune in a tab as a hollusion, using the specified
 * magnitude.
 * @function
 * @param rune - The Rune to render
 * @param {number} magnitude - The hollusion's magnitude
 * @returns {Rune} The specified Rune
 *
 * @category Main
 */
export const hollusion_magnitude = RuneDisplay.hollusion_magnitude;

/**
 * Create an animation of runes
 * @function
 * @param duration Duration of the entire animation in seconds
 * @param fps Duration of each frame in frames per seconds
 * @param func Takes in the timestamp and returns a Rune to draw
 * @returns A rune animation
 *
 * @category Main
 */
export const animate_rune = RuneDisplay.animate_rune;

/**
 * Create an animation of anaglyph runes
 * @function
 * @param duration Duration of the entire animation in seconds
 * @param fps Duration of each frame in frames per seconds
 * @param func Takes in the timestamp and returns a Rune to draw
 * @returns A rune animation
 *
 * @category Main
 */
export const animate_anaglyph = RuneDisplay.animate_anaglyph;
