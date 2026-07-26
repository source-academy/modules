import { vi, type Mock } from 'vitest';
import type { RecordedSamples, SoundTabRpc } from '../protocol';

export interface MockSoundTabRpc extends SoundTabRpc {
  requestMicPermission: Mock<() => Promise<boolean>>;
  playSamples: Mock<(left: Float32Array<ArrayBuffer>, right: Float32Array<ArrayBuffer>, sampleRate: number) => Promise<void>>;
  notifyConstructing: Mock<() => Promise<void>>;
  $stopPlayback: Mock<() => void>;
  startRecording: Mock<() => Promise<void>>;
  stopRecording: Mock<() => Promise<RecordedSamples>>;
}

/**
 * A mock of the host (tab) side of the sound channel, standing in for real AudioContext/
 * MediaRecorder access - functions.ts never touches those APIs directly, only this bridge.
 */
export function mockSoundTabRpc(): MockSoundTabRpc {
  const emptySamples = new Float32Array(0);
  return {
    requestMicPermission: vi.fn().mockResolvedValue(true),
    playSamples: vi.fn().mockResolvedValue(undefined),
    notifyConstructing: vi.fn().mockResolvedValue(undefined),
    $stopPlayback: vi.fn(),
    startRecording: vi.fn().mockResolvedValue(undefined),
    stopRecording: vi.fn().mockResolvedValue({ left: emptySamples, right: emptySamples, sampleRate: 44100 })
  };
}
