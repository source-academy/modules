import {
  CURVE_TAB_ID,
  type CurveChannelMessage
} from '@sourceacademy/bundle-curve/protocol';
import type { ITabService } from '@sourceacademy/common-tabs';
import type { IChannel, IConduit } from '@sourceacademy/conductor/conduit';
import { describe, expect, test, vi } from 'vitest';
import CurveTabPlugin from '..';

class MockChannel<T> implements IChannel<T> {
  readonly name = 'mock-curve-channel';
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

function makeTabService(): ITabService {
  return {
    registerTab: vi.fn(),
    unregisterTab: vi.fn(),
    showTab: vi.fn(),
    hideTab: vi.fn()
  };
}

describe(CurveTabPlugin, () => {
  test('registers the curve tab and requests replay', () => {
    const channel = new MockChannel<CurveChannelMessage>();
    const tabService = makeTabService();

    new CurveTabPlugin({} as IConduit, [channel], tabService);

    expect(tabService.registerTab).toHaveBeenCalledOnce();
    expect(channel.sent).toContainEqual({ type: 'request' });
  });

  test('stores render messages and shows the tab', () => {
    const channel = new MockChannel<CurveChannelMessage>();
    const tabService = makeTabService();
    const plugin = new CurveTabPlugin({} as IConduit, [channel], tabService);
    const message = {
      type: 'render',
      curve: {
        drawMode: 'lines',
        numPoints: 1,
        space: '2D',
        drawCubeArray: [],
        curvePosArray: [-1, -1, 1, 1],
        curveColorArray: [0, 0, 0, 1, 0, 0, 0, 1]
      }
    } satisfies CurveChannelMessage;

    channel.emit(message);

    expect(plugin.getMessages()).toEqual([message]);
    expect(tabService.showTab).toHaveBeenCalledExactlyOnceWith(CURVE_TAB_ID);
  });
});
