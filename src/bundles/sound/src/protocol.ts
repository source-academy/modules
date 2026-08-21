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
  /** Plays two PCM buffers through the tab's (2-channel) AudioContext; resolves once playback completes. */
  playSamples(left: Float32Array<ArrayBuffer>, right: Float32Array<ArrayBuffer>, sampleRate: number): Promise<void>;
  /**
   * Notifies the tab that `play()` has started sampling a Wave into a PCM buffer - a duration-
   * proportional step that happens entirely before `playSamples` is called, so the tab has no other
   * way to know playback is imminent rather than stalled. A normal (acknowledged) call rather than
   * fire-and-forget: the tab may still be loading (registerTab/showTab haven't necessarily happened
   * yet) when play() starts, and there's no other signal for "the host has finished loading the
   * tab" - awaiting the reply is what guarantees the status is actually visible before sampling
   * begins, rather than racing a message against the tab's own construction.
   */
  notifyConstructing(): Promise<void>;
  /** Stops any sound currently playing. */
  $stopPlayback(): void;
  /**
   * Adds a new entry to the tab's list of play bars (one per `play_in_tab()` call, stacked
   * vertically), each with its own native start/pause/scrub controls - unlike `playSamples`, this
   * never plays anything automatically. `wavDataUri` is a self-contained `data:audio/wav;base64,...`
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
