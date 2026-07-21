import type { ITabService, Tab } from '@sourceacademy/common-tabs';
import type { IChannel } from '@sourceacademy/conductor/conduit';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import MatrixTabPlugin, { MATRIX_TAB_ID } from '..';

class MockChannel<T> implements IChannel<T> {
  readonly name = 'mock-matrix-channel';
  private readonly subscribers = new Set<(message: T) => void>();

  send() {}

  subscribe(subscriber: (message: T) => void) {
    this.subscribers.add(subscriber);
  }

  unsubscribe(subscriber: (message: T) => void) {
    this.subscribers.delete(subscriber);
  }

  close() {
    this.subscribers.clear();
  }
}

class MockTabService implements ITabService {
  readonly tabs = new Map<string, Tab>();

  registerTab(tab: Tab) {
    this.tabs.set(tab.id, tab);
  }

  unregisterTab(id: string) {
    this.tabs.delete(id);
  }

  showTab(_id: string) {}
  hideTab(_id: string) {}
}

describe(MatrixTabPlugin, () => {
  let channel: MockChannel<any>;
  let tabService: MockTabService;
  let plugin: MatrixTabPlugin;
  let container: HTMLDivElement;

  beforeEach(() => {
    channel = new MockChannel();
    tabService = new MockTabService();
    plugin = new MatrixTabPlugin({} as any, [channel], tabService);
    container = document.createElement('div');
    document.body.appendChild(container);
    // Attaches the canvas the same way React's ref callback would, without pulling in a renderer
    // - only the plugin's own DOM wiring (canvas creation, click handling) is under test here.
    (plugin as unknown as { __attachCanvas: (el: HTMLDivElement | null) => void }).__attachCanvas(container);
  });

  beforeEach(async () => {
    // The grid is intentionally stashed on globalThis, not per-instance (see index.tsx), so it
    // persists across every Run the way the original implementation's single `matrix` variable did -
    // which also means it persists across test cases in this same process. Reset explicitly for
    // test isolation; this doesn't affect the real (desired) cross-Run persistence.
    await plugin.clearMatrix();
  });

  afterEach(() => {
    container.remove();
  });

  test('registers a tab on construction', () => {
    expect(tabService.tabs.has(MATRIX_TAB_ID)).toBe(true);
  });

  test('destroy leaves the tab registered', () => {
    // Regression test: destroy() is called on every Run's teardown, which happens almost
    // immediately for this module (nothing here is slow like sound's audio playback) -
    // unregistering here previously made the tab flash and vanish right after it appeared.
    plugin.destroy();
    expect(tabService.tabs.has(MATRIX_TAB_ID)).toBe(true);
  });

  test('getMatrix starts as an all-false 16x16 grid', async () => {
    const matrix = await plugin.getMatrix();
    expect(matrix).toHaveLength(16);
    expect(matrix.every(row => row.length === 16 && row.every(cell => cell === false))).toBe(true);
  });

  test('clicking a square toggles it in getMatrix()\'s result', async () => {
    const canvas = container.querySelector('canvas')!;
    const rect = canvas.getBoundingClientRect();
    // Row 0, column 0 sits at (margin, margin) = (20, 20) relative to the canvas.
    canvas.dispatchEvent(new MouseEvent('click', { clientX: rect.left + 25, clientY: rect.top + 25, bubbles: true }));

    const matrix = await plugin.getMatrix();
    expect(matrix[0][0]).toBe(true);
    expect(matrix[0][1]).toBe(false);
    expect(matrix[1][0]).toBe(false);
  });

  test('clicking a square replaces the shared matrix reference, not just its contents', () => {
    // Regression test: useSyncExternalStore's snapshot function is getSharedMatrix itself, so
    // React detects a change via Object.is on successive snapshots - mutating the stored array in
    // place (same reference) would make React think nothing changed and skip re-rendering, even
    // though __setColor's direct canvas draw would still look correct. The click handler must
    // install a *new* array via setSharedMatrix, not mutate the existing one.
    const key = Symbol.for('sourceacademy.matrix.sharedMatrix');
    const before = (globalThis as unknown as Record<symbol, unknown>)[key];

    const canvas = container.querySelector('canvas')!;
    const rect = canvas.getBoundingClientRect();
    canvas.dispatchEvent(new MouseEvent('click', { clientX: rect.left + 25, clientY: rect.top + 25, bubbles: true }));

    const after = (globalThis as unknown as Record<symbol, unknown>)[key];
    expect(after).not.toBe(before);
  });

  test('clicking the same square twice toggles it back off', async () => {
    const canvas = container.querySelector('canvas')!;
    const rect = canvas.getBoundingClientRect();
    const click = () => canvas.dispatchEvent(new MouseEvent('click', { clientX: rect.left + 25, clientY: rect.top + 25, bubbles: true }));
    click();
    click();

    const matrix = await plugin.getMatrix();
    expect(matrix[0][0]).toBe(false);
  });

  test('clearMatrix resets every square to false', async () => {
    const canvas = container.querySelector('canvas')!;
    const rect = canvas.getBoundingClientRect();
    canvas.dispatchEvent(new MouseEvent('click', { clientX: rect.left + 25, clientY: rect.top + 25, bubbles: true }));
    expect((await plugin.getMatrix())[0][0]).toBe(true);

    await plugin.clearMatrix();

    const matrix = await plugin.getMatrix();
    expect(matrix.every(row => row.every(cell => cell === false))).toBe(true);
  });

  test('getMatrix returns a defensive copy - mutating the result does not affect internal state', async () => {
    const matrix = await plugin.getMatrix();
    matrix[0][0] = true;
    expect((await plugin.getMatrix())[0][0]).toBe(false);
  });

  test('the composed pattern survives across separate plugin instances (simulating multiple Runs)', async () => {
    // Regression test: a fresh MatrixTabPlugin instance is constructed on every Run (the
    // conductor/Worker are recreated each time, and the host re-invokes the tab bundle's
    // require-wrapper factory fresh on every Run too - see index.tsx's comment on globalScope), but
    // the whole point of this module is composing a pattern once and reading/playing it across
    // possibly several Runs - the grid must not reset just because a new instance was constructed.
    const canvas = container.querySelector('canvas')!;
    const rect = canvas.getBoundingClientRect();
    canvas.dispatchEvent(new MouseEvent('click', { clientX: rect.left + 25, clientY: rect.top + 25, bubbles: true }));
    expect((await plugin.getMatrix())[0][0]).toBe(true);

    const secondChannel = new MockChannel();
    const secondPlugin = new MatrixTabPlugin({} as any, [secondChannel], tabService);
    expect((await secondPlugin.getMatrix())[0][0]).toBe(true);
  });
});
