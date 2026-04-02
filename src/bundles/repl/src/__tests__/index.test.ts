import * as slang from 'js-slang';
import { pair } from 'js-slang/dist/stdlib/list';
import { stringify } from 'js-slang/dist/utils/stringify';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as funcs from '../functions';
import { ProgrammableRepl } from '../programmable_repl';

const repl = funcs.INSTANCE;
const tabRerender = vi.fn(() => {});

repl.tabRerenderer = tabRerender;

vi.spyOn(repl, 'easterEggFunction');

beforeEach(() => {
  repl.outputStrings.splice(0, repl.outputStrings.length);
  repl.evalFunction = null;
  repl.customizedEditorProps = {
    backgroundImageUrl: null,
    backgroundColorAlpha: 1,
    fontSize: 17
  };

  tabRerender.mockClear();
});

describe(ProgrammableRepl, () => {
  it('calls js-slang when default_js_slang is the evaluator', async () => {
    vi.spyOn(slang, 'runInContext').mockResolvedValueOnce({
      status: 'error',
      context: {} as any
    });

    repl.InvokeREPL_Internal(funcs.default_js_slang);
    await repl.runCode('display();', slang.createContext());

    expect(slang.runInContext).toHaveBeenCalledOnce();
    expect(tabRerender).toHaveBeenCalledOnce();
  });

  it('calls the evaluator when another evaluator is provided', async () => {
    const evaller = vi.fn(() => 0);
    repl.InvokeREPL_Internal(evaller);
    await repl.runCode('display();', {} as any);

    expect(evaller).toHaveBeenCalledOnce();
    expect(tabRerender).toHaveBeenCalledOnce();
  });

  it('calls the easter egg function when no evaluator is provided', async () => {
    await repl.runCode('display();', {} as any);

    expect(repl.easterEggFunction).toHaveBeenCalledOnce();
    expect(tabRerender).toHaveBeenCalledOnce();
  });

  describe(funcs.rich_repl_display, () => {
    it('works when passed a string', () => {
      expect(() => funcs.rich_repl_display('test')).not.toThrow();
      expect(repl.outputStrings).toEqual([{
        content: '<span style="">test</span>',
        color: '',
        outputMethod: 'richtext'
      }]);
    });

    it('works when passed a pair', () => {
      expect(() => funcs.rich_repl_display(pair('test', 'clrt#112233'))).not.toThrow();
      expect(repl.outputStrings).toEqual([{
        content: '<span style="color:#112233;">test</span>',
        color: '',
        outputMethod: 'richtext'
      }]);
    });

    it('works when passed multiple pairs', () => {
      expect(() => funcs.rich_repl_display(
        pair(pair('test', 'clrt#112233'), 'bold')
      )).not.toThrow();

      expect(repl.outputStrings).toEqual([
        {
          content: '<span style="font-weight:bold;color:#112233;">test</span>',
          color: '',
          outputMethod: 'richtext'
        }
      ]);
    });

    it('throws an error when not passed proper content', () => {
      expect(() => funcs.rich_repl_display(0 as any)).toThrow();
      expect(() => funcs.rich_repl_display(pair(0, 0) as any)).toThrow();
    });

    it('throws an error when given an invalid colour directive', () => {
      expect(() => funcs.rich_repl_display(pair('test', 'clrx#112233'))).toThrow('rich_repl_display: Unknown colour type "clrx".');
      expect(() => funcs.rich_repl_display(pair('test', 'clrt#gggggg')))
        .toThrow('rich_repl_display: Invalid html colour string "#gggggg". It should start with # and followed by 6 characters representing a hex number.');
    });
  });
});

describe(funcs.default_js_slang, () => {
  it('default_js_slang throws when called', () => {
    expect(() => funcs.default_js_slang(''))
      .toThrow('Invaild Call: Function "default_js_slang" can not be directly called by user\'s code in editor. You should use it as the parameter of the function "set_evaluator"');
  });
});

describe(funcs.set_evaluator, () => {
  it('returns a value that indicates that the repl is initialized', () => {
    const f = (_t: string) => 0;
    expect(stringify(funcs.set_evaluator(f))).toEqual('<Programmable Repl Initialized>');
    expect(repl.evalFunction).toBe(f);
  });

  it('throws when the parameter isn\'t a function', () => {
    expect(() => funcs.set_evaluator(0 as any))
      .toThrow('set_evaluator: Expected function with 1 parameter, got 0.');
  });
});

describe(funcs.set_background_image, () => {
  it('sets the background image and alpha', () => {
    funcs.set_background_image('https://example.com/image.png', 0.5);
    expect(repl.customizedEditorProps.backgroundImageUrl).toBe('https://example.com/image.png');
    expect(repl.customizedEditorProps.backgroundColorAlpha).toBe(0.5);
  });

  it('throws when the alpha is out of range', () => {
    expect(() => funcs.set_background_image('https://example.com/image.png', -0.1))
      .toThrow('set_background_image: Expected number between 0 and 1 for background_color_alpha, got -0.1.');

    expect(() => funcs.set_background_image('https://example.com/image.png', 1.5))
      .toThrow('set_background_image: Expected number between 0 and 1 for background_color_alpha, got 1.5.');
  });

  it('throws when the image url isn\'t a string', () => {
    expect(() => funcs.set_background_image(0 as any, 0.5))
      .toThrow('set_background_image: Expected string for img_url, got 0.');
  });
});

describe(funcs.set_font_size, () => {
  it('sets the font size', () => {
    funcs.set_font_size(20);
    expect(repl.customizedEditorProps.fontSize).toBe(20);
  });

  it('throws when the font size is invalid', () => {
    expect(() => funcs.set_font_size(-1))
      .toThrow('set_font_size: Expected integer greater than 0, got -1.');

    expect(() => funcs.set_font_size(0.5))
      .toThrow('set_font_size: Expected integer greater than 0, got 0.5.');

    expect(() => funcs.set_font_size('invalid' as any))
      .toThrow('set_font_size: Expected integer greater than 0, got "invalid".');
  });
});
