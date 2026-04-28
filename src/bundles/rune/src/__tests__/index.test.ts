import { stringify } from 'js-slang/dist/utils/stringify';
import { describe, expect, it, test, vi } from 'vitest';
import * as display from '../display';
import * as funcs from '../functions';
import type { Rune } from '../rune';

describe(display.anaglyph, () => {
  it('throws when argument is not rune', () => {
    expect(() => display.anaglyph(0 as any)).toThrow('anaglyph: Expected Rune, got 0.');
  });

  it('returns the rune passed to it', () => {
    expect(display.anaglyph(funcs.heart)).toBe(funcs.heart);
  });
});

describe(display.hollusion, () => {
  it('throws when argument is not rune', () => {
    expect(() => display.hollusion(0 as any)).toThrow('hollusion: Expected Rune, got 0.');
  });

  it('returns the rune passed to it', () => {
    expect(display.hollusion(funcs.heart)).toBe(funcs.heart);
  });
});

describe(display.show, () => {
  it('throws when argument is not rune', () => {
    expect(() => display.show(0 as any)).toThrow('show: Expected Rune, got 0.');
  });

  it('returns the rune passed to it', () => {
    expect(display.show(funcs.heart)).toBe(funcs.heart);
  });
});

describe('Hollusion Rune tests', () => {
  it('has isHollusion as true', () => {
    const hollusion = new funcs.DrawnHollusionRune(funcs.blank, 0);
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
    expect(() => funcs.color(0 as any, 0, 0, 0)).toThrow('color: Expected Rune, got 0.');
  });

  it('throws when any color parameter is invalid', () => {
    expect(() => funcs.color(funcs.heart, 100, 0, 0)).toThrow('color: Expected number between 0 and 1 for r, got 100.');
    expect(() => funcs.color(funcs.heart, 0, -1, 0)).toThrow('color: Expected number between 0 and 1 for g, got -1.');
    expect(() => funcs.color(funcs.heart, 0, 0, 'hi' as any)).toThrow('color: Expected number between 0 and 1 for b, got "hi".');
  });
});

describe(funcs.beside_frac, () => {
  it('throws when argument is not rune', () => {
    expect(() => funcs.beside_frac(0, 0 as any, funcs.heart)).toThrow('beside_frac: Expected Rune for rune1, got 0.');
    expect(() => funcs.beside_frac(0, funcs.heart, 0 as any)).toThrow('beside_frac: Expected Rune for rune2, got 0.');
  });

  it('throws when frac is out of range', () => {
    expect(() => funcs.beside_frac(-1, funcs.heart, funcs.heart)).toThrow('beside_frac: Expected number between 0 and 1 for frac, got -1.');
    expect(() => funcs.beside_frac(10, funcs.heart, funcs.heart)).toThrow('beside_frac: Expected number between 0 and 1 for frac, got 10.');
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
    expect(() => funcs.stack_frac(0, 0 as any, funcs.heart)).toThrow('stack_frac: Expected Rune for rune1, got 0.');
    expect(() => funcs.stack_frac(0, funcs.heart, 0 as any)).toThrow('stack_frac: Expected Rune for rune2, got 0.');
  });

  it('throws when frac is out of range', () => {
    expect(() => funcs.stack_frac(-1, funcs.heart, funcs.heart)).toThrow('stack_frac: Expected number between 0 and 1 for frac, got -1.');
    expect(() => funcs.stack_frac(10, funcs.heart, funcs.heart)).toThrow('stack_frac: Expected number between 0 and 1 for frac, got 10.');
  });
});

describe(funcs.stackn, () => {
  vi.spyOn(funcs.RuneFunctions, 'stack_frac');

  it('throws when argument is not rune', () => {
    expect(() => funcs.stackn(0, 0 as any)).toThrow('stackn: Expected Rune, got 0.');
  });

  it('throws when n is not an integer', () => {
    expect(() => funcs.stackn(0.1, funcs.heart)).toThrow('stackn: Expected integer, got 0.1.');
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
    const mockPattern = vi.fn(x => x);
    expect(funcs.repeat_pattern(0, mockPattern, funcs.blank)).toBe(funcs.blank);
    expect(mockPattern).not.toHaveBeenCalled();
  });

  it('works', () => {
    const mockPattern = vi.fn(x => x);
    expect(funcs.repeat_pattern(5, mockPattern, funcs.blank)).toBe(funcs.blank);
    expect(mockPattern).toHaveBeenCalledTimes(5);
  });

  it('throws if initial is not a rune', () => {
    expect(() => funcs.repeat_pattern(5, x => x, 0 as any))
      .toThrowError('repeat_pattern: Expected Rune for initial, got 0.');
  });
});

describe(funcs.overlay_frac, () => {
  it('throws when argument is not rune', () => {
    expect(() => funcs.overlay_frac(0, 0 as any, funcs.heart)).toThrow('overlay_frac: Expected Rune for rune1, got 0.');
    expect(() => funcs.overlay_frac(0, funcs.heart, 0 as any)).toThrow('overlay_frac: Expected Rune for rune2, got 0.');
  });

  it('throws when frac is out of range', () => {
    expect(() => funcs.overlay_frac(-1, funcs.heart, funcs.heart)).toThrow('overlay_frac: Expected number between 0 and 1 for frac, got -1.');
    expect(() => funcs.overlay_frac(10, funcs.heart, funcs.heart)).toThrow('overlay_frac: Expected number between 0 and 1 for frac, got 10.');
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
      expect(() => f(0 as any)).toThrow(`${f.name}: Expected Rune, got 0.`);
    });

    it('does not modify the original rune', () => {
      const newRune = f(funcs.blank);
      expect(newRune).not.toBe(funcs.blank);
      expect(funcs.blank.colors).toBeNull();
      expect(newRune.colors).not.toBeNull();
    });
  });
});
