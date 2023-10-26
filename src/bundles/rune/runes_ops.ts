/**
 * This file contains the bundle's private functions for runes.
 */
import { Rune } from './rune';

// =============================================================================
// Utility Functions
// =============================================================================
export function throwIfNotRune(name: string, ...runes: any) {
  runes.forEach((rune) => {
    if (!(rune instanceof Rune)) {
      throw Error(`${name} expects a rune as argument.`);
    }
  });
}

// =============================================================================
// Basic Runes
// =============================================================================

/**
 * primitive Rune in the rune of a full square
 * */
export const getSquare: () => Rune = () => {
  const vertexList: number[] = [];
  const colorList: number[] = [];

  vertexList.push(-1, 1, 0, 1);
  vertexList.push(-1, -1, 0, 1);
  vertexList.push(1, -1, 0, 1);
  vertexList.push(1, -1, 0, 1);
  vertexList.push(-1, 1, 0, 1);
  vertexList.push(1, 1, 0, 1);

  colorList.push(0, 0, 0, 1);

  return Rune.of({
    vertices: new Float32Array(vertexList),
    colors: new Float32Array(colorList),
  });
};

export const getBlank: () => Rune = () => Rune.of();

/**
 * primitive Rune in the rune of a
 * smallsquare inside a large square,
 * each diagonally split into a
 * black and white half
 * */
export const getRcross: () => Rune = () => {
  const vertexList: number[] = [];
  const colorList: number[] = [];
  // lower small triangle
  vertexList.push(-0.5, 0.5, 0, 1);
  vertexList.push(-0.5, -0.5, 0, 1);
  vertexList.push(0.5, -0.5, 0, 1);

  // upper shape, starting from left-top corner
  vertexList.push(-1, 1, 0, 1);
  vertexList.push(-0.5, 0.5, 0, 1);
  vertexList.push(1, 1, 0, 1);

  vertexList.push(-0.5, 0.5, 0, 1);
  vertexList.push(1, 1, 0, 1);
  vertexList.push(0.5, 0.5, 0, 1);

  vertexList.push(1, 1, 0, 1);
  vertexList.push(0.5, 0.5, 0, 1);
  vertexList.push(1, -1, 0, 1);

  vertexList.push(0.5, 0.5, 0, 1);
  vertexList.push(1, -1, 0, 1);
  vertexList.push(0.5, -0.5, 0, 1);

  colorList.push(0, 0, 0, 1);

  return Rune.of({
    vertices: new Float32Array(vertexList),
    colors: new Float32Array(colorList),
  });
};

/**
 * primitive Rune in the rune of a sail
 * */
export const getSail: () => Rune = () => {
  const vertexList: number[] = [];
  const colorList: number[] = [];

  vertexList.push(0.5, -1, 0, 1);
  vertexList.push(0, -1, 0, 1);
  vertexList.push(0, 1, 0, 1);

  colorList.push(0, 0, 0, 1);

  return Rune.of({
    vertices: new Float32Array(vertexList),
    colors: new Float32Array(colorList),
  });
};

/**
 * primitive Rune in the rune of a triangle
 * */
export const getTriangle: () => Rune = () => {
  const vertexList: number[] = [];
  const colorList: number[] = [];

  vertexList.push(1, -1, 0, 1);
  vertexList.push(0, -1, 0, 1);
  vertexList.push(0, 1, 0, 1);

  colorList.push(0, 0, 0, 1);

  return Rune.of({
    vertices: new Float32Array(vertexList),
    colors: new Float32Array(colorList),
  });
};

/**
 * primitive Rune with black triangle,
 * filling upper right corner
 * */
export const getCorner: () => Rune = () => {
  const vertexList: number[] = [];
  const colorList: number[] = [];
  vertexList.push(1, 0, 0, 1);
  vertexList.push(1, 1, 0, 1);
  vertexList.push(0, 1, 0, 1);

  colorList.push(0, 0, 0, 1);

  return Rune.of({
    vertices: new Float32Array(vertexList),
    colors: new Float32Array(colorList),
  });
};

/**
 * primitive Rune in the rune of two overlapping
 * triangles, residing in the upper half
 * of
 * */
export const getNova: () => Rune = () => {
  const vertexList: number[] = [];
  const colorList: number[] = [];
  vertexList.push(0, 1, 0, 1);
  vertexList.push(-0.5, 0, 0, 1);
  vertexList.push(0, 0.5, 0, 1);

  vertexList.push(-0.5, 0, 0, 1);
  vertexList.push(0, 0.5, 0, 1);
  vertexList.push(1, 0, 0, 1);

  colorList.push(0, 0, 0, 1);

  return Rune.of({
    vertices: new Float32Array(vertexList),
    colors: new Float32Array(colorList),
  });
};

/**
 * primitive Rune in the rune of a circle
 * */
export const getCircle: () => Rune = () => {
  const vertexList: number[] = [];
  const colorList: number[] = [];
  const circleDiv = 60;
  for (let i = 0; i < circleDiv; i += 1) {
    const angle1 = ((2 * Math.PI) / circleDiv) * i;
    const angle2 = ((2 * Math.PI) / circleDiv) * (i + 1);
    vertexList.push(Math.cos(angle1), Math.sin(angle1), 0, 1);
    vertexList.push(Math.cos(angle2), Math.sin(angle2), 0, 1);
    vertexList.push(0, 0, 0, 1);
  }
  colorList.push(0, 0, 0, 1);

  return Rune.of({
    vertices: new Float32Array(vertexList),
    colors: new Float32Array(colorList),
  });
};

/**
 * primitive Rune in the rune of a heart
 * */
export const getHeart: () => Rune = () => {
  const vertexList: number[] = [];
  const colorList: number[] = [];

  const root2 = Math.sqrt(2);
  const r = 4 / (2 + 3 * root2);
  const scaleX = 1 / (r * (1 + root2 / 2));
  const numPoints = 100;

  // right semi-circle
  const rightCenterX = r / root2;
  const rightCenterY = 1 - r;
  for (let i = 0; i < numPoints; i += 1) {
    const angle1 = Math.PI * (-1 / 4 + i / numPoints);
    const angle2 = Math.PI * (-1 / 4 + (i + 1) / numPoints);
    vertexList.push(
      (Math.cos(angle1) * r + rightCenterX) * scaleX,
      Math.sin(angle1) * r + rightCenterY,
      0,
      1,
    );
    vertexList.push(
      (Math.cos(angle2) * r + rightCenterX) * scaleX,
      Math.sin(angle2) * r + rightCenterY,
      0,
      1,
    );
    vertexList.push(0, -1, 0, 1);
  }
  // left semi-circle
  const leftCenterX = -r / root2;
  const leftCenterY = 1 - r;
  for (let i = 0; i <= numPoints; i += 1) {
    const angle1 = Math.PI * (1 / 4 + i / numPoints);
    const angle2 = Math.PI * (1 / 4 + (i + 1) / numPoints);
    vertexList.push(
      (Math.cos(angle1) * r + leftCenterX) * scaleX,
      Math.sin(angle1) * r + leftCenterY,
      0,
      1,
    );
    vertexList.push(
      (Math.cos(angle2) * r + leftCenterX) * scaleX,
      Math.sin(angle2) * r + leftCenterY,
      0,
      1,
    );
    vertexList.push(0, -1, 0, 1);
  }

  colorList.push(0, 0, 0, 1);

  return Rune.of({
    vertices: new Float32Array(vertexList),
    colors: new Float32Array(colorList),
  });
};

/**
 * primitive Rune in the rune of a pentagram
 * */
export const getPentagram: () => Rune = () => {
  const vertexList: number[] = [];
  const colorList: number[] = [];

  const v1 = Math.sin(Math.PI / 10);
  const v2 = Math.cos(Math.PI / 10);

  const w1 = Math.sin((3 * Math.PI) / 10);
  const w2 = Math.cos((3 * Math.PI) / 10);

  const vertices: number[][] = [];
  vertices.push([v2, v1, 0, 1]);
  vertices.push([w2, -w1, 0, 1]);
  vertices.push([-w2, -w1, 0, 1]);
  vertices.push([-v2, v1, 0, 1]);
  vertices.push([0, 1, 0, 1]);

  for (let i = 0; i < 5; i += 1) {
    vertexList.push(0, 0, 0, 1);
    vertexList.push(...vertices[i]);
    vertexList.push(...vertices[(i + 2) % 5]);
  }

  colorList.push(0, 0, 0, 1);

  return Rune.of({
    vertices: new Float32Array(vertexList),
    colors: new Float32Array(colorList),
  });
};

/**
 * primitive Rune in the rune of a ribbon
 * winding outwards in an anticlockwise spiral
 * */
export const getRibbon: () => Rune = () => {
  const vertexList: number[] = [];
  const colorList: number[] = [];

  const thetaMax = 30;
  const thickness = -1 / thetaMax;
  const unit = 0.1;

  const vertices: number[][] = [];
  for (let i = 0; i < thetaMax; i += unit) {
    vertices.push([
      (i / thetaMax) * Math.cos(i),
      (i / thetaMax) * Math.sin(i),
      0,
      1,
    ]);
    vertices.push([
      Math.abs(Math.cos(i) * thickness) + (i / thetaMax) * Math.cos(i),
      Math.abs(Math.sin(i) * thickness) + (i / thetaMax) * Math.sin(i),
      0,
      1,
    ]);
  }
  for (let i = 0; i < vertices.length - 2; i += 1) {
    vertexList.push(...vertices[i]);
    vertexList.push(...vertices[i + 1]);
    vertexList.push(...vertices[i + 2]);
  }

  colorList.push(0, 0, 0, 1);

  return Rune.of({
    vertices: new Float32Array(vertexList),
    colors: new Float32Array(colorList),
  });
};

// =============================================================================
// Coloring Functions
// =============================================================================
// black and white not included because they are boring colors
// colorPalette is used in generateFlattenedRuneList to generate a random color
export const colorPalette = [
  '#F44336',
  '#E91E63',
  '#AA00FF',
  '#3F51B5',
  '#2196F3',
  '#4CAF50',
  '#FFEB3B',
  '#FF9800',
  '#795548',
];

export function hexToColor(hex: string): number[] {
  const result = /^#?(?<red>[a-f\d]{2})(?<green>[a-f\d]{2})(?<blue>[a-f\d]{2})$/iu.exec(
    hex,
  );
  if (result === null || result.length < 4) {
    return [0, 0, 0];
  }
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
    1,
  ];
}

export function addColorFromHex(rune: Rune, hex: string) {
  throwIfNotRune(addColorFromHex.name, rune);
  return Rune.of({
    subRunes: [rune],
    colors: new Float32Array(hexToColor(hex)),
  });
}
