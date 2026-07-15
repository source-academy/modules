export const SOUND_CHANNEL_ID = 'sourceacademy-sound-channel';
export const SOUND_WEB_ID = 'sound-web';
export const SOUND_TAB_NAME = 'Sound';

export interface RecordedSamples {
  samples: Float32Array<ArrayBuffer>;
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
  /** Plays a PCM buffer through the tab's AudioContext; resolves once playback completes. */
  playSamples(samples: Float32Array<ArrayBuffer>, sampleRate: number): Promise<void>;
  /** Stops any sound currently playing. */
  $stopPlayback(): void;
  /** Starts recording from the previously-granted microphone; resolves once recording has actually started. */
  startRecording(): Promise<void>;
  /** Stops the current recording and resolves with the decoded PCM buffer. */
  stopRecording(): Promise<RecordedSamples>;
}
