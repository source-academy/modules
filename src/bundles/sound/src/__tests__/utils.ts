import { vi, type Mock } from 'vitest';

interface MockMediaRecorder {
  stop: () => void;
  start: Mock<() => void>;
  onstop?: () => void;
  ondataavailable?: () => void;
}

interface MockAudioBufferSource {
  buffer: MockAudioBuffer | null;
  node: AudioNode | null;
  isPlaying: boolean;
  connect: (node: AudioNode) => void;
  disconnect: (node: AudioNode) => void;
  start: () => void;
  stop: () => void;
  onended?: () => void;
}

interface MockAudioBuffer {
  getChannelData: (channel: number) => Float32Array<ArrayBuffer>;
}

interface MockAudioContext {
  bufferSource: MockAudioBufferSource;
  createBufferSource: () => MockAudioBufferSource;
  createBuffer: (channels: number, length: number, sampleRate: number) => MockAudioBuffer;
  decodeAudioData: (buffer: ArrayBuffer) => Promise<MockAudioBuffer>;
  close: () => void;
}

export const mockBufferSource: MockAudioBufferSource = {
  isPlaying: false,
  buffer: null,
  node: null,
  connect(node) {
    this.node = node;
  },
  disconnect: () => {},
  start() {
    this.isPlaying = true;
  },
  stop() {
    this.isPlaying = false;
    this.onended?.();
  }
};
vi.spyOn(mockBufferSource, 'start');

export const mockAudioContext: MockAudioContext = {
  bufferSource: mockBufferSource,
  createBufferSource: () => mockBufferSource,
  createBuffer: (channels, length) => ({
    getChannelData: () => new Float32Array<ArrayBuffer>(new ArrayBuffer(4 * length)),
  }),
  close() {
    return this.bufferSource.stop();
  },
  decodeAudioData() {
    return Promise.resolve(this.bufferSource.buffer!);
  },
};

export const mockMediaRecorder: MockMediaRecorder = {
  start: vi.fn(),
  stop() {
    this.onstop?.();
  }
};
vi.spyOn(mockMediaRecorder, 'stop');
