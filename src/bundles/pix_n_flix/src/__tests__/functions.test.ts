import { describe, expect, it } from 'vitest';
import { assertPixelCoordinates, copyImageBuffer, makeImageBuffer, readChannel, writeChannel } from '../functions';

describe(makeImageBuffer, () => {
  it('creates an opaque black (0,0,0,255) buffer of the right size', () => {
    const buffer = makeImageBuffer(2, 3);
    expect(buffer.width).toBe(2);
    expect(buffer.height).toBe(3);
    expect(buffer.view.length).toBe(2 * 3 * 4);
    for (let y = 0; y < 3; y += 1) {
      for (let x = 0; x < 2; x += 1) {
        expect(readChannel(buffer, x, y, 0)).toBe(0);
        expect(readChannel(buffer, x, y, 1)).toBe(0);
        expect(readChannel(buffer, x, y, 2)).toBe(0);
        expect(readChannel(buffer, x, y, 3)).toBe(255);
      }
    }
  });
});

describe(assertPixelCoordinates, () => {
  const buffer = makeImageBuffer(4, 5);

  it('accepts in-range coordinates', () => {
    expect(() => assertPixelCoordinates(buffer, 0, 0, 0, 'get_pixel_value')).not.toThrow();
    expect(() => assertPixelCoordinates(buffer, 3, 4, 3, 'get_pixel_value')).not.toThrow();
  });

  it('rejects out-of-range x/y/p', () => {
    expect(() => assertPixelCoordinates(buffer, 4, 0, 0, 'get_pixel_value')).toThrow();
    expect(() => assertPixelCoordinates(buffer, 0, 5, 0, 'get_pixel_value')).toThrow();
    expect(() => assertPixelCoordinates(buffer, 0, 0, 4, 'get_pixel_value')).toThrow();
    expect(() => assertPixelCoordinates(buffer, -1, 0, 0, 'get_pixel_value')).toThrow();
    expect(() => assertPixelCoordinates(buffer, 1.5, 0, 0, 'get_pixel_value')).toThrow();
  });
});

describe('readChannel/writeChannel', () => {
  it('round-trips a written value', () => {
    const buffer = makeImageBuffer(2, 2);
    writeChannel(buffer, 1, 1, 2, 200, 'set_pixel_value', 'v');
    expect(readChannel(buffer, 1, 1, 2)).toBe(200);
    // Untouched channels/pixels are unaffected.
    expect(readChannel(buffer, 1, 1, 0)).toBe(0);
    expect(readChannel(buffer, 0, 0, 2)).toBe(0);
  });

  it('rejects an out-of-range value', () => {
    const buffer = makeImageBuffer(2, 2);
    expect(() => writeChannel(buffer, 0, 0, 0, 256, 'set_pixel_value', 'v')).toThrow();
    expect(() => writeChannel(buffer, 0, 0, 0, -1, 'set_pixel_value', 'v')).toThrow();
  });
});

describe(copyImageBuffer, () => {
  it('copies src pixel data into dest', () => {
    const src = makeImageBuffer(2, 2);
    writeChannel(src, 0, 0, 0, 10, 'set_pixel_value', 'v');
    writeChannel(src, 1, 1, 3, 42, 'set_pixel_value', 'v');
    const dest = makeImageBuffer(2, 2);

    copyImageBuffer(src, dest);

    expect(readChannel(dest, 0, 0, 0)).toBe(10);
    expect(readChannel(dest, 1, 1, 3)).toBe(42);
    // A copy, not a shared reference - mutating src afterward must not affect dest.
    writeChannel(src, 0, 0, 0, 99, 'set_pixel_value', 'v');
    expect(readChannel(dest, 0, 0, 0)).toBe(10);
  });

  it('rejects mismatched dimensions', () => {
    const src = makeImageBuffer(2, 2);
    const dest = makeImageBuffer(3, 2);
    expect(() => copyImageBuffer(src, dest)).toThrow();
  });
});
