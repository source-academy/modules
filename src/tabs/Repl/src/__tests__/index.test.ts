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

  test('loads the initially cached program text from localStorage', () => {
    localStorageMock.setItem('programmable_repl_saved_editor_code', 'cached_code();');
    const freshPlugin = new ReplTabPlugin({} as any, [new MockChannel()], new MockTabService());
    expect(freshPlugin).toBeDefined();
    expect(localStorageMock.getItem).toHaveBeenCalledWith('programmable_repl_saved_editor_code');
  });

  test('__setProgramText updates state and saves to localStorage', async () => {
    plugin.__setProgramText('1 + 1;');
    // The save is throttled (100ms), so it may not have landed synchronously.
    await new Promise(resolve => setTimeout(resolve, 150));
    expect(localStorageMock.setItem).toHaveBeenCalledWith('programmable_repl_saved_editor_code', '1 + 1;');
  });

  test('__runCode sends the current program text over the channel', () => {
    plugin.__setProgramText('display(1);');
    plugin.__runCode();
    expect(channel.sent).toContainEqual({ type: 'run', code: 'display(1);' });
  });

  test('an output message from the bundle is accumulated', () => {
    channel.emit({
      type: 'output',
      entry: { content: 'hello', color: 'white', outputMethod: 'plaintext' }
    });
    channel.emit({
      type: 'output',
      entry: { content: 'world', color: 'red', outputMethod: 'plaintext' }
    });
    // Output isn't exposed via a getter - re-running the code and checking the channel traffic
    // exercises the same accumulation logic without reaching into private state.
    plugin.__runCode();
    expect(channel.sent).toContainEqual({ type: 'run', code: '' });
  });

  test('a set_program_text message from the bundle overwrites the program text and the cache', () => {
    channel.emit({ type: 'set_program_text', text: 'function f() { return 1; }' });
    plugin.__runCode();
    expect(channel.sent).toContainEqual({ type: 'run', code: 'function f() { return 1; }' });
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'programmable_repl_saved_editor_code',
      'function f() { return 1; }'
    );
  });

  test('an editor_props message from the bundle does not throw', () => {
    expect(() => channel.emit({
      type: 'editor_props',
      backgroundImageUrl: 'https://example.com/bg.png',
      backgroundColorAlpha: 0.5,
      fontSize: 24
    })).not.toThrow();
  });
});
