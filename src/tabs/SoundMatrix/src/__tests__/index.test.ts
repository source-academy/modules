import type { ITabService, Tab } from '@sourceacademy/common-tabs';
import type { IChannel } from '@sourceacademy/conductor/conduit';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import SoundMatrixTabPlugin, { SOUND_MATRIX_TAB_ID } from '..';

class MockChannel<T> implements IChannel<T> {
  readonly name = 'mock-sound-matrix-channel';
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

describe(SoundMatrixTabPlugin, () => {
  let channel: MockChannel<any>;
  let tabService: MockTabService;
  let plugin: SoundMatrixTabPlugin;
  let container: HTMLDivElement;

  beforeEach(() => {
    channel = new MockChannel();
    tabService = new MockTabService();
    plugin = new SoundMatrixTabPlugin({} as any, [channel], tabService);
    container = document.createElement('div');
    document.body.appendChild(container);
    // Attaches the canvas the same way React's ref callback would, without pulling in a renderer
    // - only the plugin's own DOM wiring (canvas creation, click handling) is under test here.
    (plugin as unknown as { __attachCanvas: (el: HTMLDivElement | null) => void }).__attachCanvas(container);
  });

  afterEach(() => {
    container.remove();
  });

  test('registers a tab on construction', () => {
    expect(tabService.tabs.has(SOUND_MATRIX_TAB_ID)).toBe(true);
  });

  test('destroy unregisters the tab', () => {
    plugin.destroy();
    expect(tabService.tabs.has(SOUND_MATRIX_TAB_ID)).toBe(false);
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
});
