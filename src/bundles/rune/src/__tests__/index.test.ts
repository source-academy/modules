import { stringify } from 'js-slang/dist/utils/stringify';
import { describe, expect, it, test, vi } from 'vitest';
import * as display from '../display';
import * as funcs from '../functions';
import type { Rune } from '../rune';

describe(display.anaglyph, () => {
  it('throws when argument is not rune', () => {
    expect(() => display.anaglyph(0 as any)).toThrowError('anaglyph expects a rune as argument');
  });

  it('returns the rune passed to it', () => {
    expect(display.anaglyph(funcs.heart)).toBe(funcs.heart);
  });
});

describe(display.hollusion, () => {
  it('throws when argument is not rune', () => {
    expect(() => display.hollusion(0 as any)).toThrowError('hollusion expects a rune as argument');
  });

  it('returns the rune passed to it', () => {
    expect(display.hollusion(funcs.heart)).toBe(funcs.heart);
  });
});

describe(display.show, () => {
  it('throws when argument is not rune', () => {
    expect(() => display.show(0 as any)).toThrowError('show expects a rune as argument');
  });

  it('returns the rune passed to it', () => {
    expect(display.show(funcs.heart)).toBe(funcs.heart);
  });
});

describe('Hollusion Rune tests', () => {
  it('has isHollusion as true', () => {
    const hollusion = new funcs.HollusionRune(funcs.blank, 0);
    expect(hollusion.isHollusion).toEqual(true);
  });
});

test('rune toString representation is nice', () => {
  expect(stringify(funcs.rcross)).toEqual('<Rune>');
});

describe(funcs.color, () => {
  it('creates a new rune with alpha value of 1', () => {
    const newRune = funcs.color(funcs.heart, 1, 0, 0);

    expect(newRune).not.toBe(funcs.heart);
    expect(newRune.colors).not.toBeNull();
    expect(newRune.colors![3]).toEqual(1);
  });

  it('throws when argument is not rune', () => {
    expect(() => funcs.color(0 as any, 0, 0, 0)).toThrowError('color expects a rune as argument');
  });

  it('throws when any color parameter is invalid', () => {
    expect(() => funcs.color(funcs.heart, 100, 0, 0)).toThrowError('r cannot be greater than 1!');
    expect(() => funcs.color(funcs.heart, 0, -1, 0)).toThrowError('g cannot be less than 0!');
    expect(() => funcs.color(funcs.heart, 0, 0, 'hi' as any)).toThrowError('b must be a number!');
  });
});

describe(funcs.beside_frac, () => {
  it('throws when argument is not rune', () => {
    expect(() => funcs.beside_frac(0, 0 as any, funcs.heart)).toThrowError('beside_frac expects a rune as argument');
    expect(() => funcs.beside_frac(0, funcs.heart, 0 as any)).toThrowError('beside_frac expects a rune as argument');
  });

  it('throws when frac is out of range', () => {
    expect(() => funcs.beside_frac(-1, funcs.heart, funcs.heart)).toThrowError('beside_frac: frac cannot be less than 0!');
    expect(() => funcs.beside_frac(10, funcs.heart, funcs.heart)).toThrowError('beside_frac: frac cannot be greater than 1!');
  });
});

describe(funcs.beside, () => {
  vi.spyOn(funcs.RuneFunctions, 'beside_frac');

  it('calls beside_frac', () => {
    funcs.beside(funcs.heart, funcs.heart);
    expect(funcs.RuneFunctions.beside_frac).toHaveBeenCalledExactlyOnceWith(0.5, funcs.heart, funcs.heart);
  });
});

describe(funcs.stack_frac, () => {
  it('throws when argument is not rune', () => {
    expect(() => funcs.stack_frac(0, 0 as any, funcs.heart)).toThrowError('stack_frac expects a rune as argument');
    expect(() => funcs.stack_frac(0, funcs.heart, 0 as any)).toThrowError('stack_frac expects a rune as argument');
  });

  it('throws when frac is out of range', () => {
    expect(() => funcs.stack_frac(-1, funcs.heart, funcs.heart)).toThrowError('stack_frac: frac cannot be less than 0!');
    expect(() => funcs.stack_frac(10, funcs.heart, funcs.heart)).toThrowError('stack_frac: frac cannot be greater than 1!');
  });
});

describe(funcs.stackn, () => {
  vi.spyOn(funcs.RuneFunctions, 'stack_frac');

  it('throws when argument is not rune', () => {
    expect(() => funcs.stackn(0, 0 as any)).toThrowError('stackn expects a rune as argument');
  });

  it('throws when n is not an integer', () => {
    expect(() => funcs.stackn(0.1, funcs.heart)).toThrowError('stackn expects an integer');
  });

  it('simply returns when n <= 1', () => {
    expect(funcs.stackn(1, funcs.heart)).toBe(funcs.heart);
    expect(funcs.stackn(0, funcs.heart)).toBe(funcs.heart);
    expect(funcs.stackn(-1, funcs.heart)).toBe(funcs.heart);
  });

  it('calls stack_frac appropriately', () => {
    funcs.stackn(5, funcs.heart);
    expect(funcs.RuneFunctions.stack_frac).toHaveBeenCalledTimes(4);
  });
});

describe(funcs.repeat_pattern, () => {
  it('simply returns if n <= 0', () => {
    const mockPattern = vi.fn();
    expect(funcs.repeat_pattern(0, mockPattern, funcs.blank)).toBe(funcs.blank);
    expect(mockPattern).not.toHaveBeenCalled();
  });
});

describe(funcs.overlay_frac, () => {
  it('throws when argument is not rune', () => {
    expect(() => funcs.overlay_frac(0, 0 as any, funcs.heart)).toThrowError('overlay_frac expects a rune as argument');
    expect(() => funcs.overlay_frac(0, funcs.heart, 0 as any)).toThrowError('overlay_frac expects a rune as argument');
  });

  it('throws when frac is out of range', () => {
    expect(() => funcs.overlay_frac(-1, funcs.heart, funcs.heart)).toThrowError('overlay_frac: frac cannot be less than 0!');
    expect(() => funcs.overlay_frac(10, funcs.heart, funcs.heart)).toThrowError('overlay_frac: frac cannot be greater than 1!');
  });
});

describe('Colouring functions', () => {
  const names = Object.getOwnPropertyNames(funcs.RuneColours);
  const colourers = names.reduce<[string, (r: Rune) => Rune][]>((res, name) => {
    if (typeof funcs.RuneColours[name] !== 'function') return res;
    return [...res, [name, funcs.RuneColours[name]]];
  }, []);

  describe.each(colourers)('%s', (_, f) => {
    it('throws when argument is not rune', () => {
      expect(() => f(0 as any)).toThrowError(`${f.name} expects a rune as argument`);
    });

    it('does not modify the original rune', () => {
      const newRune = f(funcs.blank);
      expect(newRune).not.toBe(funcs.blank);
      expect(funcs.blank.colors).toBeNull();
      expect(newRune.colors).not.toBeNull();
    });
  });
});
