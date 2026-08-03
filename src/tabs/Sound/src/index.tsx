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

interface PlayerBarEntry {
  id: number;
  dataUri: string;
}

/**
 * Renders one play bar per `play_in_tab()` call, stacked vertically in call order - each bar is a
 * native `<audio controls>` element (start/pause/scrub for free from the browser), so multiple
 * calls can be compared/replayed independently of each other and of `play()`/`play_wave()`.
 */
function PlayerBarsView({ players }: { players: PlayerBarEntry[] }) {
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
          <audio
            src={player.dataUri}
            controls
            style={{ width: '100%' }}
            aria-labelledby={`sound-player-label-${player.id}`}
          />
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

  // Number of notifyConstructing() calls not yet matched by their corresponding playSamples()
  // call arriving. Sampling (which happens between the two, entirely in the Worker) can take a
  // while for an expensive Sound, during which some earlier, independently-dispatched sound
  // already in __activeSources can finish and would otherwise reset status to 'idle' - clobbering the
  // 'constructing' status just set for the sound that's still being sampled. Tracking this
  // alongside __activeSources and recomputing status from both together (see
  // __updatePlaybackStatus) avoids that race instead of letting whichever event fires last win.
  private __constructingCount = 0;

  // Number of playSamples() calls accepted but not yet fully finished playing. Tracked separately
  // from __activeSources.size (rather than just reading that directly) so a premature destroy()
  // can't mistake "the last active source just ended, but its completion handler hasn't run yet"
  // for "everything is done" and close the AudioContext out from under a source that's still
  // finishing up. See __maybeFinalizeDestroy.
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
    // The AudioContext is only closed once whatever's still playing finishes naturally - see
    // playSamples()'s completion handling below - or immediately here if nothing is playing. The
    // tab itself is intentionally left registered (showing 'idle' once playback
    // drains) rather than unregistered: it's replaced naturally when the next Run's
    // SoundTabPlugin re-registers under the same id, and removing it here previously left the
    // student on a blank tab strip the moment playback finished.
    this.__mediaRecorder?.stop();
    this.__mediaStream?.getTracks().forEach(track => track.stop());
    this.__destroyed = true;
    this.__maybeFinalizeDestroy();
  }

  /**
   * Closes the AudioContext once destroy() has run AND nothing is still playing. Must be checked
   * against __pendingPlaybackCount, not __activeSources.size: $stopPlayback() clears
   * __activeSources synchronously, but each stopped source's own __playOne() only finishes
   * (decrementing __pendingPlaybackCount) once its 'ended' event actually fires, one tick later -
   * closing the AudioContext in that gap would pull it out from under a source that's still in the
   * middle of stopping.
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

  playSamples(left: Float32Array<ArrayBuffer>, right: Float32Array<ArrayBuffer>, sampleRate: number): Promise<void> {
    // The matching notifyConstructing() call for this sound is done - its own status contribution
    // ends here, whether or not anything else is already playing.
    this.__constructingCount = Math.max(0, this.__constructingCount - 1);
    // Counted from acceptance through to actually finishing playback (not just while active), so a
    // premature destroy() can't mistake "nothing playing this instant" for "nothing left at all" -
    // see __maybeFinalizeDestroy.
    this.__pendingPlaybackCount++;
    // Starts immediately, overlapping whatever else is already in __activeSources - repeated/
    // looped play() calls are meant to play concurrently, not one after another.
    return this.__playOne(left, right, sampleRate);
  }

  /**
   * Adds a play_in_tab() entry to the tab's list of play bars. Purely additive bookkeeping - no
   * AudioContext/playback involved, since a play bar only actually plays once the cadet presses
   * its native controls.
   */
  async addPlayerToTab(wavDataUri: string): Promise<void> {
    const players = [...this.__players, { id: this.__nextPlayerId, dataUri: wavDataUri }];
    this.__players = players.length > MAX_PLAYER_BARS
      ? players.slice(players.length - MAX_PLAYER_BARS)
      : players;
    this.__nextPlayerId += 1;
    this.__emit();
  }

  private async __playOne(left: Float32Array<ArrayBuffer>, right: Float32Array<ArrayBuffer>, sampleRate: number): Promise<void> {
    const audioContext = this.__ensureAudioContext();
    const buffer = audioContext.createBuffer(2, left.length, sampleRate);
    buffer.copyToChannel(left, 0);
    buffer.copyToChannel(right, 1);

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    this.__activeSources.add(source);
    this.__updatePlaybackStatus();

    await new Promise<void>(resolve => {
      source.onended = () => resolve();
      source.start();
    });

    // Harmless no-op if $stopPlayback()/destroy() already removed this source (e.g. a stale
    // completion arriving after a stop() that started a fresh batch of sources) - only the last
    // one actually still active flips status back to idle.
    this.__activeSources.delete(source);
    this.__updatePlaybackStatus();
    this.__pendingPlaybackCount = Math.max(0, this.__pendingPlaybackCount - 1);
    this.__maybeFinalizeDestroy();
  }

  $stopPlayback(): void {
    for (const source of this.__activeSources) {
      source.stop();
    }
    this.__activeSources.clear();
    this.__updatePlaybackStatus();
  }

  /**
   * Recomputes status from the combined playback/constructing state instead of unconditionally
   * setting it, so whichever of notifyConstructing()/playSamples()/a source finishing happens to
   * fire last can't clobber a status that's still accurate for something else in flight - e.g. an
   * earlier, independently-dispatched sound finishing (dropping __activeSources to 0) while a
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
