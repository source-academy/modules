import type { ITabService, Tab } from '@sourceacademy/common-tabs';
import type { IChannel } from '@sourceacademy/conductor/conduit';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import ReplTabPlugin, { REPL_TAB_ID } from '..';

class MockChannel<T> implements IChannel<T> {
  readonly name = 'mock-repl-channel';
  readonly sent: T[] = [];
  private readonly subscribers = new Set<(message: T) => void>();

  send(message: T) {
    this.sent.push(message);
  }

  subscribe(subscriber: (message: T) => void) {
    this.subscribers.add(subscriber);
  }

  unsubscribe(subscriber: (message: T) => void) {
    this.subscribers.delete(subscriber);
  }

  close() {
    this.subscribers.clear();
  }

  emit(message: T) {
    this.subscribers.forEach(subscriber => subscriber(message));
  }
}

class MockTabService implements ITabService {
  readonly tabs = new Map<string, Tab>();
  readonly shown = new Set<string>();

  registerTab(tab: Tab) {
    this.tabs.set(tab.id, tab);
  }

  unregisterTab(id: string) {
    this.tabs.delete(id);
  }

  showTab(id: string) {
    this.shown.add(id);
  }

  hideTab(id: string) {
    this.shown.delete(id);
  }
}

function createMockLocalStorage() {
  const store = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key: string) => store.delete(key)),
    clear: vi.fn(() => store.clear())
  };
}

describe(ReplTabPlugin, () => {
  let channel: MockChannel<any>;
  let tabService: MockTabService;
  let plugin: ReplTabPlugin;
  let localStorageMock: ReturnType<typeof createMockLocalStorage>;

  beforeEach(() => {
    localStorageMock = createMockLocalStorage();
    vi.stubGlobal('localStorage', localStorageMock);

    channel = new MockChannel();
    tabService = new MockTabService();
    plugin = new ReplTabPlugin({} as any, [channel], tabService);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('registers and shows a tab on construction', () => {
    expect(tabService.tabs.has(REPL_TAB_ID)).toBe(true);
    expect(tabService.shown.has(REPL_TAB_ID)).toBe(true);
  });

  test('requests a backlog replay on construction', () => {
    expect(channel.sent).toContainEqual({ type: 'request' });
  });

  test('destroy leaves the tab registered', () => {
    // Called on every Run's teardown - unregistering here would yank the tab away while the
    // student is still reading old output. The next Run's ReplTabPlugin replaces it naturally by
    // registering under the same id.
    plugin.destroy();
    expect(tabService.tabs.has(REPL_TAB_ID)).toBe(true);
  });

  test('loads the initially cached program text from localStorage and actually uses it', () => {
    localStorageMock.setItem('programmable_repl_saved_editor_code', 'cached_code();');
    const freshChannel = new MockChannel<any>();
    const freshPlugin = new ReplTabPlugin({} as any, [freshChannel], new MockTabService());

    freshPlugin.__runCode();
    expect(freshChannel.sent).toContainEqual({ type: 'run', code: 'cached_code();' });
  });

  test('a localStorage.getItem failure (e.g. private browsing) does not stop the tab from constructing', () => {
    localStorageMock.getItem.mockImplementationOnce(() => {
      throw new Error('SecurityError');
    });

    expect(() => new ReplTabPlugin({} as any, [new MockChannel()], new MockTabService())).not.toThrow();
  });

  test('__setProgramText updates state and saves to localStorage', () => {
    vi.useFakeTimers();
    try {
      plugin.__setProgramText('1 + 1;');
      // The save is throttled (100ms), so it may not have landed synchronously.
      vi.advanceTimersByTime(150);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('programmable_repl_saved_editor_code', '1 + 1;');
    } finally {
      vi.useRealTimers();
    }
  });

  test('a localStorage.setItem failure (e.g. quota exceeded) does not throw out of the throttled save', () => {
    vi.useFakeTimers();
    try {
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('QuotaExceededError');
      });
      plugin.__setProgramText('1 + 1;');
      expect(() => vi.advanceTimersByTime(150)).not.toThrow();
    } finally {
      vi.useRealTimers();
    }
  });

  test('__runCode sends the current program text over the channel', () => {
    plugin.__setProgramText('display(1);');
    plugin.__runCode();
    expect(channel.sent).toContainEqual({ type: 'run', code: 'display(1);' });
  });

  test('output messages from the bundle are accumulated in order', () => {
    channel.emit({
      type: 'output',
      entry: { content: 'hello', color: 'white', outputMethod: 'plaintext' }
    });
    channel.emit({
      type: 'output',
      entry: { content: 'world', color: 'red', outputMethod: 'plaintext' }
    });

    expect(plugin.getOutputs()).toStrictEqual([
      { content: 'hello', color: 'white', outputMethod: 'plaintext' },
      { content: 'world', color: 'red', outputMethod: 'plaintext' }
    ]);
  });

  test('a set_program_text message from the bundle overwrites the program text and the cache', () => {
    vi.useFakeTimers();
    try {
      channel.emit({ type: 'set_program_text', text: 'function f() { return 1; }' });
      plugin.__runCode();
      expect(channel.sent).toContainEqual({ type: 'run', code: 'function f() { return 1; }' });

      // The save is throttled (100ms), so it may not have landed synchronously.
      vi.advanceTimersByTime(150);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'programmable_repl_saved_editor_code',
        'function f() { return 1; }'
      );
    } finally {
      vi.useRealTimers();
    }
  });

  test('an editor_props message from the bundle does not throw', () => {
    expect(() => channel.emit({
      type: 'editor_props',
      backgroundImageUrl: 'https://example.com/bg.png',
      backgroundColorAlpha: 0.5,
      fontSize: 24
    })).not.toThrow();
  });

  test('destroy unsubscribes from the channel, so a discarded instance stops reacting to messages', () => {
    plugin.destroy();
    channel.emit({
      type: 'output',
      entry: { content: 'after destroy', color: 'white', outputMethod: 'plaintext' }
    });
    expect(plugin.getOutputs()).toStrictEqual([]);
  });
});
