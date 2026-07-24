import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import * as funcs from '../functions';
import { mockSoundTabRpc, type MockSoundTabRpc } from './utils';

let io: MockSoundTabRpc;

beforeEach(() => {
  io = mockSoundTabRpc();
  funcs.setSoundIO(io);
  funcs.globalVars.micPermissionGranted = null;
  funcs.globalVars.activePlayCount = 0;
});

describe(funcs.init_record, () => {
  test('grants permission when the host allows it', async () => {
    await expect(funcs.init_record()).resolves.toEqual('permission granted');
    expect(funcs.globalVars.micPermissionGranted).toBe(true);
  });

  test('records permission denial', async () => {
    io.requestMicPermission.mockResolvedValueOnce(false);
    await expect(funcs.init_record()).resolves.toEqual('permission denied');
    expect(funcs.globalVars.micPermissionGranted).toBe(false);
  });

  test('resolves only once the host actually responds, not immediately', async () => {
    let resolvePermission: (granted: boolean) => void;
    io.requestMicPermission.mockReturnValueOnce(new Promise(resolve => { resolvePermission = resolve; }));

    let resolved = false;
    const initializing = funcs.init_record().then(result => {
      resolved = true;
      return result;
    });

    expect(resolved).toBe(false);
    expect(funcs.globalVars.micPermissionGranted).toBeNull();

    resolvePermission!(true);
    await expect(initializing).resolves.toEqual('permission granted');
    expect(resolved).toBe(true);
  });
});

describe('Recording functions', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe(funcs.record, () => {
    test('throws error if called without init_record', () => {
      expect(() => funcs.record(0)).toThrowError('record: Call init_record(); to obtain permission to use microphone');
    });

    test('throws error if permission was denied', async () => {
      vi.useRealTimers();
      io.requestMicPermission.mockResolvedValueOnce(false);
      await funcs.init_record();
      vi.useFakeTimers();

      expect(() => funcs.record(0)).toThrowError(/Permission has been denied/);
    });

    test('throws error if called concurrently with another sound', () => {
      funcs.globalVars.activePlayCount = 1;
      expect(() => funcs.record(1)).toThrowError('record: Cannot record while another sound is playing!');
    });

    test(`${funcs.record.name} works`, async () => {
      vi.useRealTimers();
      await funcs.init_record();
      vi.useFakeTimers();

      const samples = new Float32Array([0, 0.5, -0.5, 0]);
      const sampleRate = 8000;
      io.stopRecording.mockResolvedValue({ left: samples, right: samples, sampleRate });

      const stop = funcs.record(1);
      // pre-recording pause (200ms) + buffer (1000ms) + recording signal duration (100ms)
      await vi.advanceTimersByTimeAsync(1300);
      expect(io.startRecording).toHaveBeenCalledOnce();

      const soundPromise = stop();
      await vi.advanceTimersByTimeAsync(0);
      expect(io.stopRecording).toHaveBeenCalledOnce();

      // The returned promise genuinely waits for processing to finish, rather than needing to be
      // called again later.
      const sound = await soundPromise();
      expect(funcs.get_duration(sound)).toBeCloseTo(samples.length / sampleRate);
      // A mono mic (left === right, same Float32Array) produces a Sound with left=right automatically.
      expect(funcs.get_left_wave(sound)).toBe(funcs.get_right_wave(sound));
    });

    test('the sound promise resolves only once processing has actually finished, not immediately', async () => {
      vi.useRealTimers();
      await funcs.init_record();
      vi.useFakeTimers();

      let resolveStopRecording: (samples: { left: Float32Array<ArrayBuffer>; right: Float32Array<ArrayBuffer>; sampleRate: number }) => void;
      io.stopRecording.mockReturnValueOnce(new Promise(resolve => { resolveStopRecording = resolve; }));

      const stop = funcs.record(1);
      await vi.advanceTimersByTimeAsync(1300);

      let resolved = false;
      const soundPromise = stop();
      const sound = soundPromise().then(s => {
        resolved = true;
        return s;
      });
      await vi.advanceTimersByTimeAsync(0);
      expect(resolved).toBe(false);

      const samples = new Float32Array([0]);
      resolveStopRecording!({ left: samples, right: samples, sampleRate: 8000 });
      await expect(sound).resolves.toBeDefined();
      expect(resolved).toBe(true);
    });

    test('a genuinely stereo input device produces a Sound with different left/right channels', async () => {
      vi.useRealTimers();
      await funcs.init_record();
      vi.useFakeTimers();

      const left = new Float32Array([0, 1, 0, -1]);
      const right = new Float32Array([0, -1, 0, 1]);
      const sampleRate = 8000;
      io.stopRecording.mockResolvedValue({ left, right, sampleRate });

      const stop = funcs.record(1);
      await vi.advanceTimersByTimeAsync(1300);
      const soundPromise = stop();
      await vi.advanceTimersByTimeAsync(0);

      const sound = await soundPromise();
      expect(funcs.get_left_wave(sound)).not.toBe(funcs.get_right_wave(sound));
    });
  });

  describe(funcs.record_for, () => {
    test('throws error if called without init_record', () => {
      expect(() => funcs.record_for(0, 0)).toThrowError('record_for: Call init_record(); to obtain permission to use microphone');
    });

    test('throws error if called concurrently with another sound', () => {
      funcs.globalVars.activePlayCount = 1;
      expect(() => funcs.record_for(1, 1)).toThrowError('record_for: Cannot record while another sound is playing!');
    });

    test(`${funcs.record_for.name} works`, async () => {
      vi.useRealTimers();
      await funcs.init_record();
      vi.useFakeTimers();

      const samples = new Float32Array([0, 1, 0, -1]);
      const sampleRate = 4000;
      io.stopRecording.mockResolvedValue({ left: samples, right: samples, sampleRate });

      const promise = funcs.record_for(2, 0.5);
      // pre-recording pause (200ms) + recording signal duration (100ms) + buffer (500ms) + recording duration (2000ms)
      await vi.advanceTimersByTimeAsync(2900);

      expect(io.startRecording).toHaveBeenCalledOnce();
      expect(io.stopRecording).toHaveBeenCalledOnce();

      const sound = await promise();
      expect(funcs.get_duration(sound)).toBeCloseTo(samples.length / sampleRate);
    });
  });
});
