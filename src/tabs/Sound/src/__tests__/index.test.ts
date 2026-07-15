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

function createMockAudioContext() {
  const bufferSource = {
    buffer: null as AudioBuffer | null,
    onended: undefined as (() => void) | undefined,
    connect: vi.fn(),
    start: vi.fn(function (this: typeof bufferSource) {
      queueMicrotask(() => this.onended?.());
    }),
    stop: vi.fn()
  };

  return {
    bufferSource,
    destination: {},
    createBuffer: vi.fn((_channels: number, length: number, sampleRate: number) => ({
      length,
      sampleRate,
      copyToChannel: vi.fn(),
      getChannelData: vi.fn(() => new Float32Array(length))
    })),
    createBufferSource: vi.fn(() => bufferSource),
    decodeAudioData: vi.fn().mockResolvedValue({
      getChannelData: () => new Float32Array([0, 1, -1, 0]),
      sampleRate: 8000
    }),
    close: vi.fn().mockResolvedValue(undefined)
  };
}

function createMockMediaRecorder() {
  return {
    ondataavailable: undefined as ((event: { data: Blob }) => void) | undefined,
    onstop: undefined as (() => void) | undefined,
    start: vi.fn(),
    stop: vi.fn(function (this: { onstop?: () => void }) {
      queueMicrotask(() => this.onstop?.());
    })
  };
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
    test('plays a buffer through the AudioContext and resolves once playback ends', async () => {
      const samples = new Float32Array([0, 0.5, -0.5, 0]);
      await plugin.playSamples(samples, 8000);

      expect(mockAudioContext.createBuffer).toHaveBeenCalledWith(1, samples.length, 8000);
      expect(mockAudioContext.bufferSource.start).toHaveBeenCalledOnce();
    });
  });

  describe('$stopPlayback', () => {
    test('stops the currently playing source', async () => {
      const playing = plugin.playSamples(new Float32Array([0]), 8000);
      plugin.$stopPlayback();
      expect(mockAudioContext.bufferSource.stop).toHaveBeenCalledOnce();
      await playing;
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
  });

  describe('stopRecording', () => {
    test('throws if no recording is in progress', async () => {
      await expect(plugin.stopRecording()).rejects.toThrow('No recording in progress.');
    });

    test('stops recording and decodes the result', async () => {
      await plugin.requestMicPermission();
      await plugin.startRecording();

      const result = await plugin.stopRecording();

      expect(mockMediaRecorder.stop).toHaveBeenCalledOnce();
      expect(result.samples).toBeInstanceOf(Float32Array);
      expect(result.sampleRate).toEqual(8000);
    });
  });
});
