import { SOUND_CHANNEL_ID, SOUND_WEB_ID, type RecordedSamples, type SoundTabRpc } from '@sourceacademy/bundle-sound/protocol';
import type { ITabService, Tab } from '@sourceacademy/common-tabs';
import { checkIsPluginClass, makeRpc, type IChannel, type IConduit, type IPlugin } from '@sourceacademy/conductor/conduit';
import { createElement, useSyncExternalStore } from 'react';

type Status = 'idle' | 'playing' | 'recording';

export const SOUND_TAB_ID = 'sound';

function SoundStatusView({ status, micGranted }: { status: Status, micGranted: boolean | null }) {
  const statusText = status === 'idle' ? 'Idle' : status === 'playing' ? 'Playing…' : 'Recording…';

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
        {statusText}
      </p>
      {micGranted !== null && (
        <p id="sound-mic-permission">
          Microphone access:
          {' '}
          {micGranted ? 'granted' : 'denied'}
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
  private __currentSource: AudioBufferSourceNode | undefined;
  private __mediaStream: MediaStream | undefined;
  private __mediaRecorder: MediaRecorder | undefined;
  private __recordedChunks: Blob[] = [];

  private __status: Status = 'idle';
  private __micGranted: boolean | null = null;

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
  }

  subscribe(listener: () => void): () => void {
    this.__listeners.add(listener);
    return () => this.__listeners.delete(listener);
  }

  destroy(): void {
    this.__currentSource?.stop();
    this.__mediaRecorder?.stop();
    this.__mediaStream?.getTracks().forEach(track => track.stop());
    void this.__audioContext?.close();
    this.__tabService.unregisterTab(SOUND_TAB_ID);
  }

  async requestMicPermission(): Promise<boolean> {
    try {
      this.__mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.__micGranted = true;
    } catch {
      this.__micGranted = false;
    }
    this.__emit();
    return this.__micGranted;
  }

  async playSamples(samples: Float32Array<ArrayBuffer>, sampleRate: number): Promise<void> {
    const audioContext = this.__ensureAudioContext();
    const buffer = audioContext.createBuffer(1, samples.length, sampleRate);
    buffer.copyToChannel(samples, 0);

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    this.__currentSource = source;
    this.__setStatus('playing');

    await new Promise<void>(resolve => {
      source.onended = () => resolve();
      source.start();
    });

    if (this.__currentSource === source) {
      this.__currentSource = undefined;
      this.__setStatus('idle');
    }
  }

  $stopPlayback(): void {
    this.__currentSource?.stop();
    this.__currentSource = undefined;
    this.__setStatus('idle');
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
    mediaRecorder.start();
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
    return {
      samples: audioBuffer.getChannelData(0),
      sampleRate: audioBuffer.sampleRate
    };
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
