import {
  red_of,
  blue_of,
  green_of,
  alpha_of,
  set_rgba,
  video_height,
  video_width,
  copy_image,
} from '../functions';

import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from '../constants';

const pixel: number[] = [255, 254, 253, 252];

// Test functions
test('red_of works correctly and returns the red component of a given Pixel', () => {
  expect(red_of(pixel)).toBe(255);
});

test('green_of works correctly and returns the green component of a given Pixel', () => {
  expect(green_of(pixel)).toBe(254);
});

test('blue_of works correctly and returns the blue component of a given Pixel', () => {
  expect(blue_of(pixel)).toBe(253);
});

test('alpha_of works correctly and returns the alpha component of a given Pixel', () => {
  expect(alpha_of(pixel)).toBe(252);
});

test('alpha_of works correctly and returns the alpha component of a given Pixel', () => {
  const test: number[] = [255, 254, 253, 252];
  set_rgba(test, 1, 2, 3, 4);
  expect(test).toEqual([1, 2, 3, 4]);
});

test('video_height works correctly and returns the height of output display', () => {
  expect(video_height()).toBe(DEFAULT_HEIGHT);
});

test('video_width works correctly and returns the width of output display', () => {
  expect(video_width()).toBe(DEFAULT_WIDTH);
});

describe('copy_image works correctly and returns the width of output display', () => {
  const src: number[][][] = [];
  const originalSrc: number[][][] = [];
  const dest: number[][][] = [];
  for (let i = 0; i < video_height(); i += 1) {
    src[i] = [];
    originalSrc[i] = [];
    dest[i] = [];
    for (let j = 0; j < video_width(); j += 1) {
      src[i][j] = [255, 255, 255, 255];
      originalSrc[i][j] = [255, 255, 255, 255];
      dest[i][j] = [0, 0, 0, 0];
    }
  }
  copy_image(src, dest);

  test('video is copied over to dest correctly', () => {
    expect(dest).toEqual(src);
  });

  test('src is not modified', () => {
    expect(src).toEqual(originalSrc);
  });
});

/**
 * Functions to do in the future:
 * install_filter, reset_filter, compose_filter,
 * snapshot, set_dimensions, set_fps, start,
 */

// describe('set_dimensions works correctly and modifies the dimensions of the output display', () => {
//   test('Invalid dimensions are ignored', () => {
//     set_dimensions(-50, 400);
//     runQueue();
//     expect(video_width()).toBe(DEFAULT_WIDTH);
//     expect(video_height()).toBe(DEFAULT_HEIGHT);
//   });

//   test('Valid dimensions are set', () => {
//     set_dimensions(200, 300);
//     runQueue();
//     expect(video_width()).toBe(200);
//     expect(video_height()).toBe(300);
//   });
// });
