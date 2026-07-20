import { DrawnHollusionRune, blank } from '@sourceacademy/bundle-rune/functions';
import {
  serializeRune,
  type RuneChannelMessage
} from '@sourceacademy/bundle-rune/protocol';
import type { ITabService } from '@sourceacademy/common-tabs';
import type { IChannel, IConduit } from '@sourceacademy/conductor/conduit';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-react';
import RuneTabPlugin, { RUNE_TAB_ID } from '..';
import HollusionCanvas from '../hollusion_canvas';

class MockChannel<T> implements IChannel<T> {
  readonly name = 'mock-rune-channel';
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

describe(HollusionCanvas, () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    cleanup();
  });

  test('Render function is memoized', async () => {
    const rune = new DrawnHollusionRune(blank, 0.1);
    const mockedDraw = vi.spyOn(rune, 'draw');

    await render(<HollusionCanvas rune={rune} />);

    for (let i = 0; i < 10; i++) {
      vi.advanceTimersToNextFrame();
    }

    expect(mockedDraw).toHaveBeenCalledOnce();
  });
});

describe(RuneTabPlugin, () => {
  test('registers the rune tab and requests replay', () => {
    const channel = new MockChannel<RuneChannelMessage>();
    const tabService = {
      registerTab: vi.fn(),
      unregisterTab: vi.fn(),
      showTab: vi.fn(),
      hideTab: vi.fn()
    } satisfies ITabService;

    new RuneTabPlugin({} as IConduit, [channel], tabService);

    expect(tabService.registerTab).toHaveBeenCalledOnce();
    expect(channel.sent).toContainEqual({ type: 'request' });
  });

  test('stores render messages and shows the tab', () => {
    const channel = new MockChannel<RuneChannelMessage>();
    const tabService = {
      registerTab: vi.fn(),
      unregisterTab: vi.fn(),
      showTab: vi.fn(),
      hideTab: vi.fn()
    } satisfies ITabService;
    const plugin = new RuneTabPlugin({} as IConduit, [channel], tabService);
    const message = {
      type: 'render',
      mode: 'normal',
      rune: serializeRune(blank)
    } satisfies RuneChannelMessage;

    channel.emit(message);

    expect(plugin.getMessages()).toEqual([message]);
    expect(tabService.showTab).toHaveBeenCalledExactlyOnceWith(RUNE_TAB_ID);
  });
});
