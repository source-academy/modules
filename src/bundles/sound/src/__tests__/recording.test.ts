import { stringify } from 'js-slang/dist/utils/stringify';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi,
  type Mock
} from 'vitest';
import * as funcs from '../functions';
import { mockAudioContext, mockMediaRecorder } from './utils';

const mockStream = {} as MediaStream;
const mockedGetUserMedia: Mock<typeof navigator.mediaDevices.getUserMedia> = vi.fn()
  .mockResolvedValue(mockStream);

vi.spyOn(global, 'navigator', 'get').mockReturnValue({
  get mediaDevices() {
    return {
      getUserMedia: mockedGetUserMedia
    };
  }
} as any);

vi.stubGlobal('AudioContext', function () { return mockAudioContext; });
vi.stubGlobal('MediaRecorder', function () { return mockMediaRecorder; });
vi.stubGlobal('URL', class {
  static createObjectURL() {
    return '';
  }
});

beforeEach(() => {
  funcs.globalVars.recordedSound = null;
  funcs.globalVars.stream = null;
  funcs.globalVars.isPlaying = false;
  funcs.globalVars.audioplayer = null;
});

describe(funcs.init_record, () => {
  test('sets stream correctly when permission is accepted', async () => {
    expect(funcs.init_record()).toEqual('obtaining recording permission');
    await expect.poll(() => funcs.globalVars.stream).toBe(mockStream);
  });

  test('sets stream to false when permission is rejected', async () => {
    mockedGetUserMedia.mockRejectedValueOnce('');
    expect(funcs.init_record()).toEqual('obtaining recording permission');
    await expect.poll(() => funcs.globalVars.stream).toEqual(false);
  });
});

describe('Recording functions', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe(funcs.record, () => {
    test('throws error if called without init_record', () => {
      expect(() => funcs.record(0)).toThrowError('record: Call init_record(); to obtain permission to use microphone');
    });

    test('throws error if called concurrently with another sound', () => {
      funcs.play_wave(() => 0, 10);
      expect(() => funcs.record(1)).toThrowError('record: Cannot record while another sound is playing!');
    });

    test(`${funcs.record.name} works`, async () => {
      funcs.init_record();
      await expect.poll(() => funcs.globalVars.stream).toBe(mockStream);

      const stop = funcs.record(1);
      await vi.advanceTimersByTimeAsync(1200); // Mock waiting for the buffer duration
      expect(mockAudioContext.bufferSource.start).toHaveBeenCalledOnce(); // Assert that the recording signal was played
      mockAudioContext.close(); // End the recording signal playing

      await vi.advanceTimersByTimeAsync(100); // Advance past the end of the recording signal
      expect(mockMediaRecorder.start).toHaveBeenCalledOnce(); // Assert that recording started
      const soundPromise = stop(); // Call stop to stop recording

      expect(mockMediaRecorder.stop).toHaveBeenCalledOnce();
      expect(mockAudioContext.bufferSource.start).toHaveBeenCalledTimes(2); // Assert that the recording signal was played again
      mockAudioContext.close(); // End the recording signal playing

      // Resolving the promise before processing is done throws an error
      expect(soundPromise).toThrowError('recording still being processed');
      expect(stringify(soundPromise)).toEqual('<SoundPromise>');
      const mockRecordedSound = funcs.silence_sound(0);

      // Resolving the promise after processing is done doesn't throw an error
      funcs.globalVars.recordedSound = mockRecordedSound;
      expect(soundPromise()).toBe(mockRecordedSound);
    });
  });

  describe(funcs.record_for, () => {
    test('throws error if called without init_record', () => {
      expect(() => funcs.record_for(0, 0)).toThrowError('record_for: Call init_record(); to obtain permission to use microphone');
    });

    test('throws error if called concurrently with another sound', () => {
      funcs.play_wave(() => 0, 10);
      expect(() => funcs.record_for(1, 1)).toThrowError('record_for: Cannot record while another sound is playing!');
    });

    test(`${funcs.record_for.name} works`, async () => {
      funcs.init_record();
      await expect.poll(() => funcs.globalVars.stream).toBe(mockStream);

      const promise = funcs.record_for(5, 1);
      expect(stringify(promise)).toEqual('<SoundPromise>');
      await vi.advanceTimersByTimeAsync(200); // Advance time by the pre-record buffer duration (in ms)
      expect(mockAudioContext.bufferSource.start).toHaveBeenCalledOnce(); // Assert that the recording signal was played
      mockAudioContext.close(); // End the recording signal playing

      await vi.advanceTimersByTimeAsync(1100); // Advance time by recording signal and buffer duration
      expect(mockMediaRecorder.start).toHaveBeenCalledOnce(); // Assert that recording began

      await vi.advanceTimersByTimeAsync(5000); // Advance time by recording duration
      expect(mockMediaRecorder.stop).toHaveBeenCalledOnce(); // Assert that recording stopped
      expect(mockAudioContext.bufferSource.start).toHaveBeenCalledTimes(2); // Assert that the recording signal was played again
      mockAudioContext.close(); // End the recording signal playing
    });
  });
});
