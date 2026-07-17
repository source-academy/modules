import type { ITabService, Tab } from '@sourceacademy/common-tabs';
import type { IChannel } from '@sourceacademy/conductor/conduit';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import SoundTabPlugin, { SOUND_TAB_ID } from '..';

class MockChannel<T> implements IChannel<T> {
  readonly name = 'mock-sound-channel';
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

function makeMockBufferSource() {
  const source = {
    buffer: null as AudioBuffer | null,
    onended: undefined as (() => void) | undefined,
    connect: vi.fn(),
    start: vi.fn(function (this: typeof source) {
      queueMicrotask(() => this.onended?.());
    }),
    // Matches the real AudioBufferSourceNode: stop() fires 'ended' too, not just letting playback
    // run to completion on its own.
    stop: vi.fn(function (this: typeof source) {
      queueMicrotask(() => this.onended?.());
    })
  };
  return source;
}

function createMockAudioContext() {
  // A fresh source per createBufferSource() call - `bufferSource` tracks the most recently created
  // one, for tests that only ever have one source in play at a time to assert on.
  let bufferSource = makeMockBufferSource();

  return {
    get bufferSource() {
      return bufferSource;
    },
    destination: {},
    createBuffer: vi.fn((_channels: number, length: number, sampleRate: number) => ({
      length,
      sampleRate,
      copyToChannel: vi.fn(),
      getChannelData: vi.fn(() => new Float32Array(length))
    })),
    createBufferSource: vi.fn(() => {
      bufferSource = makeMockBufferSource();
      return bufferSource;
    }),
    decodeAudioData: vi.fn().mockResolvedValue({
      numberOfChannels: 1,
      getChannelData: () => new Float32Array([0, 1, -1, 0]),
      sampleRate: 8000
    }),
    close: vi.fn().mockResolvedValue(undefined)
  };
}

function createMockMediaRecorder() {
  const recorder = {
    ondataavailable: undefined as ((event: { data: Blob }) => void) | undefined,
    onstart: undefined as (() => void) | undefined,
    onerror: undefined as ((event: { error?: unknown }) => void) | undefined,
    onstop: undefined as (() => void) | undefined,
    start: vi.fn(function (this: typeof recorder) {
      queueMicrotask(() => this.onstart?.());
    }),
    stop: vi.fn(function (this: { onstop?: () => void }) {
      queueMicrotask(() => this.onstop?.());
    })
  };
  return recorder;
}

describe(SoundTabPlugin, () => {
  let channel: MockChannel<any>;
  let tabService: MockTabService;
  let plugin: SoundTabPlugin;
  let mockAudioContext: ReturnType<typeof createMockAudioContext>;
  let mockMediaRecorder: ReturnType<typeof createMockMediaRecorder>;
  let mockStream: MediaStream;
  let getUserMedia: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockAudioContext = createMockAudioContext();
    mockMediaRecorder = createMockMediaRecorder();
    mockStream = {} as MediaStream;
    getUserMedia = vi.fn().mockResolvedValue(mockStream);

    vi.stubGlobal('AudioContext', function (this: unknown) { return mockAudioContext; });
    vi.stubGlobal('MediaRecorder', function (this: unknown) { return mockMediaRecorder; });
    vi.stubGlobal('navigator', { mediaDevices: { getUserMedia } });

    channel = new MockChannel();
    tabService = new MockTabService();
    plugin = new SoundTabPlugin({} as any, [channel], tabService);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('registers a tab on construction', () => {
    expect(tabService.tabs.has(SOUND_TAB_ID)).toBe(true);
  });

  test('destroy leaves the tab registered', () => {
    // Called on every Run's teardown, well before fire-and-forget playback dispatched via play()
    // has necessarily finished - unregistering here would yank the tab away mid-playback and leave
    // the student on a blank tab strip once it drained. The next Run's SoundTabPlugin replaces it
    // naturally by registering under the same id.
    plugin.destroy();
    expect(tabService.tabs.has(SOUND_TAB_ID)).toBe(true);
  });

  test('destroy closes the AudioContext immediately when nothing is playing', async () => {
    // AudioContext is only created lazily, on first use - exercise playSamples() first so one
    // actually exists to be closed.
    const samples = new Float32Array([0]);
    await plugin.playSamples(samples, samples, 8000);

    plugin.destroy();
    expect(mockAudioContext.close).toHaveBeenCalledOnce();
  });

  test('destroy defers closing the AudioContext until in-flight playback finishes', async () => {
    const samples = new Float32Array([0]);
    const playing = plugin.playSamples(samples, samples, 8000);
    plugin.destroy();
    expect(mockAudioContext.close).not.toHaveBeenCalled();

    await playing;
    expect(mockAudioContext.close).toHaveBeenCalledOnce();
  });

  test('destroy does not close the AudioContext while a later sound is still queued behind the one that just finished', async () => {
    // Regression test: __activeSources hits 0 momentarily between the first sound ending and the
    // second (still queued) one starting, since the queue drains asynchronously. Closing the
    // AudioContext at that instant - rather than waiting for the whole queue to drain - used to
    // silently kill every sound still waiting its turn behind the one that just finished.
    const samples = new Float32Array([0]);
    const first = plugin.playSamples(samples, samples, 8000);
    const second = plugin.playSamples(samples, samples, 8000); // queued behind the first

    plugin.destroy();
    expect(mockAudioContext.close).not.toHaveBeenCalled();

    await first;
    // The first sound finished, but the second is still queued - must not close yet.
    expect(mockAudioContext.close).not.toHaveBeenCalled();

    await second;
    // Now the whole queue has actually drained.
    expect(mockAudioContext.close).toHaveBeenCalledOnce();
    expect(mockAudioContext.createBufferSource).toHaveBeenCalledTimes(2);
  });

  describe('requestMicPermission', () => {
    test('resolves true when the host grants permission', async () => {
      await expect(plugin.requestMicPermission()).resolves.toBe(true);
    });

    test('resolves false when the host denies permission', async () => {
      getUserMedia.mockRejectedValueOnce(new Error('denied'));
      await expect(plugin.requestMicPermission()).resolves.toBe(false);
    });
  });

  describe('playSamples', () => {
    test('plays a 2-channel buffer through the AudioContext and resolves once playback ends', async () => {
      const left = new Float32Array([0, 0.5, -0.5, 0]);
      const right = new Float32Array([0, -0.5, 0.5, 0]);
      await plugin.playSamples(left, right, 8000);

      expect(mockAudioContext.createBuffer).toHaveBeenCalledWith(2, left.length, 8000);
      expect(mockAudioContext.bufferSource.start).toHaveBeenCalledOnce();
    });

    test('repeated/looped calls queue: the second does not start until the first finishes', async () => {
      const samples = new Float32Array([0]);
      const first = plugin.playSamples(samples, samples, 8000);
      const second = plugin.playSamples(samples, samples, 8000);

      // playSamples() now goes through the host's own queue (even for the first call): one
      // microtask tick is enough for the first call's turn to start (source created + start()
      // called), but not enough for its mocked start()'s own queued onended to have fired yet -
      // unlike a full setTimeout(0) flush, which would race straight past this intermediate state.
      await Promise.resolve();
      const firstSource = mockAudioContext.bufferSource;

      // The second call is queued behind the first, not started concurrently - only one source
      // has been created so far.
      expect(mockAudioContext.createBufferSource).toHaveBeenCalledTimes(1);
      expect(firstSource.start).toHaveBeenCalledOnce();

      await first;
      await new Promise(resolve => setTimeout(resolve, 0));

      // Now that the first has finished, the second's turn has arrived: its own source was
      // created and started.
      const secondSource = mockAudioContext.bufferSource;
      expect(secondSource).not.toBe(firstSource);
      expect(mockAudioContext.createBufferSource).toHaveBeenCalledTimes(2);
      expect(secondSource.start).toHaveBeenCalledOnce();

      await second;
    });

    test('an earlier sound finishing does not clobber a later sound\'s still-in-flight constructing status', async () => {
      // Regression test: notifyConstructing() (sampling can take a while for an expensive Sound,
      // entirely in the Worker) and playSamples() are independent RPC calls. Sampling for a second
      // sound can still be in progress when a first, already-dispatched sound finishes playing -
      // that completion must not reset status to 'idle' out from under the second sound's
      // still-active 'constructing' status.
      const samples = new Float32Array([0]);
      const first = plugin.playSamples(samples, samples, 8000);
      await Promise.resolve(); // let the first sound actually start playing
      expect(plugin.getStatus()).toBe('playing');

      await plugin.notifyConstructing(); // a second, unrelated sound starts sampling
      expect(plugin.getStatus()).toBe('playing'); // first sound is still audibly playing

      await first;
      await new Promise(resolve => setTimeout(resolve, 0));
      // The first sound finished, but the second is still being sampled (its playSamples() call
      // hasn't arrived yet) - status must reflect that, not revert to idle.
      expect(plugin.getStatus()).toBe('constructing');

      void plugin.playSamples(samples, samples, 8000); // the second sound's sampling finishes
      await Promise.resolve();
      expect(plugin.getStatus()).toBe('playing');
    });
  });

  describe('$stopPlayback', () => {
    test('stops the currently playing source', async () => {
      const samples = new Float32Array([0]);
      const playing = plugin.playSamples(samples, samples, 8000);
      // One tick: enough for playback to actually start, not enough for it to have finished on
      // its own (see the queueing test above for why a full setTimeout(0) flush would be too much).
      await Promise.resolve();

      plugin.$stopPlayback();
      expect(mockAudioContext.bufferSource.stop).toHaveBeenCalledOnce();
      await playing;
    });

    test('cancels anything still queued (not yet started) instead of letting it play after stop', async () => {
      const samples = new Float32Array([0]);
      const first = plugin.playSamples(samples, samples, 8000);
      const second = plugin.playSamples(samples, samples, 8000); // queued behind the first
      await Promise.resolve();
      const firstSource = mockAudioContext.bufferSource;

      plugin.$stopPlayback();
      expect(firstSource.stop).toHaveBeenCalledOnce();

      await Promise.all([first, second]);
      await new Promise(resolve => setTimeout(resolve, 0));

      // The queued second call never got its own source created/started - it recognised itself
      // as stale (stop() moved past its generation) once its turn arrived.
      expect(mockAudioContext.createBufferSource).toHaveBeenCalledTimes(1);
    });
  });

  describe('notifyConstructing', () => {
    test('resolves without throwing', async () => {
      await expect(plugin.notifyConstructing()).resolves.toBeUndefined();
    });
  });

  describe('startRecording', () => {
    test('throws if microphone permission was never granted', async () => {
      await expect(plugin.startRecording()).rejects.toThrow('Microphone permission has not been granted.');
    });

    test('starts the MediaRecorder once permission has been granted', async () => {
      await plugin.requestMicPermission();
      await plugin.startRecording();
      expect(mockMediaRecorder.start).toHaveBeenCalledOnce();
    });

    test('does not resolve until the recorder actually confirms it has started', async () => {
      await plugin.requestMicPermission();

      let resolved = false;
      const started = plugin.startRecording().then(() => {
        resolved = true;
      });

      // start() was called, but the mock's onstart hasn't fired yet (only queued as a microtask).
      expect(mockMediaRecorder.start).toHaveBeenCalledOnce();
      expect(resolved).toBe(false);

      await started;
      expect(resolved).toBe(true);
    });
  });

  describe('stopRecording', () => {
    test('throws if no recording is in progress', async () => {
      await expect(plugin.stopRecording()).rejects.toThrow('No recording in progress.');
    });

    test('stops recording and decodes the result, duplicating a mono channel into left and right', async () => {
      await plugin.requestMicPermission();
      await plugin.startRecording();

      const result = await plugin.stopRecording();

      expect(mockMediaRecorder.stop).toHaveBeenCalledOnce();
      expect(result.left).toBeInstanceOf(Float32Array);
      expect(result.right).toBe(result.left);
      expect(result.sampleRate).toEqual(8000);
    });

    test('reports separate left/right channels for a genuinely stereo input device', async () => {
      const leftData = new Float32Array([0, 1, -1, 0]);
      const rightData = new Float32Array([0, -1, 1, 0]);
      mockAudioContext.decodeAudioData.mockResolvedValueOnce({
        numberOfChannels: 2,
        getChannelData: (channel: number) => (channel === 0 ? leftData : rightData),
        sampleRate: 8000
      });

      await plugin.requestMicPermission();
      await plugin.startRecording();
      const result = await plugin.stopRecording();

      expect(result.left).toBe(leftData);
      expect(result.right).toBe(rightData);
    });
  });
});
