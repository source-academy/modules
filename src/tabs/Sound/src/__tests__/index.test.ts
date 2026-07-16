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
    stop: vi.fn()
  };
  return source;
}

function createMockAudioContext() {
  // A fresh source per createBufferSource() call, since repeated/looped play() calls stack -
  // multiple can be genuinely concurrent - but `bufferSource` still tracks the most recently
  // created one, for existing single-source tests that only ever create one before asserting on it.
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

  test('destroy unregisters the tab', () => {
    plugin.destroy();
    expect(tabService.tabs.has(SOUND_TAB_ID)).toBe(false);
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

    test('repeated/looped calls stack: each gets its own independent source', async () => {
      const samples = new Float32Array([0]);
      const first = plugin.playSamples(samples, samples, 8000);
      const firstSource = mockAudioContext.bufferSource;
      const second = plugin.playSamples(samples, samples, 8000);
      const secondSource = mockAudioContext.bufferSource;

      expect(firstSource).not.toBe(secondSource);
      expect(mockAudioContext.createBufferSource).toHaveBeenCalledTimes(2);
      expect(firstSource.start).toHaveBeenCalledOnce();
      expect(secondSource.start).toHaveBeenCalledOnce();

      await Promise.all([first, second]);
    });
  });

  describe('$stopPlayback', () => {
    test('stops the currently playing source', async () => {
      const samples = new Float32Array([0]);
      const playing = plugin.playSamples(samples, samples, 8000);
      plugin.$stopPlayback();
      expect(mockAudioContext.bufferSource.stop).toHaveBeenCalledOnce();
      await playing;
    });

    test('stops every currently active (stacked) source, not just the most recent', async () => {
      const samples = new Float32Array([0]);
      const first = plugin.playSamples(samples, samples, 8000);
      const firstSource = mockAudioContext.bufferSource;
      const second = plugin.playSamples(samples, samples, 8000);
      const secondSource = mockAudioContext.bufferSource;

      plugin.$stopPlayback();

      expect(firstSource.stop).toHaveBeenCalledOnce();
      expect(secondSource.stop).toHaveBeenCalledOnce();
      await Promise.all([first, second]);
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
