/**
 * This file contains the module's private functions that handles various webgl operations.
 */

export type FrameBufferWithTexture = {
  framebuffer: WebGLFramebuffer;
  texture: WebGLTexture;
};

// The following 2 functions loadShader and initShaderProgram are copied from the curve library, 26 Jul 2021 with no change. This unfortunately violated DIY priciple but I have no choice as those functions are not exported.
/**
 * Gets shader based on given shader program code.
 *
 * @param gl - WebGL's rendering context
 * @param type - Constant describing the type of shader to load
 * @param source - Source code of the shader
 * @returns WebGLShader used to initialize shader program
 */
function loadShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
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
 * @param vsSource - Vertex shader program code
 * @param fsSource - Fragment shader program code
 * @returns WebGLProgram used for getting AttribLocation and UniformLocation
 */
export function initShaderProgram(
  gl: WebGLRenderingContext,
  vsSource: string,
  fsSource: string,
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
 * Get a WebGLRenderingContext from Canvas input
 * @param canvas WebGLRenderingContext
 * @returns
 */
export function getWebGlFromCanvas(
  canvas: HTMLCanvasElement,
): WebGLRenderingContext {
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
 * creates a framebuffer
 * @param gl WebGLRenderingContext
 * @returns FrameBufferWithTexture
 */
export function initFramebufferObject(
  gl: WebGLRenderingContext,
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
    null,
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
    gl.drawingBufferHeight,
  );

  // set the texture object to the framebuffer object
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer); // bind to target
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0,
  );
  // set the renderbuffer object to the framebuffer object
  gl.framebufferRenderbuffer(
    gl.FRAMEBUFFER,
    gl.DEPTH_ATTACHMENT,
    gl.RENDERBUFFER,
    depthBuffer,
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
