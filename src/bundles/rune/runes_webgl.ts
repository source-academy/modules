/**
 * This file contains the module's private functions that handles various webgl operations.
 */

import { mat4 } from 'gl-matrix';
import { flattenRune, throwIfNotRune } from './runes_ops';
import { Rune } from './types';

// =============================================================================
// Private functions
// =============================================================================

const vertexShader2D = `
attribute vec4 aVertexPosition;
uniform vec4 uVertexColor;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
varying lowp vec4 vColor;
void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  vColor = uVertexColor;
}
`;

const fragmentShader2D = `
varying lowp vec4 vColor;
void main(void) {
  gl_FragColor = vColor;
}
`;

// The following 2 functions loadShader and initShaderProgram are copied from the curve library, 26 Jul 2021 with no change. This unfortunately violated DIY priciple but I have no choice as those functions are not exported.
/**
 * Gets shader based on given shader program code.
 *
 * @param gl - WebGL's rendering context
 * @param type - constant describing the type of shader to load
 * @param source - source code of the shader
 * @returns WebGLShader used to initialize shader program
 */
function loadShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error('WebGLShader not available.');
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

/**
 * Initializes the shader program used by WebGL.
 *
 * @param gl - WebGL's rendering context
 * @param vsSource - vertex shader program code
 * @param fsSource - fragment shader program code
 * @returns WebGLProgram used for getting AttribLocation and UniformLocation
 */
function initShaderProgram(
  gl: WebGLRenderingContext,
  vsSource: string,
  fsSource: string
): WebGLProgram {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const shaderProgram = gl.createProgram();
  if (!shaderProgram) {
    throw new Error('Unable to initialize the shader program.');
  }
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  return shaderProgram;
}

/**
 * Draws the list of runes with the prepared WebGLRenderingContext, with each rune overlapping each other.
 *
 * @param gl a prepared WebGLRenderingContext with shader program linked
 * @param runes a list of rune (Rune[]) to be drawn sequentially
 */
function drawRunes(canvas: HTMLCanvasElement, runes: Rune[]) {
  // step 1: initiate the WebGLRenderingContext
  const gl: WebGLRenderingContext | null = canvas.getContext('webgl');
  if (!gl) {
    throw Error('Unable to initialize WebGL.');
  }
  gl.clearColor(1.0, 1.0, 1.0, 1.0); // Set clear color to white, fully opaque
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things
  // eslint-disable-next-line no-bitwise
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the viewport

  // step 2: initiate the shaderProgram
  const shaderProgram = initShaderProgram(gl, vertexShader2D, fragmentShader2D);
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

  const projectionMatrixPointer = gl.getUniformLocation(
    shaderProgram,
    'uProjectionMatrix'
  );
  const modelViewMatrixPointer = gl.getUniformLocation(
    shaderProgram,
    'uModelViewMatrix'
  );

  // draw each Rune using the shader program
  runes.forEach((rune: Rune) => {
    // create position, color and index buffers
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, rune.vertices, gl.STATIC_DRAW);

    // const colorBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, rune.colors, gl.STATIC_DRAW);

    // prepare the default zero point of the model
    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -3.0]);

    // transform the model
    mat4.multiply(modelViewMatrix, modelViewMatrix, rune.transformMatrix);

    // load position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(vertexPositionPointer, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPositionPointer);

    // load color buffer
    // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    // gl.vertexAttribPointer(vertexColorPointer, 4, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(vertexColorPointer);
    if (rune.colors != null) {
      gl.uniform4fv(vertexColorPointer, rune.colors);
    } else {
      gl.uniform4fv(vertexColorPointer, new Float32Array([0, 0, 0, 1]));
    }

    // prepare camera projection array
    const projectionMatrix = mat4.create();
    const fieldOfView = (45 * Math.PI) / 180; // in radians
    const aspect = 1; // width/height
    const zNear = 0.1;
    const zFar = 100.0;
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    // load matrices
    gl.uniformMatrix4fv(projectionMatrixPointer, false, projectionMatrix);
    gl.uniformMatrix4fv(modelViewMatrixPointer, false, modelViewMatrix);

    // draw
    const vertexCount = rune.vertices.length / 4;
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
  });
}

// =============================================================================
// Exposed functions
// =============================================================================

/**
 * Draw the rune in the tab, including all the sub runes.
 *
 * @param canvas HTMLCanvasElement element in the tab
 * @param rune the Rune to be drawn
 */
// eslint-disable-next-line import/prefer-default-export
export function drawRune(canvas: HTMLCanvasElement, rune: Rune) {
  throwIfNotRune('drawRune', rune);
  const runes = flattenRune(rune);
  drawRunes(canvas, runes);
}
