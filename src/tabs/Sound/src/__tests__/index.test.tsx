import type { ITabService, Tab } from '@sourceacademy/common-tabs';
import type { IChannel } from '@sourceacademy/conductor/conduit';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-react';
import SoundTabPlugin, { PlayerBarsView, SOUND_TAB_ID, type PlayerBarEntry } from '..';

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
  const context = {
    get bufferSource() {
      return bufferSource;
    },
    // Mirrors the real AudioContext: starts 'running', flips to 'closed' once close() settles -
    // __ensureAudioContext() is expected to treat a closed context as unusable, not reuse it.
    state: 'running' as AudioContextState,
    // The streaming scheduler reads currentTime to place each chunk on the audio clock; a fixed 0
    // is enough for these tests (which assert scheduling happened, not exact timings).
    currentTime: 0,
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
    close: vi.fn(async () => {
      context.state = 'closed';
    })
  };
  return context;
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

/**
 * Drives a whole play() stream through the tab as functions.ts's play() does: open the stream, send
 * its (single, here) chunk, then end it. Returns the endStream promise, which resolves once the tab
 * reports the stream has finished playing.
 */
function playStream(
  plugin: SoundTabPlugin,
  left: Float32Array<ArrayBuffer>,
  right: Float32Array<ArrayBuffer>,
  sampleRate: number,
  streamId: number
): Promise<void> {
  plugin.$startStream(streamId, sampleRate, left.length);
  plugin.$sendChunk(streamId, left, right);
  return plugin.endStream(streamId);
}

describe(PlayerBarsView, () => {
  afterEach(() => {
    cleanup();
  });

  test('renders nothing when there are no players', async () => {
    const screen = await render(<PlayerBarsView players={[]} />);
    expect(screen.container.querySelector('#sound-player-bars')).toBeNull();
  });

  test('renders one labeled, native audio control per player, stacked vertically in call order', async () => {
    const players: PlayerBarEntry[] = [
      { id: 0, kind: 'audio', dataUri: 'data:audio/wav;base64,AAAA' },
      { id: 1, kind: 'audio', dataUri: 'data:audio/wav;base64,BBBB' },
      { id: 2, kind: 'audio', dataUri: 'data:audio/wav;base64,CCCC' }
    ];
    const screen = await render(<PlayerBarsView players={players} />);

    const audioElements = screen.container.querySelectorAll('audio');
    expect(audioElements).toHaveLength(3);
    // In DOM (and therefore visual) order, not just present somewhere - matches the issue's
    // "multiple bars arranged vertically" requirement, in the order play_in_tab() was called.
    expect([...audioElements].map(audio => audio.src)).toEqual([
      'data:audio/wav;base64,AAAA',
      'data:audio/wav;base64,BBBB',
      'data:audio/wav;base64,CCCC'
    ]);

    for (const [index, audio] of audioElements.entries()) {
      // Each control is associated with its own visible "Sound N" label for assistive tech, not
      // just visually adjacent to it.
      const labelId = audio.getAttribute('aria-labelledby');
      expect(labelId).not.toBeNull();
      expect(screen.container.querySelector(`#${labelId}`)?.textContent).toBe(`Sound ${index + 1}`);
    }
  });

  test('a later render with more players adds new bars below the existing ones, without disturbing them', async () => {
    const first: PlayerBarEntry[] = [{ id: 0, kind: 'audio', dataUri: 'data:audio/wav;base64,AAAA' }];
    const screen = await render(<PlayerBarsView players={first} />);
    expect(screen.container.querySelectorAll('audio')).toHaveLength(1);

    const second: PlayerBarEntry[] = [...first, { id: 1, kind: 'audio', dataUri: 'data:audio/wav;base64,BBBB' }];
    await screen.rerender(<PlayerBarsView players={second} />);

    const audioElements = screen.container.querySelectorAll('audio');
    expect([...audioElements].map(audio => audio.src)).toEqual([
      'data:audio/wav;base64,AAAA',
      'data:audio/wav;base64,BBBB'
    ]);
  });

  test('renders a "zero duration sound" placeholder instead of an audio control for a zero-duration entry', async () => {
    const players: PlayerBarEntry[] = [
      { id: 0, kind: 'audio', dataUri: 'data:audio/wav;base64,AAAA' },
      { id: 1, kind: 'zero-duration' },
      { id: 2, kind: 'audio', dataUri: 'data:audio/wav;base64,CCCC' }
    ];
    const screen = await render(<PlayerBarsView players={players} />);

    // Only the two audio entries get an <audio> control - the zero-duration one, with nothing to
    // play, does not.
    expect(screen.container.querySelectorAll('audio')).toHaveLength(2);
    await expect.element(screen.getByText('zero duration sound')).toBeInTheDocument();

    // Still takes its place in call order, with the same "Sound N" numbering scheme as the others,
    // rather than being skipped or renumbering what comes after it.
    const labels = [...screen.container.querySelectorAll('p[id^="sound-player-label-"]')].map(label => label.textContent);
    expect(labels).toEqual(['Sound 1', 'Sound 2', 'Sound 3']);
  });
});

describe(SoundTabPlugin, () => {
  let channel: MockChannel<any>;
  let tabService: MockTabService;
  let plugin: SoundTabPlugin;
  let mockAudioContext: ReturnType<typeof createMockAudioContext>;
  let mockMediaRecorder: ReturnType<typeof createMockMediaRecorder>;
  let mockStream: MediaStream;
  let getUserMedia: ReturnType<typeof vi.fn>;
  let audioContextConstructor: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockAudioContext = createMockAudioContext();
    mockMediaRecorder = createMockMediaRecorder();
    mockStream = {} as MediaStream;
    getUserMedia = vi.fn().mockResolvedValue(mockStream);

    // A spy (not just a stub) so tests can assert on how many times a fresh AudioContext was
    // actually constructed - always returns the current mockAudioContext, regardless of call count.
    audioContextConstructor = vi.fn(function (this: unknown) { return mockAudioContext; });
    vi.stubGlobal('AudioContext', audioContextConstructor);
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
    // AudioContext is only created lazily, on first use - play a stream first so one actually
    // exists to be closed.
    const samples = new Float32Array([0]);
    await playStream(plugin, samples, samples, 8000, 1);

    plugin.destroy();
    expect(mockAudioContext.close).toHaveBeenCalledOnce();
  });

  test('destroy defers closing the AudioContext until in-flight playback finishes', async () => {
    const samples = new Float32Array([0]);
    const playing = playStream(plugin, samples, samples, 8000, 1);
    plugin.destroy();
    expect(mockAudioContext.close).not.toHaveBeenCalled();

    await playing;
    expect(mockAudioContext.close).toHaveBeenCalledOnce();
  });

  test('destroy does not close the AudioContext until every open stream has finished', async () => {
    // Regression test: two overlapping streams each hold the AudioContext open until both are
    // actually done, not just the first one to finish. Chunks are sent (so both streams have a
    // scheduled source) but endStream is withheld, so each stream stays "pending" independently of
    // its mocked source's own 'ended' - it's endStream that finally settles each one.
    const samples = new Float32Array([0]);
    plugin.$startStream(1, 8000, samples.length);
    plugin.$sendChunk(1, samples, samples);
    plugin.$startStream(2, 8000, samples.length);
    plugin.$sendChunk(2, samples, samples);
    // Let the mocked sources' 'ended' events fire; the streams still aren't done (no endStream yet).
    await new Promise(resolve => setTimeout(resolve, 0));

    plugin.destroy();
    expect(mockAudioContext.close).not.toHaveBeenCalled();
    expect(mockAudioContext.createBufferSource).toHaveBeenCalledTimes(2);

    await plugin.endStream(1);
    // The first stream finished, but the second (started concurrently) is still open.
    expect(mockAudioContext.close).not.toHaveBeenCalled();

    await plugin.endStream(2);
    // Now both have actually finished.
    expect(mockAudioContext.close).toHaveBeenCalledOnce();
  });

  test('a later stream after destroy() has closed the AudioContext gets a fresh one instead of reusing the closed one', async () => {
    // Regression test: destroy() closes the AudioContext but never resets the field pointing at
    // it. Without checking .state, __ensureAudioContext() would hand back the same, now-unusable
    // closed context to a later stream (e.g. one whose sampling was still running when the Run
    // ended).
    const samples = new Float32Array([0]);
    await playStream(plugin, samples, samples, 8000, 1);
    expect(audioContextConstructor).toHaveBeenCalledOnce();

    plugin.destroy();
    expect(mockAudioContext.state).toBe('closed');

    await expect(playStream(plugin, samples, samples, 8000, 2)).resolves.toBeUndefined();
    expect(audioContextConstructor).toHaveBeenCalledTimes(2);
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

  describe('playback streams', () => {
    test('plays a streamed 2-channel chunk through the AudioContext and resolves once playback ends', async () => {
      const left = new Float32Array([0, 0.5, -0.5, 0]);
      const right = new Float32Array([0, -0.5, 0.5, 0]);
      await playStream(plugin, left, right, 8000, 1);

      expect(mockAudioContext.createBuffer).toHaveBeenCalledWith(2, left.length, 8000);
      expect(mockAudioContext.bufferSource.start).toHaveBeenCalledOnce();
    });

    test('a chunk is scheduled to start as soon as it arrives, without waiting for endStream', () => {
      const samples = new Float32Array([0]);
      plugin.$startStream(1, 8000, samples.length);
      plugin.$sendChunk(1, samples, samples);
      // The source is created and started synchronously on the chunk arriving - playback begins
      // before sampling has even finished (endStream not called yet).
      expect(mockAudioContext.createBufferSource).toHaveBeenCalledOnce();
      expect(mockAudioContext.bufferSource.start).toHaveBeenCalledOnce();
      expect(plugin.getStatus()).toBe('playing');
    });

    test('concurrent streams overlap: a second stream\'s chunk starts without waiting for the first to finish', async () => {
      const samples = new Float32Array([0]);
      plugin.$startStream(1, 8000, samples.length);
      plugin.$sendChunk(1, samples, samples);
      const firstSource = mockAudioContext.bufferSource;
      plugin.$startStream(2, 8000, samples.length);
      plugin.$sendChunk(2, samples, samples);
      const secondSource = mockAudioContext.bufferSource;

      // Both sources were created and started synchronously, before either has had any chance to
      // finish - no queueing.
      expect(secondSource).not.toBe(firstSource);
      expect(mockAudioContext.createBufferSource).toHaveBeenCalledTimes(2);
      expect(firstSource.start).toHaveBeenCalledOnce();
      expect(secondSource.start).toHaveBeenCalledOnce();

      await Promise.all([plugin.endStream(1), plugin.endStream(2)]);
    });

    test('a chunk of a stream that was never opened (or already stopped) is dropped', () => {
      const samples = new Float32Array([0]);
      // No $startStream for id 99 - a late/stray chunk must not touch the AudioContext.
      plugin.$sendChunk(99, samples, samples);
      expect(mockAudioContext.createBufferSource).not.toHaveBeenCalled();
    });

    test('an earlier stream finishing does not clobber a later sound\'s still-in-flight constructing status', async () => {
      // Regression test: notifyConstructing() (the first chunk of an expensive Sound can take a
      // while to sample, in the Worker) and the stream's chunks are independent messages. A first,
      // already-playing stream can finish while a second sound is still being sampled (no chunk
      // yet) - that completion must not reset status to 'idle' out from under the second sound's
      // still-active 'constructing' status.
      const samples = new Float32Array([0]);
      const first = playStream(plugin, samples, samples, 8000, 1);
      // The chunk starts the source and updates status synchronously - no await needed.
      expect(plugin.getStatus()).toBe('playing');

      // Called synchronously, without yielding control back to the microtask queue in between, so
      // the first stream's own (mocked, microtask-scheduled) completion can't have run yet.
      void plugin.notifyConstructing(); // a second, unrelated sound starts sampling
      expect(plugin.getStatus()).toBe('playing'); // first stream is still audibly playing

      await first;
      await new Promise(resolve => setTimeout(resolve, 0));
      // The first stream finished, but the second is still being sampled (no chunk has arrived
      // yet) - status must reflect that, not revert to idle.
      expect(plugin.getStatus()).toBe('constructing');

      plugin.$startStream(2, 8000, samples.length); // the second sound's first chunk finally arrives
      plugin.$sendChunk(2, samples, samples);
      // Asserted synchronously, before the mocked source's immediate 'ended' fires: the second
      // sound is now the one audibly playing.
      expect(plugin.getStatus()).toBe('playing');
    });
  });

  describe('$stopPlayback', () => {
    test('stops the currently playing source', () => {
      const samples = new Float32Array([0]);
      plugin.$startStream(1, 8000, samples.length);
      plugin.$sendChunk(1, samples, samples);
      const source = mockAudioContext.bufferSource;

      plugin.$stopPlayback();
      expect(source.stop).toHaveBeenCalledOnce();
    });

    test('stops every currently-playing source when several streams are playing concurrently', () => {
      const samples = new Float32Array([0]);
      plugin.$startStream(1, 8000, samples.length);
      plugin.$sendChunk(1, samples, samples);
      const firstSource = mockAudioContext.bufferSource;
      plugin.$startStream(2, 8000, samples.length);
      plugin.$sendChunk(2, samples, samples);
      const secondSource = mockAudioContext.bufferSource;

      plugin.$stopPlayback();
      expect(firstSource.stop).toHaveBeenCalledOnce();
      expect(secondSource.stop).toHaveBeenCalledOnce();
    });

    test('resolves a pending endStream once its stream is stopped', async () => {
      const samples = new Float32Array([0]);
      plugin.$startStream(1, 8000, samples.length);
      plugin.$sendChunk(1, samples, samples);
      // endStream would normally resolve when playback finishes; stopping should resolve it too,
      // so the module's activePlayCount bookkeeping doesn't hang.
      const ending = plugin.endStream(1);
      plugin.$stopPlayback();
      await expect(ending).resolves.toBeUndefined();
    });
  });

  describe('addPlayerToTab', () => {
    test('resolves without throwing', async () => {
      await expect(plugin.addPlayerToTab('data:audio/wav;base64,AAAA')).resolves.toBeUndefined();
    });

    test('does not touch the AudioContext or activeSources - it only adds a UI entry', async () => {
      await plugin.addPlayerToTab('data:audio/wav;base64,AAAA');
      expect(mockAudioContext.createBufferSource).not.toHaveBeenCalled();
      expect(mockAudioContext.createBuffer).not.toHaveBeenCalled();
    });

    test('notifies subscribers so a rendered player list can pick up the new entry', async () => {
      const listener = vi.fn();
      plugin.subscribe(listener);
      await plugin.addPlayerToTab('data:audio/wav;base64,AAAA');
      expect(listener).toHaveBeenCalled();
    });

    test('caps the player list to the most recent entries instead of growing without bound', async () => {
      // Regression test: a loop calling play_in_tab() many times in one Run must not accumulate
      // an ever-growing list of full WAV data URIs and rendered <audio> elements for the tab's
      // lifetime - only the most recent entries are kept.
      const total = 55;
      for (let i = 0; i < total; i += 1) {
        await plugin.addPlayerToTab(`data:audio/wav;base64,entry-${i}`);
      }

      const players = plugin.getPlayers();
      expect(players.length).toBeLessThan(total);
      const dataUris = players.map(player => (player.kind === 'audio' ? player.dataUri : undefined));
      // The most recent entry is always kept, regardless of the cap.
      expect(dataUris.at(-1)).toBe(`data:audio/wav;base64,entry-${total - 1}`);
      // The oldest entries are the ones dropped, not ones from the middle.
      expect(dataUris).not.toContain('data:audio/wav;base64,entry-0');
    });

    test('closes out the matching notifyConstructing() call, like playSamples() does for play()', async () => {
      // Regression test: play_in_tab() calls notifyConstructing() before sampling a long Sound, so
      // the tab should show 'constructing' status until addPlayerToTab() (its equivalent of
      // playSamples()) actually arrives - not stay stuck there forever.
      void plugin.notifyConstructing();
      expect(plugin.getStatus()).toBe('constructing');

      await plugin.addPlayerToTab('data:audio/wav;base64,AAAA');
      expect(plugin.getStatus()).toBe('idle');
    });
  });

  describe('addZeroDurationPlayerToTab', () => {
    test('adds a zero-duration entry, taking its place in call order alongside audio entries', async () => {
      await plugin.addPlayerToTab('data:audio/wav;base64,AAAA');
      await plugin.addZeroDurationPlayerToTab();
      await plugin.addPlayerToTab('data:audio/wav;base64,CCCC');

      const players = plugin.getPlayers();
      expect(players.map(player => player.kind)).toEqual(['audio', 'zero-duration', 'audio']);
    });

    test('notifies subscribers so a rendered player list can pick up the new entry', async () => {
      const listener = vi.fn();
      plugin.subscribe(listener);
      await plugin.addZeroDurationPlayerToTab();
      expect(listener).toHaveBeenCalled();
    });

    test('does not touch __constructingCount - unlike addPlayerToTab(), there is no matching notifyConstructing() call to close out', async () => {
      // Regression test: a zero-duration Sound is never sampled, so play_in_tab() never calls
      // notifyConstructing() for one - addZeroDurationPlayerToTab() must not decrement that count
      // regardless, or it could wrongly cancel out an unrelated, still-in-flight
      // notifyConstructing() from a genuinely concurrent play_in_tab() call on a real Sound.
      void plugin.notifyConstructing(); // an unrelated, concurrent play_in_tab() call is sampling
      expect(plugin.getStatus()).toBe('constructing');

      await plugin.addZeroDurationPlayerToTab();
      expect(plugin.getStatus()).toBe('constructing');
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
