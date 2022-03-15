/**
 * This file contains the module's private functions that handles various webgl operations.
 */

import { mat4, vec3 } from 'gl-matrix';
import { FrameBufferWithTexture, Rune } from './types';
import { blank, overlay_frac, scale, square, white } from './functions';

// =============================================================================
// Private functions
// =============================================================================

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

const anaglyphVertexShader = `
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

const anaglyphFragmentShader = `
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

const copyVertexShader = `
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

const copyFragmentShader = `
precision mediump float;
uniform sampler2D uTexture;
varying highp vec2 v_texturePosition;
void main() {
    gl_FragColor = texture2D(uTexture, v_texturePosition);
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
  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    const compilationLog = gl.getShaderInfoLog(shader);
    throw Error(`Shader compilation failed: ${compilationLog}`);
  }
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
 * get a WebGLRenderingContext from Canvas input
 * @param canvas WebGLRenderingContext
 * @returns
 */
function getWebGlFromCanvas(canvas: HTMLCanvasElement): WebGLRenderingContext {
  const gl: WebGLRenderingContext | null = canvas.getContext('webgl');
  if (!gl) {
    throw Error('Unable to initialize WebGL.');
  }
  gl.clearColor(1.0, 1.0, 1.0, 1.0); // Set clear color to white, fully opaque
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LESS); // Near things obscure far things (this is default setting can omit)
  // eslint-disable-next-line no-bitwise
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the viewport
  return gl;
}

/**
 * Credit to: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL
 * Initialize a texture and load an image.
 * When the image finished loading copy it into the texture.
 */
function loadTexture(
  gl: WebGLRenderingContext,
  image: HTMLImageElement
): WebGLTexture | null {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  function isPowerOf2(value) {
    // eslint-disable-next-line no-bitwise
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
}

/**
 * Draws the list of runes with the prepared WebGLRenderingContext, with each rune overlapping each other onto a given framebuffer. if the framebuffer is null, draw to the default canvas.
 *
 * @param gl a prepared WebGLRenderingContext with shader program linked
 * @param runes a list of rune (Rune[]) to be drawn sequentially
 */
function drawRunesToFrameBuffer(
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
  if (depthSwitch) {
    gl.uniform1i(depthSwitchPointer, 1);
  } else {
    gl.uniform1i(depthSwitchPointer, 0);
  }

  // load projection and camera
  const orthoCam = mat4.create();
  mat4.ortho(orthoCam, -1, 1, -1, 1, -0.5, 1.5);
  gl.uniformMatrix4fv(projectionMatrixPointer, false, orthoCam);
  gl.uniformMatrix4fv(cameraMatrixPointer, false, cameraMatrix);

  // load colorfilter
  gl.uniform4fv(vertexColorFilterPt, colorFilter);

  // 3. draw each Rune using the shader program
  runes.forEach((rune: Rune) => {
    // load position buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, rune.vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(vertexPositionPointer, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPositionPointer);

    // load color/texture
    if (rune.texture === null) {
      if (rune.colors != null) {
        gl.uniform4fv(vertexColorPointer, rune.colors);
      } else {
        gl.uniform4fv(vertexColorPointer, new Float32Array([0, 0, 0, 1]));
      }
      gl.uniform1i(textureSwitchPointer, 0);
    } else {
      const texture = loadTexture(gl, rune.texture);
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
 * creates a framebuffer
 * @param gl WebGLRenderingContext
 * @returns FrameBufferWithTexture
 */
function initFramebufferObject(
  gl: WebGLRenderingContext
): FrameBufferWithTexture {
  // create a framebuffer object
  const framebuffer = gl.createFramebuffer();
  if (!framebuffer) {
    throw Error('Failed to create frame buffer object');
  }

  // create a texture object and set its size and parameters
  const texture = gl.createTexture();
  if (!texture) {
    throw Error('Failed to create texture object');
  }
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.drawingBufferWidth,
    gl.drawingBufferHeight,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  // create a renderbuffer for depth buffer
  const depthBuffer = gl.createRenderbuffer();
  if (!depthBuffer) {
    throw Error('Failed to create renderbuffer object');
  }

  // bind renderbuffer object to target and set size
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
  gl.renderbufferStorage(
    gl.RENDERBUFFER,
    gl.DEPTH_COMPONENT16,
    gl.drawingBufferWidth,
    gl.drawingBufferHeight
  );

  // set the texture object to the framebuffer object
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer); // bind to target
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0
  );
  // set the renderbuffer object to the framebuffer object
  gl.framebufferRenderbuffer(
    gl.FRAMEBUFFER,
    gl.DEPTH_ATTACHMENT,
    gl.RENDERBUFFER,
    depthBuffer
  );

  // check whether the framebuffer is configured correctly
  const e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (gl.FRAMEBUFFER_COMPLETE !== e) {
    throw Error(`Frame buffer object is incomplete:${e.toString()}`);
  }

  // Unbind the buffer object
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);

  return {
    framebuffer,
    texture,
  };
}

// =============================================================================
// Exposed functions
// =============================================================================

function stopAnimation(canvas: HTMLCanvasElement) {
  if (canvas.hasAttribute('animRequestID')) {
    const nodeMap = canvas.attributes;
    const idAttr = nodeMap.getNamedItem('animRequestID');
    const id = parseInt(idAttr?.value as string, 10);
    window.cancelAnimationFrame(id);
  }
}
/**
 * Draw the rune in the tab, including all the sub runes.
 *
 * @param canvas HTMLCanvasElement element in the tab
 * @param rune the Rune to be drawn
 */
export function drawRune(canvas: HTMLCanvasElement, rune: Rune) {
  const gl = getWebGlFromCanvas(canvas);
  stopAnimation(canvas);
  const runes = rune.flatten();

  // prepare camera projection array
  const cameraMatrix = mat4.create();

  // color filter set to [1,1,1,1] for transparent filter
  drawRunesToFrameBuffer(
    gl,
    runes,
    cameraMatrix,
    new Float32Array([1, 1, 1, 1]),
    null,
    true
  );
}

/**
 * Draw the rune in the tab, including all the sub runes in anaglyph mode.
 * It first renders two frames with respective colorfilters and cameras for the left and right
 * eye, and then combine the two frames in the canvas.
 *
 * @param canvas HTMLCanvasElement element in the tab
 * @param rune the Rune to be drawn
 */
export function drawAnaglyph(canvas: HTMLCanvasElement, rune: Rune) {
  const gl = getWebGlFromCanvas(canvas);
  stopAnimation(canvas);

  // before draw the runes to framebuffer, we need to first draw a white background to cover the transparent places
  const runes = white(overlay_frac(0.999999999, blank, scale(2.2, square)))
    .flatten()
    .concat(rune.flatten());

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
  drawRunesToFrameBuffer(
    gl,
    runes,
    leftCameraMatrix,
    new Float32Array([1, 0, 0, 1]),
    leftBuffer.framebuffer,
    true
  );
  drawRunesToFrameBuffer(
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
    anaglyphVertexShader,
    anaglyphFragmentShader
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
}

/**
 * Draw the rune in the tab, including all the sub runes with hollusion effect.
 * It varies the camera position with time, and the runes are drawn with this animated
 * camera to create a 3D effect.
 * @param canvas HTMLCanvasElement element in the tab
 * @param rune the Rune to be drawn
 */
export function drawHollusion(canvas: HTMLCanvasElement, rune: Rune) {
  const gl = getWebGlFromCanvas(canvas);
  stopAnimation(canvas);

  const runes = white(overlay_frac(0.999999999, blank, scale(2.2, square)))
    .flatten()
    .concat(rune.flatten());

  // first render all the frames into a framebuffer
  const xshiftMax = runes[0].hollusionDistance;
  const period = 2000; // animations loops every 2 seconds
  const frameCount = 50; // in total 50 frames, gives rise to 25 fps
  const frameBuffer: FrameBufferWithTexture[] = [];

  function renderFrame(framePos: number): FrameBufferWithTexture {
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

    drawRunesToFrameBuffer(
      gl,
      runes,
      cameraMatrix,
      new Float32Array([1, 1, 1, 1]),
      fb.framebuffer,
      true
    );
    return fb;
  }

  for (let i = 0; i < frameCount; i += 1) {
    frameBuffer.push(renderFrame(i));
  }

  // Then, draw a frame from framebuffer for each update
  const copyShaderProgram = initShaderProgram(
    gl,
    copyVertexShader,
    copyFragmentShader
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
    if (!canvas.isEqualNode(document.getElementById('runesCanvas'))) {
      return;
    }
    const id = requestAnimationFrame(render);
    canvas.setAttribute('animRequestID', `${id}`);
    if (timeInMs - lastTime < period / frameCount) {
      return;
    }
    lastTime = timeInMs;

    const framePos = Math.floor(timeInMs / (period / frameCount)) % frameCount;
    const fbObject = frameBuffer[framePos];
    gl.clearColor(1.0, 1.0, 1.0, 1.0); // Set clear color to white, fully opaque
    // eslint-disable-next-line no-bitwise
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the viewport

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, fbObject.texture);
    gl.uniform1i(texturePt, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  requestAnimationFrame(render);
}
