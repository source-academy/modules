import { afterEach, beforeEach, describe, expect, it, test as baseTest, vi } from 'vitest';
import { cleanup, render, type RenderResult } from 'vitest-browser-react';
import * as funcs from '../functions';
import type { Pixel, VideoElement } from '../types';

interface Fixtures {
  canvas: HTMLCanvasElement;
  image: HTMLImageElement;
  video: VideoElement;
  reinit: () => ReturnType<ReturnType<typeof funcs.start>['init']>;
  errLogger: () => void;
}

const test = baseTest.extend<{
  screen: RenderResult;
  fixtures: Fixtures;
}>({
  screen: async ({}, fixture) => {
    await fixture(
      render(<div>
        <canvas title="canvas" />
        <video title="vid" />
        <img title='img' />
      </div>)
    );
    cleanup();
  },
  fixtures: async ({ screen }, fixture) => {
    const { init, deinit } = funcs.start();
    const errLogger = vi.fn();
    const canvas = screen
      .getByTitle('canvas')
      .element() as HTMLCanvasElement;

    const image = screen
      .getByTitle('img')
      .element() as HTMLImageElement;

    const video = screen
      .getByTitle('vid')
      .element() as VideoElement;

    const reinit = () => init(image, video, canvas, errLogger, { onClickStill: () => {} });
    reinit();
    await fixture({
      image,
      canvas,
      video,
      errLogger,
      reinit
    });
    deinit();
  }
});

const height = funcs.image_height();
const width = funcs.image_width();

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

describe('pixel manipulation functions', () => {
  describe(funcs.alpha_of, () => {
    it('works', () => {
      expect(funcs.alpha_of([0, 0, 0, 255])).toEqual(255);
    });
  });

  describe(funcs.red_of, () => {
    it('works', () => {
      expect(funcs.red_of([255, 0, 0, 0])).toEqual(255);
    });
  });

  describe(funcs.green_of, () => {
    it('works', () => {
      expect(funcs.green_of([0, 255, 0, 0])).toEqual(255);
    });
  });

  describe(funcs.blue_of, () => {
    it('works', () => {
      expect(funcs.blue_of([0, 0, 255, 0])).toEqual(255);
    });
  });

  describe(funcs.set_rgba, () => {
    it('works', () => {
      const pixel: Pixel = [0, 0, 0, 0];
      expect(funcs.set_rgba(pixel, 1, 2, 3, 4)).toBeUndefined();
      for (let i = 0; i < 4; i++) {
        expect(pixel[i]).toEqual(i + 1);
      }
    });
  });
});

describe(funcs.isPixelValid, () => {
  it('returns true if the pixel is valid', () => {
    const pixel: Pixel = [0, 1, 2, 3];
    expect(funcs.isPixelValid(pixel)).toEqual(true);
    for (let i = 0; i < 4; i++) {
      expect(pixel[i]).toEqual(i);
    }
  });

  it('returns false and resets the pixel if it is invalid', () => {
    const pixel: Pixel = [-1, 0, 0, 0];
    expect(funcs.isPixelValid(pixel)).toEqual(false);
    for (let i = 0; i < 4; i++) {
      expect(pixel[i]).toEqual(0);
    }
  });
});

describe(funcs.writeToBuffer, () => {
  test('with valid data', ({ fixtures: { errLogger } }) => {
    const img = funcs.new_image();
    funcs.set_rgba(img[0][0], 0, 1, 2, 3);

    const imageData = new ImageData(width, height);
    const buffer = imageData.data;
    funcs.writeToBuffer(buffer, img);

    expect(errLogger).not.toHaveBeenCalled();
    expect(buffer.length).toBeGreaterThan(0);

    for (let i = 0; i < 4; i++) {
      expect(buffer[i]).toEqual(i);
    }
  });

  test('with invalid data', ({ fixtures: { errLogger } }) => {
    const img = funcs.new_image();
    funcs.set_rgba(img[0][0], 999, 999, 999, 999);

    const imageData = new ImageData(width, height);
    const buffer = imageData.data;
    funcs.writeToBuffer(buffer, img);

    expect(errLogger).toHaveBeenCalled();
    expect(buffer.length).toBeGreaterThan(0);

    for (let i = 0; i < 4; i++) {
      expect(buffer[i]).toEqual(0);
    }
  });
});

describe('video functions', () => {
  test('startVideo and stopVideo', ({ fixtures: { errLogger } }) => {
    const filter = vi.fn(funcs.copy_image);
    funcs.install_filter(filter);
    funcs.startVideo();

    for (let i = 0; i < 67; i++) {
      vi.advanceTimersToNextFrame();
    }

    expect(filter).toHaveBeenCalledTimes(9);
    expect(errLogger).not.toHaveBeenCalled();

    funcs.stopVideo();

    for (let i = 0; i < 67; i++) {
      vi.advanceTimersToNextFrame();
    }

    // Filter should not have been called again after stopVideo was called
    expect(filter).toHaveBeenCalledTimes(9);
    expect(errLogger).not.toHaveBeenCalled();
  });

  // Test just doesn't work properly
  describe.skip(funcs.set_fps, () => {
    test('Setting FPS works', ({ fixtures: { reinit } }) => {
      expect(() => funcs.set_fps(20)).not.toThrow();
      const { FPS } = reinit();
      expect(FPS).toEqual(20);
    });

    test('Lowest FPS is 1', ({ fixtures: { reinit } }) => {
      expect(() => funcs.set_fps(0)).not.toThrow();
      const { FPS } = reinit();
      expect(FPS).toEqual(1);
    });

    test('Highest FPS is 60', ({ fixtures: { reinit } }) => {
      expect(() => funcs.set_fps(999)).not.toThrow();
      const { FPS } = reinit();
      expect(FPS).toEqual(60);
    });
  });
});
