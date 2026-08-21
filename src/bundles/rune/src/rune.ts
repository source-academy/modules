import { EvaluatorRuntimeError } from '@sourceacademy/conductor/common';
import { RENDER_THUMBNAIL_SYMBOL } from '@sourceacademy/modules-lib/conductor/thumbnail';
import { glAnimation, type AnimFrame, type ReplResult } from '@sourceacademy/modules-lib/types';
import { mat4 } from 'gl-matrix';
import { getWebGlFromCanvas, initShaderProgram } from './runes_webgl';

const normalVertexShader = `
attribute vec4 aVertexPosition;
uniform vec4 uVertexColor;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uCameraMatrix;

varying lowp vec4 vColor;
varying highp vec2 vTexturePosition;
varying lowp float colorFactor;
void main(void) {
  gl_Position = uProjectionMatrix * uCameraMatrix * uModelViewMatrix * aVertexPosition;
  vColor = uVertexColor;

  // texture position is in [0,1], vertex position is in [-1,1]
  vTexturePosition.x = (aVertexPosition.x + 1.0) / 2.0;
  vTexturePosition.y = 1.0 - (aVertexPosition.y + 1.0) / 2.0;

  colorFactor = gl_Position.z;
}
`;

const normalFragmentShader = `
precision mediump float;
uniform bool uRenderWithTexture;
uniform bool uRenderWithDepthColor;
uniform sampler2D uTexture;
varying lowp float colorFactor;
uniform vec4 uColorFilter;


varying lowp vec4 vColor;
varying highp vec2 vTexturePosition;
void main(void) {
  if (uRenderWithTexture){
    gl_FragColor = texture2D(uTexture, vTexturePosition);
  } else {
    gl_FragColor = vColor;
  }
  if (uRenderWithDepthColor){
    gl_FragColor += (colorFactor + 0.5) * (1.0 - gl_FragColor);
    gl_FragColor.a = 1.0;
  }
  gl_FragColor = uColorFilter * gl_FragColor + 1.0 - uColorFilter;
  gl_FragColor.a = 1.0;
}
`;

interface RuneOfParams {
  vertices?: Float32Array;
  colors?: Float32Array | null;
  transformMatrix?: mat4;
  subRunes?: Rune[];
  texture?: HTMLImageElement | null;
  hollusionDistance?: number;
}

/**
 * The basic data-representation of a Rune. When the Rune is drawn, every 3 consecutive vertex will form a triangle.
 */
export class Rune {
  constructor(
    /**
     * A list of vertex coordinates, each vertex has 4 coordiants (x,y,z,t).
     */
    public vertices: Float32Array,

    /**
     * A list of vertex colors, each vertex has a color (r,g,b,a). Values
     * are normalized to [0, 1]
     */
    public colors: Float32Array | null,

    /**
     * A mat4 that is applied to all the vertices and the sub runes
     */
    public transformMatrix: mat4,

    /**
     * A (potentially empty) list of Runes
     */
    public subRunes: Rune[],
    public texture: HTMLImageElement | string | null,
    public hollusionDistance: number
  ) { }

  public copy = () => new Rune(
    this.vertices,
    this.colors,
    mat4.clone(this.transformMatrix),
    this.subRunes,
    this.texture,
    this.hollusionDistance
  );

  /**
   * Flatten the subrunes to return a list of runes
   * @returns Rune[], a list of runes
   */
  public flatten = () => {
    const runeList: Rune[] = [];
    const runeTodoList: Rune[] = [this.copy()];

    while (runeTodoList.length !== 0) {
      const runeToExpand: Rune = runeTodoList.pop()!; // ! claims that the pop() will not return undefined.
      runeToExpand.subRunes.forEach((subRune: Rune) => {
        const subRuneCopy = subRune.copy();

        mat4.multiply(
          subRuneCopy.transformMatrix,
          runeToExpand.transformMatrix,
          subRuneCopy.transformMatrix
        );
        subRuneCopy.hollusionDistance = runeToExpand.hollusionDistance;
        if (runeToExpand.colors !== null) {
          subRuneCopy.colors = runeToExpand.colors;
        }
        runeTodoList.push(subRuneCopy);
      });
      runeToExpand.subRunes = [];
      if (runeToExpand.vertices.length > 0) {
        runeList.push(runeToExpand);
      }
    }
    return runeList;
  };

  public static of = (params: RuneOfParams = {}) => {
    const paramGetter = (name: keyof RuneOfParams, defaultValue: () => any) => params[name] ?? defaultValue();

    return new Rune(
      paramGetter('vertices', () => new Float32Array()),
      paramGetter('colors', () => null),
      paramGetter('transformMatrix', mat4.create),
      paramGetter('subRunes', () => []),
      paramGetter('texture', () => null),
      paramGetter('hollusionDistance', () => 0.1)
    );
  };

  public toReplString = () => '<Rune>';
}

/**
 * Resolves once `image` has actually finished loading. `rune.texture` can
 * arrive as an `HTMLImageElement` whose fetch/decode is still in flight -
 * `deserializeRune` (protocol.ts) constructs one and hands it over without
 * waiting, since deserialization itself is synchronous. Using such an image
 * for `texImage2D` before it's ready silently leaves the 1x1 placeholder
 * pixel as the visible texture (see
 * https://github.com/source-academy/modules/issues/891) - hence this wait,
 * regardless of whether the image was just-created or handed in already
 * loading.
 */
function waitForImageToLoad(image: HTMLImageElement): Promise<HTMLImageElement> {
  if (image.complete) {
    return image.naturalWidth === 0
      ? Promise.reject(new EvaluatorRuntimeError(`Rune: failed to load texture image at ${image.src}`))
      : Promise.resolve(image);
  }
  return new Promise<HTMLImageElement>((resolve, reject) => {
    // Uses addEventListener/removeEventListener rather than the onload/
    // onerror/onabort properties so a caller-supplied image (e.g. via
    // `Rune.of`) keeps whatever handlers it already had.
    function cleanup() {
      image.removeEventListener('load', onLoad);
      image.removeEventListener('error', onError);
      image.removeEventListener('abort', onError);
    }
    function onLoad() {
      cleanup();
      resolve(image);
    }
    function onError() {
      cleanup();
      reject(new EvaluatorRuntimeError(`Rune: failed to load texture image at ${image.src}`));
    }
    image.addEventListener('load', onLoad);
    image.addEventListener('error', onError);
    image.addEventListener('abort', onError);
  });
}

/**
 * Draws the list of runes with the prepared WebGLRenderingContext, with each rune overlapping each other onto a given framebuffer. if the framebuffer is null, draw to the default canvas.
 *
 * @param gl a prepared WebGLRenderingContext with shader program linked
 * @param runes a list of rune (Rune[]) to be drawn sequentially
 */
export async function drawRunesToFrameBuffer(
  gl: WebGLRenderingContext,
  runes: Rune[],
  cameraMatrix: mat4,
  colorFilter: Float32Array,
  framebuffer: WebGLFramebuffer | null = null,
  depthSwitch: boolean = false
) {
  // step 1: initiate the WebGLRenderingContext
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  // step 2: initiate the shaderProgram
  const shaderProgram = initShaderProgram(
    gl,
    normalVertexShader,
    normalFragmentShader
  );
  gl.useProgram(shaderProgram);
  if (gl === null) {
    throw new EvaluatorRuntimeError('Rendering Context not initialized for drawRune.');
  }

  // create pointers to the data-entries of the shader program
  const vertexPositionPointer = gl.getAttribLocation(
    shaderProgram,
    'aVertexPosition'
  );
  const vertexColorPointer = gl.getUniformLocation(
    shaderProgram,
    'uVertexColor'
  );
  const vertexColorFilterPt = gl.getUniformLocation(
    shaderProgram,
    'uColorFilter'
  );
  const projectionMatrixPointer = gl.getUniformLocation(
    shaderProgram,
    'uProjectionMatrix'
  );
  const cameraMatrixPointer = gl.getUniformLocation(
    shaderProgram,
    'uCameraMatrix'
  );
  const modelViewMatrixPointer = gl.getUniformLocation(
    shaderProgram,
    'uModelViewMatrix'
  );
  const textureSwitchPointer = gl.getUniformLocation(
    shaderProgram,
    'uRenderWithTexture'
  );
  const depthSwitchPointer = gl.getUniformLocation(
    shaderProgram,
    'uRenderWithDepthColor'
  );
  const texturePointer = gl.getUniformLocation(shaderProgram, 'uTexture');

  // load depth
  gl.uniform1i(depthSwitchPointer, depthSwitch ? 1 : 0);

  // load projection and camera
  const orthoCam = mat4.create();
  mat4.ortho(orthoCam, -1, 1, -1, 1, -0.5, 1.5);
  gl.uniformMatrix4fv(projectionMatrixPointer, false, orthoCam as Float32List);
  gl.uniformMatrix4fv(cameraMatrixPointer, false, cameraMatrix as Float32List);

  // load colorfilter
  gl.uniform4fv(vertexColorFilterPt, colorFilter);

  // 3. draw each Rune using the shader program
  /**
   * Credit to: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL
   * Initialize a texture and load an image.
   * When the image finished loading copy it into the texture.
   */
  const loadTexture = async (rune: Rune): Promise<WebGLTexture | null> => {
    if (rune.texture === null) return null;
    const imageSource = rune.texture;
    const image = typeof imageSource === 'string'
      ? Object.assign(new Image(), { crossOrigin: 'anonymous', src: imageSource })
      : imageSource;
    await waitForImageToLoad(image);
    rune.texture = image;

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    function isPowerOf2(value: number) {
      return (value & (value - 1)) === 0;
    }
    // Because images have to be downloaded over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      width,
      height,
      border,
      srcFormat,
      srcType,
      pixel
    );
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      image
    );

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      // Yes, it's a power of 2. Generate mips.
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      // No, it's not a power of 2. Turn off mips and set
      // wrapping to clamp to edge
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }

    return texture;
  };

  for (const rune of runes) {
    // load position buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, rune.vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(vertexPositionPointer, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPositionPointer);

    // load color/texture
    if (rune.texture === null) {
      gl.uniform4fv(
        vertexColorPointer,
        rune.colors || new Float32Array([0, 0, 0, 1])
      );
      gl.uniform1i(textureSwitchPointer, 0);
    } else {
      const texture = await loadTexture(rune);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(texturePointer, 0);
      gl.uniform1i(textureSwitchPointer, 1);
    }

    // load transformation matrix
    gl.uniformMatrix4fv(modelViewMatrixPointer, false, rune.transformMatrix as Float32List);

    // draw
    const vertexCount = rune.vertices.length / 4;
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
  }
}

/**
 * Represents runes with a draw method attached
 */
export abstract class DrawnRune implements ReplResult {
  private static readonly normalVertexShader = `
  attribute vec4 aVertexPosition;
  uniform vec4 uVertexColor;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  uniform mat4 uCameraMatrix;

  varying lowp vec4 vColor;
  varying highp vec2 vTexturePosition;
  varying lowp float colorFactor;
  void main(void) {
    gl_Position = uProjectionMatrix * uCameraMatrix * uModelViewMatrix * aVertexPosition;
    vColor = uVertexColor;

    // texture position is in [0,1], vertex position is in [-1,1]
    vTexturePosition.x = (aVertexPosition.x + 1.0) / 2.0;
    vTexturePosition.y = 1.0 - (aVertexPosition.y + 1.0) / 2.0;

    colorFactor = gl_Position.z;
  }
  `;

  private static readonly normalFragmentShader = `
  precision mediump float;
  uniform bool uRenderWithTexture;
  uniform bool uRenderWithDepthColor;
  uniform sampler2D uTexture;
  varying lowp float colorFactor;
  uniform vec4 uColorFilter;


  varying lowp vec4 vColor;
  varying highp vec2 vTexturePosition;
  void main(void) {
    if (uRenderWithTexture){
      gl_FragColor = texture2D(uTexture, vTexturePosition);
    } else {
      gl_FragColor = vColor;
    }
    if (uRenderWithDepthColor){
      gl_FragColor += (colorFactor + 0.5) * (1.0 - gl_FragColor);
      gl_FragColor.a = 1.0;
    }
    gl_FragColor = uColorFilter * gl_FragColor + 1.0 - uColorFilter;
    gl_FragColor.a = 1.0;
  }
  `;

  constructor(
    protected readonly rune: Rune,
    public readonly isHollusion: boolean
  ) { }

  public toReplString = () => '<Rune>';

  public abstract draw: (canvas: HTMLCanvasElement | OffscreenCanvas) => Promise<unknown>;
}

export class DrawnNormalRune extends DrawnRune {
  constructor(rune: Rune) {
    super(rune, false);
  }

  public draw = async (canvas: HTMLCanvasElement | OffscreenCanvas) => {
    const gl = getWebGlFromCanvas(canvas);

    // prepare camera projection array
    const cameraMatrix = mat4.create();

    // color filter set to [1,1,1,1] for transparent filter
    await drawRunesToFrameBuffer(
      gl,
      this.rune.flatten(),
      cameraMatrix,
      new Float32Array([1, 1, 1, 1]),
      null,
      true
    );
  };
}

/**
 * Pixel width/height of the square PNG thumbnail rendered for the stepper
 * hook below. Chosen to sit close to the stepper's own text scale (~1-2
 * lines at its 16px monospace font) rather than the tab's full 512x512
 * render size - deliberately a single named constant so it's a one-line
 * change to retune.
 */
export const THUMBNAIL_SIZE = 80;

/**
 * The module plugin runs in the evaluator's realm, which has no `document`/
 * `HTMLCanvasElement` (it's a Web Worker, not the main thread) - so
 * `OffscreenCanvas` is the only available rendering surface, and it isn't
 * universally supported. Checked fresh on every call: it's a trivial global
 * lookup, and caching it would only complicate testing for no real benefit.
 */
function isThumbnailRenderingSupported(): boolean {
  return typeof OffscreenCanvas !== 'undefined';
}

function readBlobAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/**
 * Renders a Rune to a small PNG data URL, for the stepper thumbnail hook.
 * Reuses `DrawnNormalRune`'s existing draw path unchanged (same shaders,
 * same square ortho projection), just targeting an `OffscreenCanvas`
 * instead of a mounted DOM canvas. Never throws - any failure (including
 * `OffscreenCanvas` being unsupported) resolves to `undefined`, so a bad
 * thumbnail render can never surface as a runtime error to student code.
 */
async function renderRuneThumbnail(rune: Rune): Promise<string | undefined> {
  if (!isThumbnailRenderingSupported()) return undefined;
  try {
    const canvas = new OffscreenCanvas(THUMBNAIL_SIZE, THUMBNAIL_SIZE);
    await new DrawnNormalRune(rune).draw(canvas);
    const blob = await canvas.convertToBlob({ type: 'image/png' });
    return await readBlobAsDataUrl(blob);
  } catch {
    return undefined;
  }
}

/**
 * Attaches the stepper-thumbnail render hook (see `RENDER_THUMBNAIL_SYMBOL`)
 * to a Rune instance, if thumbnail rendering is possible in this realm.
 * Mutates `rune` in place rather than returning a copy - every later
 * transform round-trips the value back through `opaque_get` and checks
 * `instanceof Rune`, so a wrapper/copy would silently break those checks.
 * The attached property is non-enumerable so it stays invisible to
 * `for...in`/`Object.keys`/`serializeRune` (which already only reads named
 * fields, but this keeps things tidy regardless).
 */
export function attachThumbnailHook(rune: Rune): Rune {
  if (isThumbnailRenderingSupported()) {
    Object.defineProperty(rune, RENDER_THUMBNAIL_SYMBOL, {
      value: () => renderRuneThumbnail(rune),
      enumerable: false,
      configurable: true
    });
  }
  return rune;
}

/** A function that takes in a timestamp and returns a Rune */
export type RuneAnimation = (time: number) => Rune;

export class AnimatedRune extends glAnimation implements ReplResult {
  constructor(
    duration: number,
    fps: number,
    private readonly func: (frame: number) => DrawnRune
  ) {
    super(duration, fps);
  }

  public getFrame(num: number): AnimFrame {
    const rune = this.func(num);
    return {
      draw: rune.draw.bind(rune)
    };
  }

  public toReplString = () => '<AnimatedRune>';
}
