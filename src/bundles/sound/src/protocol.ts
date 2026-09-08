export const SOUND_CHANNEL_ID = 'sourceacademy-sound-channel';
export const SOUND_WEB_ID = 'sound-web';
export const SOUND_TAB_NAME = 'Sound';

/**
 * A recorded PCM buffer, always reported as two channels - `left`/`right` are the same Float32Array
 * (by reference) when the input device only has one channel (the common case: a mono microphone).
 */
export interface RecordedSamples {
  left: Float32Array<ArrayBuffer>;
  right: Float32Array<ArrayBuffer>;
  sampleRate: number;
}

/**
 * Host-side (browser main thread) operations the sound module's runner-side plugin invokes over
 * {@link SOUND_CHANNEL_ID} via Conductor's `makeRpc` helper. Actual AudioContext/MediaRecorder
 * access only works on the browser main thread, not inside Conductor's runner Worker, hence the
 * round trip instead of touching those APIs directly from the module.
 *
 * Methods prefixed with `$` are fire-and-forget (no reply is awaited); everything else is a normal
 * RPC call that resolves/rejects once the tab replies.
 */
export interface SoundTabRpc {
  /** Prompts for microphone access via getUserMedia; resolves once the user has responded. */
  requestMicPermission(): Promise<boolean>;
  /**
   * Opens a playback stream: the tab prepares to receive PCM chunks (via `$sendChunk`) and play them
   * back-to-back as they arrive, so audio starts after the first chunk rather than the whole Sound.
   * `streamId` identifies the stream for its lifetime; concurrent `play()` calls each open their own
   * and are mixed together. Fire-and-forget; the channel preserves order with the following calls.
   */
  $startStream(streamId: number, sampleRate: number): void;
  /**
   * Appends one PCM chunk to an open stream, scheduled immediately on the tab's AudioContext clock.
   * `left`/`right` are the same Float32Array (by reference) for a mono Sound. Fire-and-forget; the
   * chunks must arrive in order (the channel preserves send order).
   */
  $sendChunk(streamId: number, left: Float32Array<ArrayBuffer>, right: Float32Array<ArrayBuffer>): void;
  /**
   * Signals that no more chunks will be sent for `streamId` (sampling finished, or errored partway -
   * chunks that did arrive still play out). Unlike the two calls above this is acknowledged: it
   * resolves once the stream has actually finished *playing*, so the module can keep `activePlayCount`
   * accurate (recording refuses while a sound is still audibly playing).
   */
  endStream(streamId: number): Promise<void>;
  /**
   * Notifies the tab that `play()`/`play_in_tab()` has started sampling a Wave - the step between
   * here and the first `$sendChunk`/`addPlayerToTab` - so it can show "constructing" rather than
   * looking stalled while the first chunk is sampled. Acknowledged, not fire-and-forget: the tab may
   * still be loading (registerTab/showTab may not have happened) when play() starts, so awaiting the
   * reply is what guarantees the status is visible rather than racing the tab's own construction.
   */
  notifyConstructing(): Promise<void>;
  /** Stops any sound currently playing. */
  $stopPlayback(): void;
  /**
   * Adds a new entry to the tab's list of play bars (one per `play_in_tab()` call, stacked
   * vertically), each with its own native start/pause/scrub controls - unlike a playback stream,
   * this never plays anything automatically. `wavDataUri` is a self-contained `data:audio/wav;base64,...`
   * URI (encoded module-side - WAV encoding is pure computation, no AudioContext needed) that the
   * tab hands straight to a native `<audio>` element. Resolves once the entry has been added.
   */
  addPlayerToTab(wavDataUri: string): Promise<void>;
  /**
   * Adds a placeholder entry (no audio control - a Sound with no samples has nothing to play) to
   * the tab's list of play bars for a `play_in_tab()` call on a zero-duration Sound, taking the
   * same call-order position a normal entry would. Unlike `addPlayerToTab`, no sampling happens
   * for a zero-duration Sound, so there's no matching `notifyConstructing()` call to close out
   * here - a separate method from `addPlayerToTab` specifically so this doesn't touch that
   * bookkeeping.
   */
  addZeroDurationPlayerToTab(): Promise<void>;
  /** Starts recording from the previously-granted microphone; resolves once recording has actually started. */
  startRecording(): Promise<void>;
  /** Stops the current recording and resolves with the decoded PCM buffer(s). */
  stopRecording(): Promise<RecordedSamples>;
}
