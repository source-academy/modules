/* eslint-disable max-classes-per-file */
import { mat4 } from 'gl-matrix';
import { ModuleState } from 'js-slang';

/**
 * The basic data-representation of a Rune. When the Rune is drawn, every 3 consecutive vertex will form a triangle.
 * @field vertices - a list of vertex coordinates, each vertex has 4 coordiante (x,y,z,t).
 * @field colors - a list of vertex colors, each vertex has a color (r,g,b,a).
 * @field transformMatrix - a mat4 that is applied to all the vertices and the sub runes
 * @field subRune - a (potentially empty) list of Runes
 */
export class Rune {
  constructor(
    public drawMethod: string,
    public vertices: Float32Array,
    public colors: Float32Array | null,
    public transformMatrix: mat4,
    public subRunes: Rune[],
    public texture: HTMLImageElement | null,
    public hollusionDistance: number
  ) {}

  public static of = (
    params: {
      drawMethod?: string;
      vertices?: Float32Array;
      colors?: Float32Array | null;
      transformMatrix?: mat4;
      subRunes?: Rune[];
      texture?: HTMLImageElement | null;
      hollusionDistance?: number;
    } = {}
  ) => {
    const paramGetter = (name: string, defaultValue: () => any) =>
      params[name] === undefined ? defaultValue() : params[name];

    return new Rune(
      paramGetter('drawMethod', () => ''),
      paramGetter('vertices', () => new Float32Array()),
      paramGetter('colors', () => null),
      paramGetter('transformMatrix', mat4.create),
      paramGetter('subRunes', () => []),
      paramGetter('texture', () => null),
      paramGetter('hollusionDistance', () => 0.1)
    );
  };

  public copy = () =>
    Rune.of({
      vertices: this.vertices,
      colors: this.colors,
      transformMatrix: mat4.clone(this.transformMatrix),
      subRunes: this.subRunes,
      texture: this.texture,
      hollusionDistance: this.hollusionDistance,
    });

  /**
   * Flatten the subrunes to return a list of runes
   * @return type Rune[], a list of runes
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

  public toReplString = () => '<Rune>';
}

export class RuneFactory {
  private drawMethod: string = '';

  private vertices: Float32Array = new Float32Array();

  private colors: Float32Array | null = null;

  private transformMatrix: mat4 = mat4.create();

  private subRunes: Rune[] = [];

  private texture: HTMLImageElement | null = null;

  private hollusionDistance: number = 0.1;

  constructor(
    vertices: Float32Array,
    colors: Float32Array | null,
    transformMatrix: mat4,
    subRunes: Rune[],
    texture: HTMLImageElement | null,
    hollusionDistance: number
  ) {
    this.vertices = vertices;
    this.colors = colors;
    this.transformMatrix = transformMatrix;
    this.subRunes = subRunes;
    this.texture = texture;
    this.hollusionDistance = hollusionDistance;
  }

  public static fromRune = (rune: Rune) =>
    new RuneFactory(
      rune.vertices,
      rune.colors,
      mat4.clone(rune.transformMatrix),
      rune.subRunes,
      rune.texture,
      rune.hollusionDistance
    );

  public addSubRune = (...runes: Rune[]) => {
    this.subRunes.push(...runes);
    return this;
  };

  public setTexture(texture: HTMLImageElement | null) {
    this.texture = texture;
    return this;
  }

  public toRune = () =>
    Rune.of({
      drawMethod: this.drawMethod,
      vertices: this.vertices,
      colors: this.colors,
      transformMatrix: this.transformMatrix,
      subRunes: this.subRunes,
      texture: this.texture,
      hollusionDistance: this.hollusionDistance,
    });

  public draw = (canvas: HTMLCanvasElement) => {
    
  };
}

export type FrameBufferWithTexture = {
  framebuffer: WebGLFramebuffer;
  texture: WebGLTexture;
};

export class RunesModuleState implements ModuleState {
  constructor(public drawnRunes: Rune[] = []) {}
}
