import { mat4 } from 'gl-matrix';

/**
 * The basic data-representation of a Rune. When the Rune is drawn, every 3 consecutive vertex will form a triangle.
 * @field vertices - a list of vertex coordinates, each vertex has 4 coordiante (x,y,z,t).
 * @field colors - a list of vertex colors, each vertex has a color (r,g,b,a).
 * @field transformMatrix - a mat4 that is applied to all the vertices and the sub runes
 * @field subRune - a (potentially empty) list of Runes
 */
export type Rune = {
  toReplString: () => string;
  drawMethod: string;
  vertices: Float32Array;
  colors: Float32Array | null;
  transformMatrix: mat4;
  subRunes: Rune[];
  texture: HTMLImageElement | null;
  hollusionDistance: number;
};

export type FrameBufferWithTexture = {
  framebuffer: WebGLFramebuffer;
  texture: WebGLTexture;
};
