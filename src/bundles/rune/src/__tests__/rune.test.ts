import { mat4 } from 'gl-matrix';
import { describe, expect, test, vi } from 'vitest';
import { Rune, drawRunesToFrameBuffer } from '../rune';

/**
 * Minimal WebGLRenderingContext stand-in covering just the calls made by
 * `initShaderProgram` and `drawRunesToFrameBuffer`. `texImage2D` is the call
 * under test: the 9-arg overload uploads the 1x1 placeholder pixel, the
 * 6-arg overload uploads the actual image.
 */
function createMockGl(events: string[]) {
  const gl = {
    FRAMEBUFFER: 'FRAMEBUFFER',
    VERTEX_SHADER: 'VERTEX_SHADER',
    FRAGMENT_SHADER: 'FRAGMENT_SHADER',
    COMPILE_STATUS: 'COMPILE_STATUS',
    TEXTURE_2D: 'TEXTURE_2D',
    RGBA: 'RGBA',
    UNSIGNED_BYTE: 'UNSIGNED_BYTE',
    TEXTURE_WRAP_S: 'TEXTURE_WRAP_S',
    TEXTURE_WRAP_T: 'TEXTURE_WRAP_T',
    CLAMP_TO_EDGE: 'CLAMP_TO_EDGE',
    TEXTURE_MIN_FILTER: 'TEXTURE_MIN_FILTER',
    LINEAR: 'LINEAR',
    TEXTURE0: 'TEXTURE0',
    ARRAY_BUFFER: 'ARRAY_BUFFER',
    STATIC_DRAW: 'STATIC_DRAW',
    FLOAT: 'FLOAT',
    TRIANGLES: 'TRIANGLES',

    bindFramebuffer: vi.fn(),
    createShader: vi.fn(() => ({})),
    shaderSource: vi.fn(),
    compileShader: vi.fn(),
    getShaderParameter: vi.fn(() => true),
    createProgram: vi.fn(() => ({})),
    attachShader: vi.fn(),
    linkProgram: vi.fn(),
    useProgram: vi.fn(),
    getAttribLocation: vi.fn(() => 0),
    getUniformLocation: vi.fn(() => ({})),
    uniform1i: vi.fn(),
    uniform4fv: vi.fn(),
    uniformMatrix4fv: vi.fn(),
    createBuffer: vi.fn(() => ({})),
    bindBuffer: vi.fn(),
    bufferData: vi.fn(),
    vertexAttribPointer: vi.fn(),
    enableVertexAttribArray: vi.fn(),
    createTexture: vi.fn(() => ({})),
    bindTexture: vi.fn(),
    texImage2D: vi.fn((...args: unknown[]) => {
      if (args.length === 6) events.push('texImage2D-with-image');
    }),
    activeTexture: vi.fn(),
    generateMipmap: vi.fn(),
    texParameteri: vi.fn(),
    drawArrays: vi.fn(() => events.push('drawArrays'))
  };
  return gl as unknown as WebGLRenderingContext;
}

function fakeTriangle(texture: HTMLImageElement) {
  return Rune.of({
    vertices: new Float32Array([
      -1, -1, 0, 1,
      1, -1, 0, 1,
      0, 1, 0, 1
    ]),
    texture
  });
}

describe(drawRunesToFrameBuffer, () => {
  test('waits for an already in-flight texture image to finish loading before uploading it (issue #891)', async () => {
    // Mirrors what `deserializeRune` (protocol.ts) hands to the draw path:
    // an `HTMLImageElement` whose fetch/decode may still be in progress.
    let onload: (() => void) | undefined;
    const fakeImage = {
      complete: false,
      naturalWidth: 0,
      width: 2,
      height: 2,
      src: 'https://example.com/paw.png',
      set onload(handler: () => void) { onload = handler; },
      get onload() { return onload as () => void; },
      onerror: null,
      onabort: null
    } as unknown as HTMLImageElement;

    const events: string[] = [];
    const gl = createMockGl(events);
    const rune = fakeTriangle(fakeImage);

    const drawPromise = drawRunesToFrameBuffer(
      gl,
      [rune],
      mat4.create(),
      new Float32Array([1, 1, 1, 1])
    );

    // The image hasn't loaded yet, so the real texture upload must not have
    // happened - flushing microtasks can't unblock it, only firing `onload` can.
    await Promise.resolve();
    await Promise.resolve();
    expect(events).not.toContain('texImage2D-with-image');

    (fakeImage as { complete: boolean }).complete = true;
    (fakeImage as { naturalWidth: number }).naturalWidth = 2;
    onload!();

    await drawPromise;

    expect(events.indexOf('texImage2D-with-image')).toBeGreaterThanOrEqual(0);
    expect(events.indexOf('texImage2D-with-image')).toBeLessThan(events.indexOf('drawArrays'));
  });

  test('uploads an already-loaded texture image without waiting', async () => {
    const fakeImage = {
      complete: true,
      naturalWidth: 2,
      width: 2,
      height: 2,
      src: 'https://example.com/paw.png'
    } as unknown as HTMLImageElement;

    const events: string[] = [];
    const gl = createMockGl(events);
    const rune = fakeTriangle(fakeImage);

    await drawRunesToFrameBuffer(gl, [rune], mat4.create(), new Float32Array([1, 1, 1, 1]));

    expect(events).toEqual(['texImage2D-with-image', 'drawArrays']);
  });

  test('rejects when a texture image already failed to load', async () => {
    const fakeImage = {
      complete: true,
      naturalWidth: 0,
      width: 0,
      height: 0,
      src: 'https://example.com/missing.png'
    } as unknown as HTMLImageElement;

    const gl = createMockGl([]);
    const rune = fakeTriangle(fakeImage);

    await expect(
      drawRunesToFrameBuffer(gl, [rune], mat4.create(), new Float32Array([1, 1, 1, 1]))
    ).rejects.toThrow('failed to load texture image');
  });
});
