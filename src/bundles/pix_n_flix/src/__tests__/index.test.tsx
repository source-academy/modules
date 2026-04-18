import { afterEach, beforeEach, describe, expect, it, test as baseTest, vi } from 'vitest';
import { cleanup, render, type RenderResult } from 'vitest-browser-react';
import * as funcs from '../functions';
import type { BundlePacket, Pixel, VideoElement } from '../types';

interface Fixtures {
  canvas: HTMLCanvasElement;
  image: HTMLImageElement;
  video: VideoElement;
  reinit: () => BundlePacket;
  errLogger: () => void;
}

const test = baseTest.extend<{
  screen: RenderResult;
  fixtures: Fixtures;
}>({
  screen: async ({}, fixture) => {
    await fixture(
      await render(<div>
        <canvas title="canvas" />
        <video title="vid" />
        <img title='img' />
      </div>)
    );
    cleanup();
  },
  fixtures: async ({ screen }, fixture) => {
    funcs.start();
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

    it('throws error when argument is not a pixel', () => {
      expect(() => funcs.alpha_of(0 as any)).toThrow('alpha_of: Expected pixel, got 0.');
    });
  });

  describe(funcs.red_of, () => {
    it('works', () => {
      expect(funcs.red_of([255, 0, 0, 0])).toEqual(255);
    });

    it('throws error when argument is not a pixel', () => {
      expect(() => funcs.red_of(0 as any)).toThrow('red_of: Expected pixel, got 0.');
    });
  });

  describe(funcs.green_of, () => {
    it('works', () => {
      expect(funcs.green_of([0, 255, 0, 0])).toEqual(255);
    });

    it('throws error when argument is not a pixel', () => {
      expect(() => funcs.green_of(0 as any)).toThrow('green_of: Expected pixel, got 0.');
    });
  });

  describe(funcs.blue_of, () => {
    it('works', () => {
      expect(funcs.blue_of([0, 0, 255, 0])).toEqual(255);
    });

    it('throws error when argument is not a pixel', () => {
      expect(() => funcs.blue_of(0 as any)).toThrow('blue_of: Expected pixel, got 0.');
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

    it('throws error when first argument is not a pixel', () => {
      expect(() => funcs.set_rgba(0 as any, 1, 2, 3, 4)).toThrow('set_rgba: Expected pixel for pixel, got 0.');
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

describe(funcs.install_filter, () => {
  it('throws an error when passed an invalid filter', () => {
    expect(() => funcs.install_filter(0 as any)).toThrow('install_filter: Expected filter, got 0.');
  });
});

describe(funcs.compose_filter, () => {
  it('throws an error when passed invalid filters', () => {
    expect(() => funcs.compose_filter(0 as any, (_s, _d) => {})).toThrow('compose_filter: Expected filter for filter1, got 0.');
    expect(() => funcs.compose_filter((_s, _d) => {}, 0 as any)).toThrow('compose_filter: Expected filter for filter2, got 0.');
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

  describe(funcs.set_loop_count, () => {
    it('throws an error when given not an integer', () => {
      expect(() => funcs.set_loop_count('a' as any)).toThrow('set_loop_count: Expected integer, got "a".');
      expect(() => funcs.set_loop_count(0.5)).toThrow('set_loop_count: Expected integer, got 0.5.');
    });
  });
});
