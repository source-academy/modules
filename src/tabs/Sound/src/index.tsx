import { SOUND_CHANNEL_ID, SOUND_WEB_ID, type RecordedSamples, type SoundTabRpc } from '@sourceacademy/bundle-sound/protocol';
import type { ITabService, Tab } from '@sourceacademy/common-tabs';
import { checkIsPluginClass, makeRpc, type IChannel, type IConduit, type IPlugin } from '@sourceacademy/conductor/conduit';
import { createElement, useSyncExternalStore } from 'react';

type Status = 'idle' | 'constructing' | 'playing' | 'recording';

export const SOUND_TAB_ID = 'sound';

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
  // Repeated/looped play() calls queue to play one after another rather than overlapping, so in
  // practice at most one of these is active at a time - but tracked as a set (rather than a single
  // field) regardless, so stop()/status stay correct even if that ever changes.
  private readonly __activeSources = new Set<AudioBufferSourceNode>();
  private __mediaStream: MediaStream | undefined;
  private __mediaRecorder: MediaRecorder | undefined;
  private __recordedChunks: Blob[] = [];

  private __status: Status = 'idle';
  private __micGranted: boolean | null = null;
  private __destroyed = false;

  // The sound module's evaluator Worker is terminated as soon as the program finishes running,
  // which happens well before playback (dispatched fire-and-forget by play()) has actually
  // finished - so sequencing playback can no longer be the Worker's job (see functions.ts' play()).
  // This tab outlives the Worker, so it owns the queue instead: each playSamples() call only
  // starts once whatever's ahead of it in __playbackQueue has finished.
  private __playbackQueue: Promise<void> = Promise.resolve();
  // Bumped by $stopPlayback(), so anything still queued (not yet actually playing) at that point
  // recognises itself as stale and skips its turn instead of starting after a stop().
  private __stopGeneration = 0;

  // Number of notifyConstructing() calls not yet matched by their corresponding playSamples()
  // call arriving. Sampling (which happens between the two, entirely in the Worker) can take a
  // while for an expensive Sound, during which some earlier, independently-queued sound already
  // in __activeSources can finish and would otherwise reset status to 'idle' - clobbering the
  // 'constructing' status just set for the sound that's still being sampled. Tracking this
  // alongside __activeSources and recomputing status from both together (see
  // __updatePlaybackStatus) avoids that race instead of letting whichever event fires last win.
  private __constructingCount = 0;

  // Number of playSamples() calls accepted but not yet fully finished playing - covers both
  // whatever's currently in __activeSources AND whatever's still waiting its turn in
  // __playbackQueue. __activeSources alone hits 0 momentarily between one sound ending and the
  // next queued one actually starting (the queue drains asynchronously, not synchronously), which
  // - if destroy() already ran - used to be misread as "everything is done" and closed the
  // AudioContext mid-queue, silently killing every sound still waiting behind the one that just
  // finished. See __maybeFinalizeDestroy.
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
    function SoundPluginTab() {
      const status = useSyncExternalStore(subscribe, getStatus);
      const micGranted = useSyncExternalStore(subscribe, getMicGranted);
      return createElement(SoundStatusView, { status, micGranted });
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

  destroy(): void {
    // Called on every Run's teardown (the conductor is terminated as soon as the program
    // finishes evaluating), but sound's play() is intentionally fire-and-forget - a Run can
    // finish, and this conductor be terminated, well before audio dispatched via play() has
    // actually started or finished playing. Stopping active sources here would silence audio
    // right as playback begins. The mic, on the other hand, should always be released promptly.
    // The AudioContext is only closed once whatever's still playing (or still queued) finishes
    // naturally - see playSamples()'s completion handling below - or immediately here if nothing
    // is playing. The tab itself is intentionally left registered (showing 'idle' once playback
    // drains) rather than unregistered: it's replaced naturally when the next Run's
    // SoundTabPlugin re-registers under the same id, and removing it here previously left the
    // student on a blank tab strip the moment playback finished.
    this.__mediaRecorder?.stop();
    this.__mediaStream?.getTracks().forEach(track => track.stop());
    this.__destroyed = true;
    this.__maybeFinalizeDestroy();
  }

  /**
   * Closes the AudioContext once destroy() has run AND nothing - playing or still queued - is
   * left. Must be checked against __pendingPlaybackCount, not __activeSources.size: the latter is
   * 0 both when everything is truly finished and momentarily between any one sound ending and the
   * next queued one starting, and closing the context in that second case would break every sound
   * still waiting its turn.
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
    // ends here, whether this call plays immediately or is still queued behind another.
    this.__constructingCount = Math.max(0, this.__constructingCount - 1);
    // Counted from acceptance through to actually finishing playback (not just while active), so a
    // premature destroy() can't mistake "nothing playing this instant" for "nothing left at all"
    // while this call is still waiting its turn - see __maybeFinalizeDestroy.
    this.__pendingPlaybackCount++;
    const generation = this.__stopGeneration;
    const myTurn: Promise<void> = this.__playbackQueue.then(() => {
      // $stopPlayback() happened while this call was still queued behind another: skip playing it
      // entirely rather than starting late, after the student already asked for playback to stop.
      if (generation !== this.__stopGeneration) {
        this.__pendingPlaybackCount = Math.max(0, this.__pendingPlaybackCount - 1);
        this.__maybeFinalizeDestroy();
        return;
      }
      return this.__playOne(left, right, sampleRate);
    });
    // A rejected/skipped turn must not break the chain for whatever's queued after it.
    this.__playbackQueue = myTurn.catch(() => {});
    this.__updatePlaybackStatus();
    return myTurn;
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
    this.__stopGeneration++;
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
   * earlier, independently-queued sound finishing (dropping __activeSources to 0) while a later
   * sound is still being sampled (__constructingCount > 0) must stay 'constructing', not revert to
   * 'idle'.
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
    if (!this.__audioContext) {
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
