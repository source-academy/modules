/* eslint-disable @typescript-eslint/naming-convention */
import { mat4, vec3 } from 'gl-matrix';
import { ShapeDrawn, CurveFunction, ProgramInfo, BufferInfo } from './types';

let canvasElement: HTMLCanvasElement | null;
let renderingContext: WebGLRenderingContext | null;
let cubeRotation: number = 0; // Used for 3D curves rendering rotation

// Vertex shader program
const vsS: string = `
attribute vec4 aFragColor;
attribute vec4 aVertexPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying lowp vec4 aColor;

void main() {
  gl_PointSize = 2.0;
  aColor = aFragColor;
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}`;

// Fragment shader program
const fsS: string = `
varying lowp vec4 aColor;
precision mediump float;
void main() {
  gl_FragColor = aColor;
}`;

// =============================================================================
// Module's Private Functions
//
// This file contains all the private functions used by the Curves module for
// rendering curves. For documentation/tutorials on WebGL API, see
// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API.
// =============================================================================

/**
 * gets shader based on given shader program code.
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
 * initializes the shader program used by WebGL.
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
 * main function that draws the given ShapeDrawn on the rendered canvas.
 * However, WebGL only supports 16bits buffer, i.e. the no. of points in the
 * buffer must be lower than 65535. This limitation can potentially be
 * solved using a for loop to slice the array and draw multiple times.
 *
 * @param gl - rendering context of the canvas
 * @param buffers - object encapsulating buffers that generates the curve and cube
 * @param programInfo - object encapsulating
 * @param num - num + 1 vertices to be drawn
 * @param drawMode - mode of drawing between points of the curve
 * @param space - visualization method used to render curve
 */
function drawCurve(
  gl: WebGLRenderingContext,
  buffers: BufferInfo,
  programInfo: ProgramInfo,
  num: number,
  drawMode: 'lines' | 'points',
  space: '2D' | '3D'
): void {
  const itemSize = space === '3D' ? 3 : 2;
  gl.clearColor(1, 1, 1, 1); // Clear to white, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things
  // eslint-disable-next-line no-bitwise
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const transMat = mat4.create();
  const projMat = mat4.create();

  if (space === '3D') {
    const padding = Math.sqrt(1 / 3.1);
    mat4.scale(transMat, transMat, vec3.fromValues(padding, padding, padding));
    mat4.translate(transMat, transMat, [0, 0, -5]);
    mat4.rotate(transMat, transMat, -(Math.PI / 2), [1, 0, 0]); // axis to rotate around X (static)
    mat4.rotate(transMat, transMat, cubeRotation, [0, 0, 1]); // axis to rotate around Z (dynamic)

    const fieldOfView = (45 * Math.PI) / 180;
    const aspect = gl.canvas.width / gl.canvas.height;
    const zNear = 0;
    const zFar = 50.0;
    mat4.perspective(projMat, fieldOfView, aspect, zNear, zFar);
  }

  gl.useProgram(programInfo.program);
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projMat
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    transMat
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);

  if (space === '3D') {
    // Draw Cube
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.cubeBuffer);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      3,
      gl.FLOAT,
      false,
      0,
      0
    );
    const colors: number[] = [];
    for (let i = 0; i < 16; i += 1) {
      colors.push(0.6, 0.6, 0.6, 1);
    }
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINE_STRIP, 0, 16);
  }
  // Draw Curve
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.curveBuffer);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    itemSize,
    gl.FLOAT,
    false,
    0,
    0
  );
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.curveColorBuffer);
  gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);
  if (drawMode === 'lines') {
    gl.drawArrays(gl.LINE_STRIP, 0, num + 1);
  } else {
    gl.drawArrays(gl.POINTS, 0, num + 1);
  }

  if (space === '3D') {
    cubeRotation += 0.005;
    window.requestAnimationFrame(() =>
      drawCurve(gl, buffers, programInfo, num, drawMode, space)
    );
  }
}

/**
 * this function deals with manual scaling of the curve based on the specified
 * mode, to fit in-place with the cube structure (used by 3D rendering) generated
 * at standard position. It returns a ShapeDrawn object that the Curves tab's
 * component captures, whereby its init function is called to render the curve.
 *
 * @param scaleMode - mode of scaling the curve
 * @param drawMode - mode of drawing between points of the curve
 * @param numPoints - numPoints + 1 vertices to be drawn
 * @param func - function describing the curve
 * @param space - visualization method used to render curve
 * @param isFullView - boolean on whether padding is needed for 2D rendering
 * @returns ShapeDrawn object that the source program returns.
 */
export default function generateCurve(
  scaleMode: 'none' | 'stretch' | 'fit',
  drawMode: 'lines' | 'points',
  numPoints: number,
  func: CurveFunction,
  space: '2D' | '3D',
  isFullView: boolean
): ShapeDrawn {
  let curvePosArray: number[] = [];
  let curveColorArray: number[] = [];
  const drawCubeArray: number[] = [];
  // initialize the min/max to extreme values
  let min_x = Infinity;
  let max_x = -Infinity;
  let min_y = Infinity;
  let max_y = -Infinity;
  let min_z = Infinity;
  let max_z = -Infinity;

  function evaluator(num: number, cFunc: Function): void {
    curvePosArray = [];
    curveColorArray = [];
    for (let i = 0; i <= num; i += 1) {
      const point = cFunc(i / num);
      const x = point.x * 2 - 1;
      const y = point.y * 2 - 1;
      const z = point.z * 2 - 1;
      if (space === '2D') {
        curvePosArray.push(x, y);
      } else {
        curvePosArray.push(x, y, z);
      }
      const color_r = point.color[0];
      const color_g = point.color[1];
      const color_b = point.color[2];
      const color_a = point.color[3];
      curveColorArray.push(color_r, color_g, color_b, color_a);
      min_x = Math.min(min_x, x);
      max_x = Math.max(max_x, x);
      min_y = Math.min(min_y, y);
      max_y = Math.max(max_y, y);
      min_z = Math.min(min_z, z);
      max_z = Math.max(max_z, z);
    }
  }
  evaluator(numPoints, func);

  // padding for 2d draw_connected_full_view
  if (isFullView) {
    const horiz_padding = 0.05 * (max_x - min_x);
    min_x -= horiz_padding;
    max_x += horiz_padding;
    const vert_padding = 0.05 * (max_y - min_y);
    min_y -= vert_padding;
    max_y += vert_padding;
    const depth_padding = 0.05 * (max_z - min_z);
    min_z -= depth_padding;
    max_z += depth_padding;
  }

  // box generation, coordinates are added into the array using 4 push
  // operations to improve on readability during code editing.
  if (space === '3D') {
    drawCubeArray.push(-1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1);
    drawCubeArray.push(1, 1, -1, 1, -1, -1, -1, -1, -1, 1, -1, -1);
    drawCubeArray.push(1, -1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1);
    drawCubeArray.push(-1, 1, 1, -1, 1, -1, 1, 1, -1, 1, 1, 1);
  } else {
    min_z = 0;
    max_z = 0;
  }

  if (scaleMode === 'fit') {
    const center = [
      (min_x + max_x) / 2,
      (min_y + max_y) / 2,
      (min_z + max_z) / 2,
    ];
    let scale = Math.max(max_x - min_x, max_y - min_y, max_z - min_z);
    scale = scale === 0 ? 1 : scale;
    if (space === '3D') {
      for (let i = 0; i < curvePosArray.length; i += 1) {
        if (i % 3 === 0) {
          curvePosArray[i] -= center[0];
          curvePosArray[i] /= scale / 2;
        } else if (i % 3 === 1) {
          curvePosArray[i] -= center[1];
          curvePosArray[i] /= scale / 2;
        } else {
          curvePosArray[i] -= center[2];
          curvePosArray[i] /= scale / 2;
        }
      }
    } else {
      for (let i = 0; i < curvePosArray.length; i += 1) {
        if (i % 2 === 0) {
          curvePosArray[i] -= center[0];
          curvePosArray[i] /= scale / 2;
        } else {
          curvePosArray[i] -= center[1];
          curvePosArray[i] /= scale / 2;
        }
      }
    }
  } else if (scaleMode === 'stretch') {
    const center = [
      (min_x + max_x) / 2,
      (min_y + max_y) / 2,
      (min_z + max_z) / 2,
    ];
    const x_scale = max_x === min_x ? 1 : max_x - min_x;
    const y_scale = max_y === min_y ? 1 : max_y - min_y;
    const z_scale = max_z === min_z ? 1 : max_z - min_z;
    if (space === '3D') {
      for (let i = 0; i < curvePosArray.length; i += 1) {
        if (i % 3 === 0) {
          curvePosArray[i] -= center[0];
          curvePosArray[i] /= x_scale / 2;
        } else if (i % 3 === 1) {
          curvePosArray[i] -= center[1];
          curvePosArray[i] /= y_scale / 2;
        } else {
          curvePosArray[i] -= center[2];
          curvePosArray[i] /= z_scale / 2;
        }
      }
    } else {
      for (let i = 0; i < curvePosArray.length; i += 1) {
        if (i % 2 === 0) {
          curvePosArray[i] -= center[0];
          curvePosArray[i] /= x_scale / 2;
        } else {
          curvePosArray[i] -= center[1];
          curvePosArray[i] /= y_scale / 2;
        }
      }
    }
  }

  return {
    toReplString: () => '<ShapeDrawn>',
    init: (canvas) => {
      canvasElement = canvas;
      renderingContext = canvasElement.getContext('webgl');
      if (!renderingContext) {
        return;
      }
      const cubeBuffer = renderingContext.createBuffer();
      renderingContext.bindBuffer(renderingContext.ARRAY_BUFFER, cubeBuffer);
      renderingContext.bufferData(
        renderingContext.ARRAY_BUFFER,
        new Float32Array(drawCubeArray),
        renderingContext.STATIC_DRAW
      );

      const curveBuffer = renderingContext.createBuffer();
      renderingContext.bindBuffer(renderingContext.ARRAY_BUFFER, curveBuffer);
      renderingContext.bufferData(
        renderingContext.ARRAY_BUFFER,
        new Float32Array(curvePosArray),
        renderingContext.STATIC_DRAW
      );

      const curveColorBuffer = renderingContext.createBuffer();
      renderingContext.bindBuffer(
        renderingContext.ARRAY_BUFFER,
        curveColorBuffer
      );
      renderingContext.bufferData(
        renderingContext.ARRAY_BUFFER,
        new Float32Array(curveColorArray),
        renderingContext.STATIC_DRAW
      );

      const shaderProgram = initShaderProgram(renderingContext, vsS, fsS);
      const programInfo = {
        program: shaderProgram,
        attribLocations: {
          vertexPosition: renderingContext.getAttribLocation(
            shaderProgram,
            'aVertexPosition'
          ),
          vertexColor: renderingContext.getAttribLocation(
            shaderProgram,
            'aFragColor'
          ),
        },
        uniformLocations: {
          projectionMatrix: renderingContext.getUniformLocation(
            shaderProgram,
            'uProjectionMatrix'
          ),
          modelViewMatrix: renderingContext.getUniformLocation(
            shaderProgram,
            'uModelViewMatrix'
          ),
        },
      };
      const buffers = {
        cubeBuffer,
        curveBuffer,
        curveColorBuffer,
      };

      drawCurve(
        renderingContext,
        buffers,
        programInfo,
        numPoints,
        drawMode,
        space
      );
    },
  };
}
