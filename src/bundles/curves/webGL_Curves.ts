import {
    CurveObject
} from './types';
import { mat4, vec3 } from 'gl-matrix';

let canvasElement: HTMLCanvasElement;
let canvasRenderingContext: CanvasRenderingContext2D;

// Shader programs
const vsS = `
attribute vec4 aFragColor;
attribute vec4 aVertexPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying lowp vec4 aColor;

void main() {
    aColor = aFragColor;
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}`;
const fsS = `
varying lowp vec4 aColor;
precision mediump float;
void main() {
    gl_FragColor = aColor;
}`;

// =============================================================================
// Module's Private Functions
// =============================================================================

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        // alert(
        //   `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
        // );
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        // alert(
        //   `Unable to initialize the shader program: ${gl.getProgramInfoLog(
        //     shaderProgram
        //   )}`
        // );
        return null;
    }

    return shaderProgram;
}

let cubeRotation = 0; // Used for testing
export function generateCurve(
    scaleMode: string,
    drawMode: string,
    numPoints: number,
    func: Function,
    space: string,
    isFullView: boolean
): void {
    const viewport_size: number = 600;
    let curvePosArray: number[] = [];
    let curveColorArray: number[] = [];
    const drawCubeArray: number[] = [];
    const transMat = mat4.create();
    const projMat = mat4.create();
    let curveObject: CurveObject = {
        drawCube: [],
        color: [],
        curvePos: [],
    };
    // initialize the min/max to extreme values
    let min_x = Infinity;
    let max_x = -Infinity;
    let min_y = Infinity;
    let max_y = -Infinity;
    let min_z = Infinity;
    let max_z = -Infinity;

    function evaluator(num: number, cFunc: Function): void {
        curveObject = {
            drawCube: [],
            color: [],
            curvePos: [],
        };
        curvePosArray = [];
        curveColorArray = [];
        for (let i = 0; i <= num; i += 1) {
            const point = cFunc(i / num);
            if (!(point instanceof Point)) {
                throw new Error(`Expected a point, encountered ${point}`);
            }
            const x = point.getX() * 2 - 1;
            const y = point.getY() * 2 - 1;
            const z = point.getZ() * 2 - 1;
            space == '2D' ? curvePosArray.push(x, y) : curvePosArray.push(x, y, z);
            const color_r = point.getColor()[0];
            const color_g = point.getColor()[1];
            const color_b = point.getColor()[2];
            const color_a = point.getColor()[3];
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

    // padding for 2d draw connected full-view
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

    // box generation
    if (space == '3D') {
        drawCubeArray.push(-1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1,
            1, 1, -1, 1, -1, -1, -1, -1, -1, 1, -1, -1,
            1, -1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1,
            -1, 1, 1, -1, 1, -1, 1, 1, -1, 1, 1, 1
        );
    } else {
        min_z = max_z = 0;
    }

    if (scaleMode == 'fit') {
        var center = [
            (min_x + max_x) / 2,
            (min_y + max_y) / 2,
            (min_z + max_z) / 2,
        ];
        var scale = Math.max(max_x - min_x, max_y - min_y, max_z - min_z);
        scale = scale === 0 ? 1 : scale;
        if (space == '3D') {
            for (var i = 0; i < curvePosArray.length; i++) {
                if (i % 3 == 0) {
                    curvePosArray[i] -= center[0];
                    curvePosArray[i] /= scale / 2;
                } else if (i % 3 == 1) {
                    curvePosArray[i] -= center[1];
                    curvePosArray[i] /= scale / 2;
                } else {
                    curvePosArray[i] -= center[2];
                    curvePosArray[i] /= scale / 2;
                }
            }
        } else {
            for (var i = 0; i < curvePosArray.length; i++) {
                if (i % 2 == 0) {
                    curvePosArray[i] -= center[0];
                    curvePosArray[i] /= scale / 2;
                } else {
                    curvePosArray[i] -= center[1];
                    curvePosArray[i] /= scale / 2;
                }
            }
        }
    } else if (scaleMode == 'stretch') {
        var center = [
            (min_x + max_x) / 2,
            (min_y + max_y) / 2,
            (min_z + max_z) / 2,
        ];
        const x_scale = max_x === min_x ? 1 : max_x - min_x;
        const y_scale = max_y === min_y ? 1 : max_y - min_y;
        const z_scale = max_z === min_z ? 1 : max_z - min_z;
        if (space == '3D') {
            for (var i = 0; i < curvePosArray.length; i++) {
                if (i % 3 == 0) {
                    curvePosArray[i] -= center[0];
                    curvePosArray[i] /= x_scale / 2;
                } else if (i % 3 == 1) {
                    curvePosArray[i] -= center[1];
                    curvePosArray[i] /= y_scale / 2;
                } else {
                    curvePosArray[i] -= center[2];
                    curvePosArray[i] /= z_scale / 2;
                }
            }
        } else {
            for (var i = 0; i < curvePosArray.length; i++) {
                if (i % 2 == 0) {
                    curvePosArray[i] -= center[0];
                    curvePosArray[i] /= x_scale / 2;
                } else {
                    curvePosArray[i] -= center[1];
                    curvePosArray[i] /= y_scale / 2;
                }
            }
        }
    }

    if (space == '3D') {
        var scale = Math.sqrt(1 / 3.1);
        mat4.scale(transMat, transMat, vec3.fromValues(scale, scale, scale));
        curveObject.drawCube = drawCubeArray;
        mat4.translate(transMat, transMat, [0, 0, -5]);
        mat4.rotate(transMat, transMat, -(Math.PI / 2), [1, 0, 0]); // axis to rotate around X
        mat4.rotate(transMat, transMat, -0.5, [0, 0, 1]); // axis to rotate around Z
        cubeRotation += 0.1 * Math.PI;

        const fieldOfView = (45 * Math.PI) / 180;
        const aspect = gl.canvas.width / gl.canvas.height;
        const zNear = 0;
        const zFar = 50.0;
        mat4.perspective(projMat, fieldOfView, aspect, zNear, zFar);
    }

    gl.uniformMatrix4fv(u_projectionMatrix, false, projMat);
    gl.uniformMatrix4fv(u_transformMatrix, false, transMat);
    curveObject.curvePos = curvePosArray;
    curveObject.color = curveColorArray;
    curveObject.drawCube = drawCubeArray;
    drawCurve(gl, drawMode, curveObject, space);
    copy_viewport(gl.canvas, frame);
    return new ShapeDrawn(frame); // TODO: I suppose we will directly drawCurve next time into the canvas? from what I see now, nothing uses the return statement
}

function drawCurve(gl: any, buffers, programInfo, num) {
    gl.clearColor(0.8, 0.8, 0.8, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    const transMat = mat4.create();
    const projMat = mat4.create();
  
    const padding = Math.sqrt(1 / 3.1);
    mat4.scale(transMat, transMat, vec3.fromValues(padding, padding, padding));
    mat4.translate(transMat, transMat, [0, 0, -5]);
    mat4.rotate(transMat, transMat, -(Math.PI / 2), [1, 0, 0]); // axis to rotate around X (static)
    mat4.rotate(transMat, transMat, cubeRotation, [0, 0, 1]); // axis to rotate around Z (dynamic)
  
    const scale = buffers.aspects.scale === 0 ? 1 : buffers.aspects.scale;
    const { center } = buffers.aspects;
    mat4.scale(
      transMat,
      transMat,
      vec3.fromValues(2 / scale, 2 / scale, 2 / scale)
    );
    mat4.translate(
      transMat,
      transMat,
      vec3.fromValues(-center[0], -center[1], -center[2])
    );
  
    const fieldOfView = (45 * Math.PI) / 180;
    const aspect = gl.canvas.width / gl.canvas.height;
    const zNear = 0;
    const zFar = 50.0;
    mat4.perspective(projMat, fieldOfView, aspect, zNear, zFar);
  
    if (!gl) {
      throw new Error('Canvas component not activated!');
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
    // eslint-disable-next-line
    { // Draw Cube
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.cubeBuffer);
      gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        3,
        gl.FLOAT,
        false,
        0,
        0
      );
      // gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  
      const colors: number[] = [];
      for (let i = 0; i < 16; i += 1) {
        colors.push(0.6, 0.6, 0.6, 1);
      }
      const colorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
      gl.vertexAttribPointer(
        programInfo.attribLocations.fragmentColor,
        4,
        gl.FLOAT,
        false,
        0,
        0
      );
      gl.drawArrays(gl.LINE_STRIP, 0, 16);
    }
    // eslint-disable-next-line
    { // Draw Curve
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.curveBuffer);
      gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        3,
        gl.FLOAT,
        false,
        0,
        0
      );
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.curveColorBuffer);
      gl.vertexAttribPointer(
        programInfo.attribLocations.fragmentColor,
        4,
        gl.FLOAT,
        false,
        0,
        0
      );
      gl.drawArrays(gl.LINE_STRIP, 0, num + 1);
    }
  
    cubeRotation += 0.005;
    window.requestAnimationFrame(() =>
      drawCurveTest(gl, buffers, programInfo, num)
    );
  }
  