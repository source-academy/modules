import { SOUND_CHANNEL_ID, SOUND_WEB_ID, type RecordedSamples, type SoundTabRpc } from '@sourceacademy/bundle-sound/protocol';
import type { ITabService, Tab } from '@sourceacademy/common-tabs';
import { checkIsPluginClass, makeRpc, type IChannel, type IConduit, type IPlugin } from '@sourceacademy/conductor/conduit';
import { createElement, useSyncExternalStore } from 'react';

type Status = 'idle' | 'constructing' | 'playing' | 'recording';

export const SOUND_TAB_ID = 'sound';

// A loop calling play_in_tab() many times in one Run would otherwise grow __players (each entry
// holding a full base64 WAV data URI plus a rendered <audio> element) without bound for the life
// of that Run. Capped to the most recent entries instead.
const MAX_PLAYER_BARS = 50;

// Minimum time for adaptive preroll to wait before playback of streamed chunks to allow enough time
// for sample chunks to be generated.
const STREAM_PREROLL_MIN_SEC = 0.5;
// Upper bound on the adaptive preroll, capping worst-case startup latency for a slower sound function
// (past which playback may underrun rather than making the listener wait indefinitely).
const STREAM_PREROLL_MAX_SEC = 5;
// Headroom on the adaptive estimate, since the first chunk can be cheaper to sample than later ones.
const STREAM_PREROLL_MULTIPLIER = 1.25;

/**
 * Per-stream playback bookkeeping for the look-ahead scheduler. One entry exists per in-flight
 * `play()` stream (keyed by `streamId`), from `$startStream` until the stream has finished playing.
 */
interface StreamState {
  sampleRate: number;
  /** Expected total frames (for sizing the adaptive preroll), or 0 when it shouldn't be adapted. */
  totalFrames: number;
  /** `performance.now()` when the stream opened, used to time the first chunk's arrival. */
  openedAt: number;
  /** AudioContext-clock time at which the next chunk should start. Advanced by each chunk's length. */
  nextStartTime: number;
  /** False until the first chunk arrives (and playback actually begins). */
  started: boolean;
  /** True once `endStream` has been called: no more chunks will arrive. */
  inputEnded: boolean;
  /** Scheduled sources for this stream that have not yet fired 'ended'. */
  pending: number;
  /** Resolves the `endStream` promise once the stream has finished playing. */
  resolvePlayback?: () => void;
}

const STATUS_COLORS: Record<Status, string> = {
  idle: '#8A9BA8',
  constructing: '#B08D00',
  playing: '#238551',
  recording: '#C23030'
};

const STATUS_TEXT: Record<Status, string> = {
  idle: 'Idle',
  constructing: 'Constructing…',
  playing: 'Playing…',
  recording: 'Recording…'
};

function SoundStatusView({ status, micGranted }: { status: Status, micGranted: boolean | null }) {
  const statusText = STATUS_TEXT[status];

  return (
    <div>
      <p id="sound-default-text">
        The sound tab plays and records your sounds. Playback and microphone access happen here,
        on the page itself, since your browser only allows them on this page - not inside the
        sandboxed program evaluator.
      </p>
      <p id="sound-status">
        Status:
        {' '}
        <span
          style={{
            fontWeight: 700,
            color: STATUS_COLORS[status],
            textTransform: 'uppercase',
            letterSpacing: '0.02em'
          }}
        >
          {statusText}
        </span>
      </p>
      {micGranted !== null && (
        <p id="sound-mic-permission">
          Microphone access:
          {' '}
          <span style={{ fontWeight: 700, color: micGranted ? '#238551' : '#C23030' }}>
            {micGranted ? 'granted' : 'denied'}
          </span>
        </p>
      )}
    </div>
  );
}

export type PlayerBarEntry =
  | { id: number, kind: 'audio', dataUri: string }
  | { id: number, kind: 'zero-duration' };

/**
 * Renders one play bar per `play_in_tab()` call, stacked vertically in call order - a normal entry
 * is a native `<audio controls>` element (start/pause/scrub for free from the browser), so multiple
 * calls can be compared/replayed independently of each other and of `play()`/`play_wave()`. A
 * zero-duration Sound has nothing to play, so its entry is a plain placeholder line instead.
 * Exported (rather than kept module-private, like `SoundStatusView`) so it can be rendered
 * directly in tests, without needing to drive it through the full plugin/RPC wiring.
 */
export function PlayerBarsView({ players }: { players: PlayerBarEntry[] }) {
  if (players.length === 0) {
    return null;
  }
  return (
    <div id="sound-player-bars">
      {players.map((player, index) => (
        <div key={player.id} style={{ marginTop: '0.5em' }}>
          <p id={`sound-player-label-${player.id}`} style={{ margin: '0 0 0.25em 0' }}>
            {`Sound ${index + 1}`}
          </p>
          {player.kind === 'audio' ? (
            <audio
              src={player.dataUri}
              controls
              style={{ width: '100%' }}
              aria-labelledby={`sound-player-label-${player.id}`}
            />
          ) : (
            <p style={{ margin: 0, fontStyle: 'italic' }}>zero duration sound</p>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Host-side (browser main thread) counterpart of `SoundModulePlugin` (in the sound bundle),
 * implementing `SoundTabRpc` - actual AudioContext/MediaRecorder access only works here, not
 * inside Conductor's runner Worker. The tab itself is the web plugin: no separate plugin package
 * is registered alongside it, matching the rune migration's pattern.
 */
// eslint-disable-next-line @sourceacademy/tab-type
export default class SoundTabPlugin implements IPlugin, SoundTabRpc {
  readonly id = SOUND_WEB_ID;
  static readonly channelAttach = [SOUND_CHANNEL_ID];

  private readonly __tabService: ITabService;
  private readonly __listeners = new Set<() => void>();

  private __audioContext: AudioContext | undefined;
  // Repeated/looped play() calls now overlap (play concurrently) rather than queueing, so more
  // than one of these can genuinely be active at once - tracked as a set so stop()/status stay
  // correct regardless of how many are in flight simultaneously.
  private readonly __activeSources = new Set<AudioBufferSourceNode>();
  // One entry per in-flight play() stream (keyed by streamId). Overlapping play() calls each drive
  // their own scheduled chain, mixed together at the AudioContext destination.
  private readonly __streams = new Map<number, StreamState>();
  private __mediaStream: MediaStream | undefined;
  private __mediaRecorder: MediaRecorder | undefined;
  private __recordedChunks: Blob[] = [];

  private __status: Status = 'idle';
  private __micGranted: boolean | null = null;
  private __destroyed = false;

  // One entry per play_in_tab() call, in call order - rendered as a vertically-stacked list of
  // native <audio controls> play bars (see PlayerBarsView), independent of play()/stop().
  private __players: PlayerBarEntry[] = [];
  private __nextPlayerId = 0;

  // Number of notifyConstructing() calls not yet closed out by their sound starting to play (a
  // stream's first chunk arriving, addPlayerToTab, or endStream on a sound that produced no chunk).
  // While an expensive Sound's first chunk is still sampling, an earlier sound in __activeSources
  // can finish and would otherwise reset status to 'idle', clobbering the 'constructing' status of
  // the sound still being sampled. Recomputing status from both together (see __updatePlaybackStatus)
  // avoids that race instead of letting whichever event fires last win.
  private __constructingCount = 0;

  // Number of playback streams opened but not yet fully finished playing. Tracked separately from
  // __activeSources.size (rather than just reading that directly) so a premature destroy() can't
  // mistake "no source is scheduled this instant" (e.g. between two chunks of a still-open stream)
  // for "everything is done" and close the AudioContext out from under a stream that's still going.
  // See __maybeFinalizeDestroy.
  private __pendingPlaybackCount = 0;

  constructor(_conduit: IConduit, [soundChannel]: IChannel<any>[], tabService: ITabService) {
    if (!soundChannel) {
      throw new Error('Sound channel is required but was not provided.');
    }

    this.__tabService = tabService;
    makeRpc<SoundTabRpc, Record<string, never>>(soundChannel, this);

    const subscribe = (listener: () => void) => this.subscribe(listener);
    const getStatus = () => this.__status;
    const getMicGranted = () => this.__micGranted;
    const getPlayers = () => this.__players;
    function SoundPluginTab() {
      const status = useSyncExternalStore(subscribe, getStatus);
      const micGranted = useSyncExternalStore(subscribe, getMicGranted);
      const players = useSyncExternalStore(subscribe, getPlayers);
      return createElement('div', null, [
        createElement(SoundStatusView, { status, micGranted, key: 'status' }),
        createElement(PlayerBarsView, { players, key: 'players' })
      ]);
    }

    const tab = {
      id: SOUND_TAB_ID,
      iconName: 'music',
      body: createElement(SoundPluginTab),
      label: 'Sounds',
      disabled: false
    } satisfies Tab;

    this.__tabService.registerTab(tab);
    // registerTab alone leaves a tab invisible until something calls showTab - the tab is loaded
    // lazily (see SoundModulePlugin.__ensureTabLoaded), specifically so the student can see it the
    // moment the sound module actually starts using the host (play/record), so show it immediately.
    this.__tabService.showTab(SOUND_TAB_ID);
  }

  subscribe(listener: () => void): () => void {
    this.__listeners.add(listener);
    return () => this.__listeners.delete(listener);
  }

  getStatus(): Status {
    return this.__status;
  }

  getPlayers(): readonly PlayerBarEntry[] {
    return this.__players;
  }

  destroy(): void {
    // Called on every Run's teardown (the conductor is terminated as soon as the program
    // finishes evaluating), but sound's play() is intentionally fire-and-forget - a Run can
    // finish, and this conductor be terminated, well before audio dispatched via play() has
    // actually started or finished playing. Stopping active sources here would silence audio
    // right as playback begins. The mic, on the other hand, should always be released promptly.
    // The AudioContext is only closed once whatever's still playing finishes naturally (see
    // __finalizeStream), or immediately here if nothing is playing. The tab itself is intentionally
    // left registered (showing 'idle' once playback drains) rather than unregistered: it's replaced
    // naturally when the next Run's SoundTabPlugin re-registers under the same id, and removing it
    // here previously left the student on a blank tab strip the moment playback finished.
    this.__mediaRecorder?.stop();
    this.__mediaStream?.getTracks().forEach(track => track.stop());
    this.__destroyed = true;
    this.__maybeFinalizeDestroy();
  }

  /**
   * Closes the AudioContext once destroy() has run AND nothing is still playing. Must be checked
   * against __pendingPlaybackCount, not __activeSources.size: a stream stays "pending" from
   * $startStream until it has actually finished playing (or been stopped), which can be later than
   * the instant its last active source leaves __activeSources - closing the AudioContext in that gap
   * would pull it out from under a stream that's still finishing up.
   */
  private __maybeFinalizeDestroy(): void {
    if (this.__destroyed && this.__pendingPlaybackCount === 0) {
      void this.__audioContext?.close();
    }
  }

  async requestMicPermission(): Promise<boolean> {
    // A denied re-request would otherwise leave the previous stream's tracks running and
    // reusable by startRecording() even though __micGranted just became false.
    this.__mediaStream?.getTracks().forEach(track => track.stop());
    this.__mediaStream = undefined;
    try {
      this.__mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.__micGranted = true;
    } catch {
      this.__micGranted = false;
    }
    this.__emit();
    return this.__micGranted;
  }

  async notifyConstructing(): Promise<void> {
    this.__constructingCount++;
    this.__updatePlaybackStatus();
  }

  /**
   * Preroll for stream's first chunk, initially baseline, raised when the first chunk took longer to
   * sample than it will take to play, signalling that sampling can't keep pace with realtime, and 
   * that later chunks would underrun without a head start. `chunkFrames` is the first chunk's length.
   */
  private __streamPreroll(state: StreamState, chunkFrames: number): number {
    if (state.totalFrames === 0 || chunkFrames === 0) {
      // no timing provided or only 1 chunk; use default minimum preroll delay.
      return STREAM_PREROLL_MIN_SEC;
    }
    const chunkDuration = chunkFrames / state.sampleRate;
    const firstChunkSec = (performance.now() - state.openedAt) / 1000;
    const remainingChunks = Math.max(0, Math.ceil(state.totalFrames / chunkFrames) - 1);
    // Each remaining chunk arrives ~firstChunkSec apart but is consumed only chunkDuration apart; that
    // shortfall accumulates, and playback must not catch the producer before the last chunk lands.
    const estimate = remainingChunks * (firstChunkSec - chunkDuration) * STREAM_PREROLL_MULTIPLIER;
    return Math.min(STREAM_PREROLL_MAX_SEC, Math.max(STREAM_PREROLL_MIN_SEC, estimate));
  }

  $startStream(streamId: number, sampleRate: number, totalFrames: number): void {
    // Counted from open until playback finishes (not just while a source is active), so a premature
    // destroy() can't mistake "nothing playing right now" for "nothing left" - see
    // __maybeFinalizeDestroy. The notifyConstructing() count closes only when the first chunk plays
    // (see $sendChunk), so a still-sampling stream keeps showing "constructing", not idle.
    this.__pendingPlaybackCount++;
    this.__streams.set(streamId, {
      sampleRate,
      totalFrames,
      openedAt: performance.now(),
      nextStartTime: 0,
      started: false,
      inputEnded: false,
      pending: 0
    });
  }

  $sendChunk(streamId: number, left: Float32Array<ArrayBuffer>, right: Float32Array<ArrayBuffer>): void {
    const state = this.__streams.get(streamId);
    // No entry means the stream was already torn down (e.g. $stopPlayback), dropping late chunks.
    if (!state) {
      return;
    }
    const audioContext = this.__ensureAudioContext();
    const frames = left.length;

    if (!state.started) {
      state.started = true;
      // The stream's notifyConstructing() contribution ends the moment real playback begins.
      this.__constructingCount = Math.max(0, this.__constructingCount - 1);
      state.nextStartTime = audioContext.currentTime + this.__streamPreroll(state, frames);
    }

    const buffer = audioContext.createBuffer(2, frames, state.sampleRate);
    buffer.copyToChannel(left, 0);
    buffer.copyToChannel(right, 1);

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);

    // Never schedule in the past: if generation fell behind realtime and the cursor slipped before
    // now, restart from now (a small audible gap) rather than dropping the chunk entirely.
    const startAt = Math.max(state.nextStartTime, audioContext.currentTime);
    state.nextStartTime = startAt + frames / state.sampleRate;
    state.pending++;
    this.__activeSources.add(source);
    this.__updatePlaybackStatus();

    source.onended = () => {
      this.__activeSources.delete(source);
      this.__updatePlaybackStatus();
      const current = this.__streams.get(streamId);
      // Ignore a stale 'ended' for a stream already finalized (e.g. by $stopPlayback).
      if (!current) {
        return;
      }
      current.pending--;
      if (current.inputEnded && current.pending === 0) {
        this.__finalizeStream(streamId);
      }
    };
    source.start(startAt);
  }

  endStream(streamId: number): Promise<void> {
    const state = this.__streams.get(streamId);
    // Already finalized (e.g. stopped) - nothing left to wait on.
    if (!state) {
      return Promise.resolve();
    }
    state.inputEnded = true;
    if (!state.started) {
      // If no chunk ever arrived (e.g. sampling errored immediately), close out its still-open
      // notifyConstructing() contribution so status doesn't stay stuck on 'constructing'.
      this.__constructingCount = Math.max(0, this.__constructingCount - 1);
    }
    if (state.pending === 0) {
      this.__finalizeStream(streamId);
      return Promise.resolve();
    }
    return new Promise<void>(resolve => {
      state.resolvePlayback = resolve;
    });
  }

  /** Tears down a finished (or stopped) stream: resolves its endStream promise and updates counts. */
  private __finalizeStream(streamId: number): void {
    const state = this.__streams.get(streamId);
    if (!state) {
      return;
    }
    this.__streams.delete(streamId);
    state.resolvePlayback?.();
    this.__pendingPlaybackCount = Math.max(0, this.__pendingPlaybackCount - 1);
    this.__updatePlaybackStatus();
    this.__maybeFinalizeDestroy();
  }

  /**
   * Adds a play_in_tab() entry to the tab's list of play bars. Purely additive bookkeeping - no
   * AudioContext/playback involved, since a play bar only actually plays once the cadet presses
   * its native controls.
   */
  async addPlayerToTab(wavDataUri: string): Promise<void> {
    // play_in_tab() calls notifyConstructing() before sampling (which can take a while for a long
    // Sound); this arrives once sampling has finished, so its 'constructing' contribution ends here -
    // the play_in_tab() counterpart to a stream's first chunk starting playback.
    this.__constructingCount = Math.max(0, this.__constructingCount - 1);
    this.__pushPlayer({ id: this.__nextPlayerId, kind: 'audio', dataUri: wavDataUri });
    this.__updatePlaybackStatus();
  }

  /**
   * Adds a play_in_tab() entry for a zero-duration Sound - a placeholder line, since there's
   * nothing to sample or play. Deliberately a separate method from addPlayerToTab() rather than a
   * variant of it: no sampling happens for a zero-duration Sound, so play_in_tab() never calls
   * notifyConstructing() for one either, and this must not decrement __constructingCount on its
   * behalf - doing so here would incorrectly cancel out an unrelated, still-in-flight
   * notifyConstructing() from a genuinely concurrent play_in_tab() call on a real Sound.
   */
  async addZeroDurationPlayerToTab(): Promise<void> {
    this.__pushPlayer({ id: this.__nextPlayerId, kind: 'zero-duration' });
    this.__updatePlaybackStatus();
  }

  /** Shared append-with-cap logic behind addPlayerToTab()/addZeroDurationPlayerToTab(). */
  private __pushPlayer(entry: PlayerBarEntry): void {
    const players = [...this.__players, entry];
    this.__players = players.length > MAX_PLAYER_BARS
      ? players.slice(players.length - MAX_PLAYER_BARS)
      : players;
    this.__nextPlayerId += 1;
  }

  $stopPlayback(): void {
    for (const source of this.__activeSources) {
      source.stop();
    }
    this.__activeSources.clear();
    // Tear every stream down: resolve any pending endStream promises and settle the pending-playback
    // count. Finalizing (deleting the entry) also makes each stopped source's own 'ended' handler a
    // no-op, so it can't double-decrement.
    for (const streamId of [...this.__streams.keys()]) {
      this.__finalizeStream(streamId);
    }
    // Nothing is sampling towards playback anymore either.
    this.__constructingCount = 0;
    this.__updatePlaybackStatus();
  }

  /**
   * Recomputes status from the combined playback/constructing state instead of unconditionally
   * setting it, so whichever of notifyConstructing()/a chunk starting/a source finishing happens
   * to fire last can't clobber a status that's still accurate for something else in flight - e.g.
   * an earlier, independently-dispatched sound finishing (dropping __activeSources to 0) while a
   * later sound is still being sampled (__constructingCount > 0) must stay 'constructing', not
   * revert to 'idle'.
   */
  private __updatePlaybackStatus(): void {
    if (this.__activeSources.size > 0) {
      this.__setStatus('playing');
    } else if (this.__constructingCount > 0) {
      this.__setStatus('constructing');
    } else {
      this.__setStatus('idle');
    }
  }

  async startRecording(): Promise<void> {
    if (!this.__mediaStream) {
      throw new Error('Microphone permission has not been granted.');
    }

    const mediaRecorder = new MediaRecorder(this.__mediaStream);
    this.__mediaRecorder = mediaRecorder;
    this.__recordedChunks = [];
    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        this.__recordedChunks.push(event.data);
      }
    };

    // Resolves only once the recorder itself confirms it has actually started, matching the
    // SoundTabRpc contract - MediaRecorder.start() returning doesn't guarantee that yet.
    await new Promise<void>((resolve, reject) => {
      mediaRecorder.onstart = () => resolve();
      mediaRecorder.onerror = event => reject(event.error ?? new Error('MediaRecorder failed to start.'));
      mediaRecorder.start();
    });
    this.__setStatus('recording');
  }

  async stopRecording(): Promise<RecordedSamples> {
    const mediaRecorder = this.__mediaRecorder;
    if (!mediaRecorder) {
      throw new Error('No recording in progress.');
    }

    const blob = await new Promise<Blob>(resolve => {
      mediaRecorder.onstop = () => resolve(new Blob(this.__recordedChunks));
      mediaRecorder.stop();
    });
    this.__mediaRecorder = undefined;
    this.__setStatus('idle');

    const audioContext = this.__ensureAudioContext();
    const audioBuffer = await audioContext.decodeAudioData(await blob.arrayBuffer());
    const left = audioBuffer.getChannelData(0);
    // A mono microphone (the common case) only has one channel: left and right are the same
    // Float32Array, by reference.
    const right = audioBuffer.numberOfChannels > 1 ? audioBuffer.getChannelData(1) : left;
    return { left, right, sampleRate: audioBuffer.sampleRate };
  }

  private __ensureAudioContext(): AudioContext {
    // destroy() closes the context once nothing is pending (see __maybeFinalizeDestroy) but
    // doesn't reset this field - a closed context is unusable, so treat it the same as absent
    // rather than handing back a context that every subsequent call on it will reject.
    if (!this.__audioContext || this.__audioContext.state === 'closed') {
      this.__audioContext = new AudioContext();
    }
    return this.__audioContext;
  }

  private __setStatus(status: Status): void {
    this.__status = status;
    this.__emit();
  }

  private __emit(): void {
    this.__listeners.forEach(listener => listener());
  }
}
checkIsPluginClass(SoundTabPlugin);
