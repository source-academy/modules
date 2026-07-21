import { repeat_internal } from '@sourceacademy/bundle-repeat/functions';
import { assertFunctionOfLength, assertNumberWithinRange, hueToRgb } from '@sourceacademy/modules-lib/utilities';
import { clamp, sample } from 'es-toolkit';
import { mat4, vec3 } from 'gl-matrix';
import {
  DrawnRune,
  Rune,
  drawRunesToFrameBuffer,
  type AnimatedRune
} from './rune';
import {
  addColorFromHex,
  getBlank,
  getCircle,
  getCorner,
  getHeart,
  getNova,
  getPentagram,
  getRcross,
  getRibbon,
  getSail,
  getSquare,
  getTriangle,
  hexToColor,
  throwIfNotRune
} from './runes_ops';
import {
  getWebGlFromCanvas,
  initFramebufferObject,
  initShaderProgram,
  type FrameBufferWithTexture
} from './runes_webgl';

export type RuneModuleState = {
  drawnRunes: (AnimatedRune | DrawnRune)[];
};

function throwIfNotFraction(val: unknown, param_name: string, func_name: string): asserts val is number {
  assertNumberWithinRange(val, func_name, 0, 1, false, param_name);
}

// =============================================================================
// Basic Runes
// =============================================================================

// Exported for testing
export class RuneFunctions {
  static square: Rune = getSquare();
  static blank: Rune = getBlank();

  static rcross: Rune = getRcross();

  static sail: Rune = getSail();

  static triangle: Rune = getTriangle();

  static corner: Rune = getCorner();

  static nova: Rune = getNova();

  static circle: Rune = getCircle();

  static heart: Rune = getHeart();

  static pentagram: Rune = getPentagram();

  static ribbon: Rune = getRibbon();

  // =============================================================================
  // Textured Runes
  // =============================================================================

  static from_url(imageUrl: string): Rune {
    const rune = getSquare();
    rune.texture = imageUrl;
    return rune;
  }

  // =============================================================================
  // XY-axis Transformation functions
  // =============================================================================

  static scale_independent(
    ratio_x: number,
    ratio_y: number,
    rune: Rune
  ): Rune {
    throwIfNotRune(RuneFunctions.scale_independent.name, rune);
    assertNumberWithinRange(ratio_x, { func_name: RuneFunctions.scale_independent.name, param_name: 'ratio_x', integer: false });
    assertNumberWithinRange(ratio_y, { func_name: RuneFunctions.scale_independent.name, param_name: 'ratio_y', integer: false });

    const scaleVec = vec3.fromValues(ratio_x, ratio_y, 1);
    const scaleMat = mat4.create();
    mat4.scale(scaleMat, scaleMat, scaleVec);

    const wrapperMat = mat4.create();
    mat4.multiply(wrapperMat, scaleMat, wrapperMat);
    return Rune.of({
      subRunes: [rune],
      transformMatrix: wrapperMat
    });
  }

  static scale(ratio: number, rune: Rune): Rune {
    throwIfNotRune(RuneFunctions.scale.name, rune);
    return RuneFunctions.scale_independent(ratio, ratio, rune);
  }

  static translate(x: number, y: number, rune: Rune): Rune {
    throwIfNotRune(RuneFunctions.translate.name, rune);
    const translateVec = vec3.fromValues(x, -y, 0);
    const translateMat = mat4.create();
    mat4.translate(translateMat, translateMat, translateVec);

    const wrapperMat = mat4.create();
    mat4.multiply(wrapperMat, translateMat, wrapperMat);
    return Rune.of({
      subRunes: [rune],
      transformMatrix: wrapperMat
    });
  }

  static rotate(rad: number, rune: Rune): Rune {
    throwIfNotRune(RuneFunctions.rotate.name, rune);
    const rotateMat = mat4.create();
    mat4.rotateZ(rotateMat, rotateMat, rad);

    const wrapperMat = mat4.create();
    mat4.multiply(wrapperMat, rotateMat, wrapperMat);
    return Rune.of({
      subRunes: [rune],
      transformMatrix: wrapperMat
    });
  }

  static stack_frac(frac: number, rune1: Rune, rune2: Rune): Rune {
    throwIfNotRune(RuneFunctions.stack_frac.name, rune1, 'rune1');
    throwIfNotRune(RuneFunctions.stack_frac.name, rune2, 'rune2');
    throwIfNotFraction(frac, 'frac', RuneFunctions.stack_frac.name);

    const upper = RuneFunctions.translate(0, -(1 - frac), RuneFunctions.scale_independent(1, frac, rune1));
    const lower = RuneFunctions.translate(0, frac, RuneFunctions.scale_independent(1, 1 - frac, rune2));
    return Rune.of({
      subRunes: [upper, lower]
    });
  }

  static stack(rune1: Rune, rune2: Rune): Rune {
    throwIfNotRune(RuneFunctions.stack.name, rune1, 'rune1');
    throwIfNotRune(RuneFunctions.stack.name, rune2, 'rune2');
    return RuneFunctions.stack_frac(0.5, rune1, rune2);
  }

  static stackn(n: number, rune: Rune): Rune {
    throwIfNotRune(RuneFunctions.stackn.name, rune);

    assertNumberWithinRange(n, {
      func_name: RuneFunctions.stackn.name
    });

    if (n <= 1) {
      return rune;
    }

    return RuneFunctions.stack_frac(1 / n, rune, RuneFunctions.stackn(n - 1, rune));
  }

  static quarter_turn_right(rune: Rune): Rune {
    throwIfNotRune(RuneFunctions.quarter_turn_right.name, rune);
    return RuneFunctions.rotate(-Math.PI / 2, rune);
  }

  static quarter_turn_left(rune: Rune): Rune {
    throwIfNotRune(RuneFunctions.quarter_turn_left.name, rune);
    return RuneFunctions.rotate(Math.PI / 2, rune);
  }

  static turn_upside_down(rune: Rune): Rune {
    throwIfNotRune(RuneFunctions.turn_upside_down.name, rune);
    return RuneFunctions.rotate(Math.PI, rune);
  }

  static beside_frac(frac: number, rune1: Rune, rune2: Rune): Rune {
    throwIfNotRune(RuneFunctions.beside_frac.name, rune1, 'rune1');
    throwIfNotRune(RuneFunctions.beside_frac.name, rune2, 'rune2');
    throwIfNotFraction(frac, 'frac', RuneFunctions.beside_frac.name);

    const left = RuneFunctions.translate(-(1 - frac), 0, RuneFunctions.scale_independent(frac, 1, rune1));
    const right = RuneFunctions.translate(frac, 0, RuneFunctions.scale_independent(1 - frac, 1, rune2));
    return Rune.of({
      subRunes: [left, right]
    });
  }

  static beside(rune1: Rune, rune2: Rune): Rune {
    throwIfNotRune(RuneFunctions.beside.name, rune1, 'rune1');
    throwIfNotRune(RuneFunctions.beside.name, rune2, 'rune2');
    return RuneFunctions.beside_frac(0.5, rune1, rune2);
  }

  static flip_vert(rune: Rune): Rune {
    throwIfNotRune(RuneFunctions.flip_vert.name, rune);
    return RuneFunctions.scale_independent(1, -1, rune);
  }

  static flip_horiz(rune: Rune): Rune {
    throwIfNotRune(RuneFunctions.flip_horiz.name, rune);
    return RuneFunctions.scale_independent(-1, 1, rune);
  }

  static make_cross(rune: Rune): Rune {
    throwIfNotRune(RuneFunctions.make_cross.name, rune);
    return RuneFunctions.stack(
      RuneFunctions.beside(RuneFunctions.quarter_turn_right(rune), RuneFunctions.rotate(Math.PI, rune)),
      RuneFunctions.beside(rune, RuneFunctions.rotate(Math.PI / 2, rune))
    );
  }

  static repeat_pattern(
    n: number,
    pattern: (a: Rune) => Rune,
    initial: Rune
  ): Rune {
    throwIfNotRune(RuneFunctions.repeat_pattern.name, initial, 'initial');
    assertFunctionOfLength(pattern, 1, RuneFunctions.repeat_pattern.name);
    const repeated = repeat_internal(pattern, n);
    return repeated(initial);
  }

  // =============================================================================
  // Z-axis Transformation functions
  // =============================================================================

  static overlay_frac(frac: number, rune1: Rune, rune2: Rune): Rune {
    // to developer: please read https://www.tutorialspoint.com/webgl/webgl_basics.htm to understand the webgl z-axis interpretation.
    // The key point is that positive z is closer to the screen. Hence, the image at the back should have smaller z value. Primitive runes have z = 0.
    throwIfNotRune(RuneFunctions.overlay_frac.name, rune1, 'rune1');
    throwIfNotRune(RuneFunctions.overlay_frac.name, rune2, 'rune2');
    throwIfNotFraction(frac, 'frac', RuneFunctions.overlay_frac.name);

    // by definition, when frac == 0 or 1, the back rune will overlap with the front rune.
    // however, this would cause graphical glitch because overlapping is physically impossible
    // we hack this problem by clipping the frac input from [0,1] to [1E-6, 1-1E-6]
    // this should not be graphically noticable
    const minFrac = 0.000001;
    const maxFrac = 1 - minFrac;

    const useFrac = clamp(frac, minFrac, maxFrac);
    const frontMat = mat4.create();
    // z: scale by frac
    mat4.scale(frontMat, frontMat, vec3.fromValues(1, 1, useFrac));
    const front = Rune.of({
      subRunes: [rune1],
      transformMatrix: frontMat
    });

    const backMat = mat4.create();
    // need to apply transformation in backwards order!
    mat4.translate(backMat, backMat, vec3.fromValues(0, 0, -useFrac));
    mat4.scale(backMat, backMat, vec3.fromValues(1, 1, 1 - useFrac));
    const back = Rune.of({
      subRunes: [rune2],
      transformMatrix: backMat
    });

    return Rune.of({
      subRunes: [front, back] // render front first to avoid redrawing
    });
  }

  static overlay(rune1: Rune, rune2: Rune): Rune {
    throwIfNotRune(RuneFunctions.overlay.name, rune1, 'rune1');
    throwIfNotRune(RuneFunctions.overlay.name, rune2, 'rune2');
    return RuneFunctions.overlay_frac(0.5, rune1, rune2);
  }

  // =============================================================================
  // Color functions
  // =============================================================================

  static color(rune: Rune, r: number, g: number, b: number): Rune {
    throwIfNotRune(RuneFunctions.color.name, rune);
    throwIfNotFraction(r, 'r', RuneFunctions.color.name);
    throwIfNotFraction(g, 'g', RuneFunctions.color.name);
    throwIfNotFraction(b, 'b', RuneFunctions.color.name);

    const colorVector = [r, g, b, 1];
    return Rune.of({
      colors: new Float32Array(colorVector),
      subRunes: [rune]
    });
  }
}

// Class dedicated to functions for colouring Runes specific colours
// Separated into a different class for testing
export class RuneColours {
  static colours = {
    blue: '#2196F3',
    brown: '#795548',
    green: '#4CAF50',
    indigo: '#3F51B5',
    orange: '#FF9800',
    pink: '#E91E63',
    purple: '#AA00FF',
    red: '#F44336',
    yellow: '#FFEB3B',
  } as const;

  static black(rune: Rune): Rune {
    throwIfNotRune(RuneColours.black.name, rune);
    return addColorFromHex(rune, '#000000');
  }

  static blue(rune: Rune): Rune {
    throwIfNotRune(RuneColours.blue.name, rune);
    return addColorFromHex(rune, RuneColours.colours.blue);
  }
  static brown(rune: Rune): Rune {
    throwIfNotRune(RuneColours.brown.name, rune);
    return addColorFromHex(rune, RuneColours.colours.brown);
  }

  static green(rune: Rune): Rune {
    throwIfNotRune(RuneColours.green.name, rune);
    return addColorFromHex(rune, RuneColours.colours.green);
  }

  static indigo(rune: Rune): Rune {
    throwIfNotRune(RuneColours.indigo.name, rune);
    return addColorFromHex(rune, RuneColours.colours.indigo);
  }

  static red(rune: Rune): Rune {
    throwIfNotRune(RuneColours.red.name, rune);
    return addColorFromHex(rune, RuneColours.colours.red);
  }

  static pink(rune: Rune): Rune {
    throwIfNotRune(RuneColours.pink.name, rune);
    return addColorFromHex(rune, RuneColours.colours.pink);
  }

  static orange(rune: Rune): Rune {
    throwIfNotRune(RuneColours.orange.name, rune);
    return addColorFromHex(rune, RuneColours.colours.orange);
  }

  static purple(rune: Rune): Rune {
    throwIfNotRune(RuneColours.purple.name, rune);
    return addColorFromHex(rune, RuneColours.colours.purple);
  }

  static white(rune: Rune): Rune {
    throwIfNotRune(RuneColours.white.name, rune);
    return addColorFromHex(rune, '#FFFFFF');
  }

  static yellow(rune: Rune): Rune {
    throwIfNotRune(RuneColours.yellow.name, rune);
    return addColorFromHex(rune, RuneColours.colours.yellow);
  }

  static random_color(rune: Rune): Rune {
    throwIfNotRune(RuneColours.random_color.name, rune);
    const colorVal = sample(Object.values(RuneColours.colours));
    const randomColor = hexToColor(colorVal);

    return Rune.of({
      colors: new Float32Array(randomColor),
      subRunes: [rune]
    });
  }

  static colour_with_hue(rune: Rune, hue: number): Rune {
    throwIfNotRune(RuneColours.colour_with_hue.name, rune);
    assertNumberWithinRange(hue, RuneColours.colour_with_hue.name, 0, undefined, false, 'hue');
    const [r, g, b] = hueToRgb(hue);

    return Rune.of({
      subRunes: [rune],
      colors: new Float32Array([r / 255, g / 255, b / 255, 1])
    });
  }
}

/** @hidden */
export class DrawnAnaglyphRune extends DrawnRune {
  private static readonly anaglyphVertexShader = `
    precision mediump float;
    attribute vec4 a_position;
    varying highp vec2 v_texturePosition;
    void main() {
        gl_Position = a_position;
        // texture position is in [0,1], vertex position is in [-1,1]
        v_texturePosition.x = (a_position.x + 1.0) / 2.0;
        v_texturePosition.y = (a_position.y + 1.0) / 2.0;
    }
    `;

  private static readonly anaglyphFragmentShader = `
    precision mediump float;
    uniform sampler2D u_sampler_red;
    uniform sampler2D u_sampler_cyan;
    varying highp vec2 v_texturePosition;
    void main() {
        gl_FragColor = texture2D(u_sampler_red, v_texturePosition)
                + texture2D(u_sampler_cyan, v_texturePosition) - 1.0;
        gl_FragColor.a = 1.0;
    }
    `;

  constructor(rune: Rune) {
    super(rune, false);
  }

  public draw = async (canvas: HTMLCanvasElement) => {
    const gl = getWebGlFromCanvas(canvas);

    // before draw the runes to framebuffer, we need to first draw a white background to cover the transparent places
    const runes = white(overlay_frac(0.999999999, blank, scale(2.2, square)))
      .flatten()
      .concat(this.rune.flatten());

    // calculate the left and right camera matrices
    const halfEyeDistance = 0.03;
    const leftCameraMatrix = mat4.create();
    mat4.lookAt(
      leftCameraMatrix,
      vec3.fromValues(-halfEyeDistance, 0, 0),
      vec3.fromValues(0, 0, -0.4),
      vec3.fromValues(0, 1, 0)
    );
    const rightCameraMatrix = mat4.create();
    mat4.lookAt(
      rightCameraMatrix,
      vec3.fromValues(halfEyeDistance, 0, 0),
      vec3.fromValues(0, 0, -0.4),
      vec3.fromValues(0, 1, 0)
    );

    // left/right eye images are drawn into respective framebuffers
    const leftBuffer = initFramebufferObject(gl);
    const rightBuffer = initFramebufferObject(gl);
    await drawRunesToFrameBuffer(
      gl,
      runes,
      leftCameraMatrix,
      new Float32Array([1, 0, 0, 1]),
      leftBuffer.framebuffer,
      true
    );
    await drawRunesToFrameBuffer(
      gl,
      runes,
      rightCameraMatrix,
      new Float32Array([0, 1, 1, 1]),
      rightBuffer.framebuffer,
      true
    );

    // prepare to draw to screen by setting framebuffer to null
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    // prepare the shader program to combine the left/right eye images
    const shaderProgram = initShaderProgram(
      gl,
      DrawnAnaglyphRune.anaglyphVertexShader,
      DrawnAnaglyphRune.anaglyphFragmentShader
    );
    gl.useProgram(shaderProgram);
    const reduPt = gl.getUniformLocation(shaderProgram, 'u_sampler_red');
    const cyanuPt = gl.getUniformLocation(shaderProgram, 'u_sampler_cyan');
    const vertexPositionPointer = gl.getAttribLocation(
      shaderProgram,
      'a_position'
    );

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, leftBuffer.texture);
    gl.uniform1i(cyanuPt, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, rightBuffer.texture);
    gl.uniform1i(reduPt, 1);

    // draw a square, which will allow the texture to be used
    // load position buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, square.vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(vertexPositionPointer, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPositionPointer);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };
}

/** @hidden */
export class DrawnHollusionRune extends DrawnRune {
  constructor(rune: Rune, magnitude: number) {
    super(rune, true);
    this.rune.hollusionDistance = magnitude;
  }

  private static readonly copyVertexShader = `
    precision mediump float;
    attribute vec4 a_position;
    varying highp vec2 v_texturePosition;
    void main() {
        gl_Position = a_position;
        // texture position is in [0,1], vertex position is in [-1,1]
        v_texturePosition.x = (a_position.x + 1.0) / 2.0;
        v_texturePosition.y = (a_position.y + 1.0) / 2.0;
    }
    `;

  private static readonly copyFragmentShader = `
    precision mediump float;
    uniform sampler2D uTexture;
    varying highp vec2 v_texturePosition;
    void main() {
        gl_FragColor = texture2D(uTexture, v_texturePosition);
    }
    `;

  public draw = async (canvas: HTMLCanvasElement) => {
    const gl = getWebGlFromCanvas(canvas);

    const runes = white(overlay_frac(0.999999999, blank, scale(2.2, square)))
      .flatten()
      .concat(this.rune.flatten());

    // first render all the frames into a framebuffer
    const xshiftMax = runes[0].hollusionDistance;
    const period = 2000; // animations loops every 2 seconds
    const frameCount = 50; // in total 50 frames, gives rise to 25 fps
    const frameBuffer: FrameBufferWithTexture[] = [];

    const renderFrame = async (framePos: number): Promise<FrameBufferWithTexture> => {
      const fb = initFramebufferObject(gl);
      // prepare camera projection array
      const cameraMatrix = mat4.create();
      // let the object shift in the x direction
      // the following calculation will let x oscillate in (-xshiftMax, xshiftMax) with time
      let xshift = (framePos * (period / frameCount)) % period;
      if (xshift > period / 2) {
        xshift = period - xshift;
      }
      xshift = xshiftMax * (2 * ((2 * xshift) / period) - 1);
      mat4.lookAt(
        cameraMatrix,
        vec3.fromValues(xshift, 0, 0),
        vec3.fromValues(0, 0, -0.4),
        vec3.fromValues(0, 1, 0)
      );

      await drawRunesToFrameBuffer(
        gl,
        runes,
        cameraMatrix,
        new Float32Array([1, 1, 1, 1]),
        fb.framebuffer,
        true
      );
      return fb;
    };

    for (let i = 0; i < frameCount; i += 1) {
      frameBuffer.push(await renderFrame(i));
    }

    // Then, draw a frame from framebuffer for each update
    const copyShaderProgram = initShaderProgram(
      gl,
      DrawnHollusionRune.copyVertexShader,
      DrawnHollusionRune.copyFragmentShader
    );
    gl.useProgram(copyShaderProgram);
    const texturePt = gl.getUniformLocation(copyShaderProgram, 'uTexture');
    const vertexPositionPointer = gl.getAttribLocation(
      copyShaderProgram,
      'a_position'
    );
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, square.vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(vertexPositionPointer, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPositionPointer);

    let lastTime = 0;
    function render(timeInMs: number) {
      if (timeInMs - lastTime < period / frameCount) return;

      lastTime = timeInMs;

      const framePos
        = Math.floor(timeInMs / (period / frameCount)) % frameCount;
      const fbObject = frameBuffer[framePos];
      gl.clearColor(1.0, 1.0, 1.0, 1.0); // Set clear color to white, fully opaque
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the viewport

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, fbObject.texture);
      gl.uniform1i(texturePt, 0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    return render;
  };
}

/** @hidden */
export function isHollusionRune(rune: DrawnRune): rune is DrawnHollusionRune {
  return rune.isHollusion;
}

export const beside = RuneFunctions.beside;

export const beside_frac = RuneFunctions.beside_frac;

export const black = RuneColours.black;

export const blank = RuneFunctions.blank;

export const blue = RuneColours.blue;

export const brown = RuneColours.brown;

export const circle = RuneFunctions.circle;

export const color = RuneFunctions.color;

export const colour_with_hue = RuneColours.colour_with_hue;

export const corner = RuneFunctions.corner;

export const flip_horiz = RuneFunctions.flip_horiz;

export const flip_vert = RuneFunctions.flip_vert;

export const from_url = RuneFunctions.from_url;

export const green = RuneColours.green;

export const heart = RuneFunctions.heart;

export const indigo = RuneColours.indigo;

export const make_cross = RuneFunctions.make_cross;

export const nova = RuneFunctions.nova;

export const orange = RuneColours.orange;

export const overlay = RuneFunctions.overlay;

export const overlay_frac = RuneFunctions.overlay_frac;

export const pentagram = RuneFunctions.pentagram;

export const pink = RuneColours.pink;

export const purple = RuneColours.purple;

export const quarter_turn_left = RuneFunctions.quarter_turn_left;

export const quarter_turn_right = RuneFunctions.quarter_turn_right;

export const random_color = RuneColours.random_color;

export const rcross = RuneFunctions.rcross;

export const red = RuneColours.red;

export const repeat_pattern = RuneFunctions.repeat_pattern;

export const ribbon = RuneFunctions.ribbon;

export const rotate = RuneFunctions.rotate;

export const sail = RuneFunctions.sail;

export const scale = RuneFunctions.scale;

export const scale_independent = RuneFunctions.scale_independent;

export const stack = RuneFunctions.stack;

export const stack_frac = RuneFunctions.stack_frac;

export const stackn = RuneFunctions.stackn;

export const square = RuneFunctions.square;

export const translate = RuneFunctions.translate;

export const triangle = RuneFunctions.triangle;

export const turn_upside_down = RuneFunctions.turn_upside_down;

export const yellow = RuneColours.yellow;

export const white = RuneColours.white;
