import { Channel } from '@sourceacademy/conductor/conduit';
import { DataType } from '@sourceacademy/conductor/types';
import { RENDER_THUMBNAIL_SYMBOL } from '@sourceacademy/modules-lib/conductor/thumbnail';
import { stringify } from 'js-slang/dist/utils/stringify';
import { afterEach, describe, expect, it, test, vi } from 'vitest';
import RuneModulePlugin from '..';
import * as funcs from '../functions';
import { RUNE_CHANNEL_ID, RUNE_TAB_NAME, type RuneChannelMessage } from '../protocol';
import type { Rune } from '../rune';

function makeChannelEvaluator() {
  const store: unknown[] = [];
  return {
    hasDataInterface: true as const,
    closure_make: vi.fn(async (sig, func, dependsOn) => ({
      type: DataType.CLOSURE,
      value: { sig, dependsOn, func }
    })),
    opaque_make: vi.fn(async value => {
      store.push(value);
      return {
        type: DataType.OPAQUE,
        value: store.length - 1
      };
    }),
    opaque_get: vi.fn(async (value: { value: number }) => store[value.value])
  };
}

function waitForChannelMessages() {
  return new Promise(resolve => setTimeout(resolve, 50));
}

function createRunePlugin(tabs: string[] = []) {
  const sentMessages: unknown[] = [];
  let subscriber: (message: RuneChannelMessage) => void = () => {};
  const channel = {
    send: vi.fn(message => sentMessages.push(message)),
    subscribe: vi.fn((newSubscriber: (message: RuneChannelMessage) => void) => {
      subscriber = newSubscriber;
    }),
    unsubscribe: vi.fn(),
    close: vi.fn(),
    name: 'rune-test-channel'
  };
  const evaluator = {
    hasDataInterface: true,
    closure_make: vi.fn(async (sig, func, dependsOn) => ({
      type: DataType.CLOSURE,
      value: { sig, dependsOn, func }
    })),
    opaque_make: vi.fn(async value => ({
      type: DataType.OPAQUE,
      value
    })),
    opaque_get: vi.fn(async value => value.value)
  };
  const tabLoader = {
    tabs,
    loadTab: vi.fn()
  };
  const plugin = new RuneModulePlugin({} as any, [channel] as any, evaluator as any, tabLoader);

  return {
    channel,
    evaluator,
    plugin,
    sentMessages,
    tabLoader,
    requestTab: () => subscriber({ type: 'request' })
  };
}

describe(RuneModulePlugin, () => {
  test('exported methods stay bound when called by a Conductor closure', async () => {
    const { evaluator, plugin, sentMessages, requestTab } = createRunePlugin();

    await plugin.initialise();

    const showExport = plugin.exports.find(each => each.symbol === 'show')!;
    const closureObject = showExport.value.value as unknown as {
      func: (rune: Awaited<ReturnType<typeof evaluator.opaque_make>>) => AsyncGenerator<void, unknown, unknown>;
    };
    const runeValue = await evaluator.opaque_make(funcs.blank);
    const result = await closureObject.func.call(closureObject, runeValue).next();
    requestTab();

    expect(result.done).toBe(true);
    expect(sentMessages).toHaveLength(1);
    expect(sentMessages[0]).toMatchObject({
      type: 'render',
      mode: 'normal',
      rune: {
        vertices: [],
        colors: null,
        textureUrl: null,
        subRunes: []
      }
    });
    expect('draw' in (sentMessages[0] as any).rune).toBe(false);
  });

  test('replays displays made before the tab request once and in order', async () => {
    const { port1, port2 } = new MessageChannel();
    const runnerChannel = new Channel<RuneChannelMessage>(RUNE_CHANNEL_ID, port1);
    const webChannel = new Channel<RuneChannelMessage>(RUNE_CHANNEL_ID, port2);
    const tabLoader = {
      tabs: ['Rune'],
      loadTab: vi.fn()
    };
    const evaluator = makeChannelEvaluator();
    const plugin = new RuneModulePlugin({} as any, [runnerChannel] as any, evaluator as any, tabLoader);

    await plugin.initialise();

    const square = plugin.exports.find(each => each.symbol === 'square')!.value as any;
    const circle = plugin.exports.find(each => each.symbol === 'circle')!.value as any;
    await plugin.show(square).next();
    await plugin.anaglyph(circle).next();

    await waitForChannelMessages();
    const received: RuneChannelMessage[] = [];
    webChannel.subscribe(message => received.push(message));
    webChannel.send({ type: 'request' });
    await waitForChannelMessages();

    const renders = received.filter(message => message.type === 'render');
    expect(tabLoader.loadTab).toHaveBeenCalledExactlyOnceWith('Rune');
    expect(renders.map(render => render.mode)).toEqual(['normal', 'anaglyph']);
  });

  test('initialise only exports primitive runes once', async () => {
    const { evaluator, plugin } = createRunePlugin();

    await plugin.initialise();

    const exportedSymbols = plugin.exports.map(each => each.symbol);
    const exportedValues = plugin.exports.map(each => each.value);
    const closureMakeCalls = evaluator.closure_make.mock.calls.length;
    const opaqueMakeCalls = evaluator.opaque_make.mock.calls.length;

    await plugin.initialise();

    expect(plugin.exports.map(each => each.symbol)).toEqual(exportedSymbols);
    expect(plugin.exports.map(each => each.value)).toEqual(exportedValues);
    expect(evaluator.closure_make).toHaveBeenCalledTimes(closureMakeCalls);
    expect(evaluator.opaque_make).toHaveBeenCalledTimes(opaqueMakeCalls);
  });

  test('loads the rune tab by name', async () => {
    const { evaluator, plugin, tabLoader } = createRunePlugin(['Other Tab', RUNE_TAB_NAME]);
    const runeValue = await evaluator.opaque_make(funcs.blank) as any;

    const result = await plugin.show(runeValue).next();

    expect(result.done).toBe(true);
    expect(tabLoader.loadTab).toHaveBeenCalledExactlyOnceWith(RUNE_TAB_NAME);
  });
});

describe('stepper thumbnail hook', () => {
  const originalOffscreenCanvas = (globalThis as any).OffscreenCanvas;

  afterEach(() => {
    if (originalOffscreenCanvas === undefined) {
      delete (globalThis as any).OffscreenCanvas;
    } else {
      (globalThis as any).OffscreenCanvas = originalOffscreenCanvas;
    }
  });

  test('is not attached when OffscreenCanvas is unavailable in this realm', async () => {
    delete (globalThis as any).OffscreenCanvas;
    const { plugin } = createRunePlugin();

    await plugin.initialise();

    const blank = plugin.exports.find(each => each.symbol === 'blank')!.value.value as unknown as Rune;
    expect(RENDER_THUMBNAIL_SYMBOL in (blank as any)).toBe(false);
  });

  test('is attached as a non-enumerable hook when OffscreenCanvas is available', async () => {
    (globalThis as any).OffscreenCanvas = class {};
    const { plugin } = createRunePlugin();

    await plugin.initialise();

    const blank = plugin.exports.find(each => each.symbol === 'blank')!.value.value as unknown as Rune;
    const hook = (blank as any)[RENDER_THUMBNAIL_SYMBOL];

    expect(typeof hook).toBe('function');
    expect(Object.getOwnPropertySymbols(blank)).toContain(RENDER_THUMBNAIL_SYMBOL);
    expect(Object.prototype.propertyIsEnumerable.call(blank, RENDER_THUMBNAIL_SYMBOL)).toBe(false);
  });

  test('a rendering failure resolves to undefined rather than throwing', async () => {
    (globalThis as any).OffscreenCanvas = class {
      getContext() {
        throw new Error('no webgl in this fake environment');
      }
    };
    const { plugin } = createRunePlugin();

    await plugin.initialise();

    const blank = plugin.exports.find(each => each.symbol === 'blank')!.value.value as unknown as Rune;
    const hook = (blank as any)[RENDER_THUMBNAIL_SYMBOL] as () => Promise<string | undefined>;

    await expect(hook()).resolves.toBeUndefined();
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
    expect(() => funcs.color(funcs.heart, 100, 0, 0)).toThrow('color: Expected number ∈ [0, 1] for r, got 100.');
    expect(() => funcs.color(funcs.heart, 0, -1, 0)).toThrow('color: Expected number ∈ [0, 1] for g, got -1.');
    expect(() => funcs.color(funcs.heart, 0, 0, 'hi' as any)).toThrow('color: Expected number ∈ [0, 1] for b, got "hi".');
  });
});

describe(funcs.beside_frac, () => {
  it('throws when argument is not rune', () => {
    expect(() => funcs.beside_frac(0, 0 as any, funcs.heart)).toThrow('beside_frac: Expected Rune for rune1, got 0.');
    expect(() => funcs.beside_frac(0, funcs.heart, 0 as any)).toThrow('beside_frac: Expected Rune for rune2, got 0.');
  });

  it('throws when frac is out of range', () => {
    expect(() => funcs.beside_frac(-1, funcs.heart, funcs.heart)).toThrow('beside_frac: Expected number ∈ [0, 1] for frac, got -1.');
    expect(() => funcs.beside_frac(10, funcs.heart, funcs.heart)).toThrow('beside_frac: Expected number ∈ [0, 1] for frac, got 10.');
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
    expect(() => funcs.stack_frac(-1, funcs.heart, funcs.heart)).toThrow('stack_frac: Expected number ∈ [0, 1] for frac, got -1.');
    expect(() => funcs.stack_frac(10, funcs.heart, funcs.heart)).toThrow('stack_frac: Expected number ∈ [0, 1] for frac, got 10.');
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

describe(funcs.overlay_frac, () => {
  it('throws when argument is not rune', () => {
    expect(() => funcs.overlay_frac(0, 0 as any, funcs.heart)).toThrow('overlay_frac: Expected Rune for rune1, got 0.');
    expect(() => funcs.overlay_frac(0, funcs.heart, 0 as any)).toThrow('overlay_frac: Expected Rune for rune2, got 0.');
  });

  it('throws when frac is out of range', () => {
    expect(() => funcs.overlay_frac(-1, funcs.heart, funcs.heart)).toThrow('overlay_frac: Expected number ∈ [0, 1] for frac, got -1.');
    expect(() => funcs.overlay_frac(10, funcs.heart, funcs.heart)).toThrow('overlay_frac: Expected number ∈ [0, 1] for frac, got 10.');
  });
});

describe('Colouring functions', () => {
  type FunctionName = keyof (typeof funcs.RuneColours);

  const names = Object.getOwnPropertyNames(funcs.RuneColours) as FunctionName[];
  const colourers = names.reduce<[FunctionName, (r: Rune) => Rune][]>((res, name) => {
    if (typeof funcs.RuneColours[name] !== 'function' || name === 'colour_with_hue') return res;
    return [...res, [name, funcs.RuneColours[name]] as [FunctionName, (r: Rune) => Rune]];
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
