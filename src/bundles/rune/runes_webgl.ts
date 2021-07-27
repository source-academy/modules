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
attribute vec4 aVertexColor;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
varying lowp vec4 vColor;
void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  vColor = aVertexColor;
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
 * prepares the canvas for drawing by extracting the WebGLRenderingContext and compile the program.
 * @param canvas - HTML Canvas element to prepare for drawing
 * @return WebGLRenderingContext | null
 */
function prepareCanvas(
  canvas: HTMLCanvasElement
): WebGLRenderingContext | null {
  const gl: WebGLRenderingContext | null = canvas.getContext('webgl');
  if (!gl) {
    throw Error('Unable to initialize WebGL.');
  }
  gl.clearColor(1.0, 1.0, 1.0, 1.0); // Set clear color to white, fully opaque
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things
  // eslint-disable-next-line no-bitwise
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the viewport

  const shaderProgram = initShaderProgram(gl, vertexShader2D, fragmentShader2D);
  gl.useProgram(shaderProgram);
  return gl;
}

/**
 * Draws the list of runes with the prepared WebGLRenderingContext, with each rune overlapping each other.
 *
 * @param gl a prepared WebGLRenderingContext with shader program linked
 * @param runes a list of rune (Rune[]) to be drawn sequentially
 */
function drawRunes(gl: WebGLRenderingContext | null, runes: Rune[]) {
  if (gl === null) {
    throw Error('Rendering Context not initialized for drawRune.');
  }
  const shaderProgram = gl.getParameter(gl.CURRENT_PROGRAM);

  // fetch datalink from program
  const vertexPositionPointer = gl.getAttribLocation(
    shaderProgram,
    'aVertexPosition'
  );
  const vertexColorPointer = gl.getAttribLocation(
    shaderProgram,
    'aVertexColor'
  );

  const projectionMatrixPointer = gl.getUniformLocation(
    shaderProgram,
    'uProjectionMatrix'
  );
  const modelViewMatrixPointer = gl.getUniformLocation(
    shaderProgram,
    'uModelViewMatrix'
  );

  runes.forEach((rune: Rune) => {
    // create position, color and index buffers
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, rune.vertices, gl.STATIC_DRAW);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, rune.colors, gl.STATIC_DRAW);

    const indices = Array.from(Array(rune.vertices.length / 4).keys()); // [0,1,2,3, ..., len(ver)/4]
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW
    );

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
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(vertexColorPointer, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexColorPointer);

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

    // use index buffer to draw
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    const vertexCount = rune.vertices.length / 4;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
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
  const gl = prepareCanvas(canvas);
  const runes = flattenRune(rune);
  drawRunes(gl, runes);
}
