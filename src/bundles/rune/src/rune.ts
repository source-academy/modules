import { glAnimation, type AnimFrame, type ReplResult } from '@sourceacademy/modules-lib/types';
import { mat4 } from 'gl-matrix';
import { getWebGlFromCanvas, initShaderProgram } from './runes_webgl';
import { classDeclaration } from './type_map';

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
/**
 * The basic data-representation of a Rune. When the Rune is drawn, every 3 consecutive vertex will form a triangle.
 */
@classDeclaration('Rune')
export class Rune {
  constructor(
    /**
     * A list of vertex coordinates, each vertex has 4 coordiante (x,y,z,t).
     */
    public vertices: Float32Array,

    /**
     * A list of vertex colors, each vertex has a color (r,g,b,a).
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
    public texture: HTMLImageElement | null,
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

  public static of = (params: {
    vertices?: Float32Array;
    colors?: Float32Array | null;
    transformMatrix?: mat4;
    subRunes?: Rune[];
    texture?: HTMLImageElement | null;
    hollusionDistance?: number;
  } = {}) => {
    const paramGetter = (name: string, defaultValue: () => any) => (params[name] === undefined ? defaultValue() : params[name]);

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
 * Draws the list of runes with the prepared WebGLRenderingContext, with each rune overlapping each other onto a given framebuffer. if the framebuffer is null, draw to the default canvas.
 *
 * @param gl a prepared WebGLRenderingContext with shader program linked
 * @param runes a list of rune (Rune[]) to be drawn sequentially
 */
export function drawRunesToFrameBuffer(
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
    throw Error('Rendering Context not initialized for drawRune.');
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
  gl.uniformMatrix4fv(projectionMatrixPointer, false, orthoCam);
  gl.uniformMatrix4fv(cameraMatrixPointer, false, cameraMatrix);

  // load colorfilter
  gl.uniform4fv(vertexColorFilterPt, colorFilter);

  // 3. draw each Rune using the shader program
  /**
   * Credit to: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL
   * Initialize a texture and load an image.
   * When the image finished loading copy it into the texture.
   */
  const loadTexture = (image: HTMLImageElement): WebGLTexture | null => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    function isPowerOf2(value) {
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

  runes.forEach((rune: Rune) => {
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
      const texture = loadTexture(rune.texture);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(texturePointer, 0);
      gl.uniform1i(textureSwitchPointer, 1);
    }

    // load transformation matrix
    gl.uniformMatrix4fv(modelViewMatrixPointer, false, rune.transformMatrix);

    // draw
    const vertexCount = rune.vertices.length / 4;
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
  });
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

  public abstract draw: (canvas: HTMLCanvasElement) => void;
}

export class NormalRune extends DrawnRune {
  constructor(rune: Rune) {
    super(rune, false);
  }

  public draw = (canvas: HTMLCanvasElement) => {
    const gl = getWebGlFromCanvas(canvas);

    // prepare camera projection array
    const cameraMatrix = mat4.create();

    // color filter set to [1,1,1,1] for transparent filter
    drawRunesToFrameBuffer(
      gl,
      this.rune.flatten(),
      cameraMatrix,
      new Float32Array([1, 1, 1, 1]),
      null,
      true
    );
  };
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
      draw: rune.draw
    };
  }

  public toReplString = () => '<AnimatedRune>';
}

export type SerializedRune = {
  vertices: Float32Array;
  colors: Float32Array | null;
  transformMatrix: mat4;
  hollusionDistance: number;
  texture?: null;
};

export function serializeRune(rune: Rune): SerializedRune {
  return {
    vertices: rune.vertices,
    colors: rune.colors,
    transformMatrix: rune.transformMatrix,
    hollusionDistance: rune.hollusionDistance,
    texture: null
  } as SerializedRune;
}

export function deserializeRune(serializedRune: SerializedRune): Rune {
  const vertices = serializedRune.vertices;
  const colors = serializedRune.colors;
  const transformMatrix = serializedRune.transformMatrix;
  const hollusionDistance = serializedRune.hollusionDistance;
  const texture = serializedRune.texture || null;

  return Rune.of({
    vertices,
    colors,
    transformMatrix,
    hollusionDistance,
    texture
  });
}

export type SerializedDrawnRune =
  | {
      kind: 'normal';
      rune: SerializedRune;
      isHollusion: boolean;
    }
  | {
      kind: 'animated';
      duration: number;
      fps: number;
      frames: SerializedDrawnRune[];
    };

/**
 * Serialize a DrawnRune (NormalRune) or AnimatedRune to a plain data structure.
 * - Normal: serialize the contained Rune
 * - Animated: precompute each frame using the animation function and serialize each frame
 */
export function serializeDrawnRune(drawn: DrawnRune | AnimatedRune): SerializedDrawnRune {
  // AnimatedRune is a subclass of glAnimation and defined below in this file
  if (drawn instanceof AnimatedRune) {
    const duration = drawn.duration;
    const fps = drawn.fps;
    const totalFrames = Math.max(1, Math.round(duration * fps));

    // Access the private func stored on AnimatedRune instance. Use any to bypass TS visibility.
    const func = (drawn as any).func as (frame: number) => DrawnRune;

    const frames: SerializedDrawnRune[] = [];
    for (let i = 0; i < totalFrames; i++) {
      const frameDrawn = func(i);
      frames.push(serializeDrawnRune(frameDrawn));
    }

    return {
      kind: 'animated',
      duration,
      fps,
      frames
    };
  }

  // Normal case: any DrawnRune that is not AnimatedRune - serialize its underlying Rune
  const innerRune: Rune = (drawn as any).rune as Rune;
  const isHollusion = (drawn as any).isHollusion as boolean;

  return {
    kind: 'normal',
    rune: serializeRune(innerRune),
    isHollusion
  };
}

/**
 * Deserialize a SerializedDrawnRune back into a DrawnRune (NormalRune or AnimatedRune).
 */
export function deserializeDrawnRune(serialized: SerializedDrawnRune): DrawnRune | AnimatedRune {
  if (serialized.kind === 'normal') {
    const rune = deserializeRune(serialized.rune);

    // Create a small subclass instance to preserve isHollusion flag and draw behaviour
    class RehydratedNormalRune extends DrawnRune {
      constructor(r: Rune, isH: boolean) {
        super(r, isH);
      }

      public draw = (canvas: HTMLCanvasElement) => {
        const gl = getWebGlFromCanvas(canvas);
        const cameraMatrix = mat4.create();
        drawRunesToFrameBuffer(
          gl,
          this.rune.flatten(),
          cameraMatrix,
          new Float32Array([1, 1, 1, 1]),
          null,
          true
        );
      };
    }

    return new RehydratedNormalRune(rune, serialized.isHollusion);
  }

  // animated
  const { duration, fps, frames } = serialized;

  const func = (frame: number) => {
    const frameIndex = frame % frames.length;
    const des = deserializeDrawnRune(frames[frameIndex]);
    if (des instanceof AnimatedRune) {
      throw new Error('Nested animated frames are not supported when deserializing an AnimatedRune');
    }
    return des as DrawnRune;
  };

  return new AnimatedRune(duration, fps, func);
}