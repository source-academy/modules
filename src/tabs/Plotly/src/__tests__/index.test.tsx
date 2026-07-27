import { PLOTLY_CHANNEL_ID, type PlotlyChannelMessage } from '@sourceacademy/bundle-plotly/protocol';
import type { ITabService } from '@sourceacademy/common-tabs';
import type { IChannel, IConduit } from '@sourceacademy/conductor/conduit';
import { expect, test, vi } from 'vitest';
import PlotlyTabPlugin from '..';

vi.mock(
  import('react-plotly.js'),
  () => ({ default: () => null }) as unknown as typeof import('react-plotly.js')
);

class MockChannel<T> implements IChannel<T> {
  readonly name = PLOTLY_CHANNEL_ID;
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
}

test('registers the Plotly tab and requests retained plots', () => {
  const channel = new MockChannel<PlotlyChannelMessage>();
  const tabService = {
    registerTab: vi.fn(),
    unregisterTab: vi.fn(),
    showTab: vi.fn(),
    hideTab: vi.fn()
  } satisfies ITabService;

  new PlotlyTabPlugin({} as IConduit, [channel], tabService);

  expect(tabService.registerTab).toHaveBeenCalledOnce();
  expect(channel.sent).toContainEqual({ type: 'request' });
});
