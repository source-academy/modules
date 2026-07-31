/* [Imports] */
import type { AlphaColor, Color, Solid } from './jscad/types';

/* [Exports] */
export const CSG_CHANNEL_ID = 'sourceacademy-csg-channel';
export const CSG_RUNNER_ID = 'csg-runner';
export const CSG_WEB_ID = 'csg-web';
export const CSG_TAB_NAME = 'Csg';

/* [Main] */
/* NOTE
  A JSCAD Geom3 is already plain data at runtime - polygons are objects holding
  arrays of [x, y, z] number triples, transforms is a 16-number array, and
  colours are 3- or 4-number arrays. Nothing here is a typed array or a class
  instance, so a Solid would in principle survive structured cloning as-is.

  We still serialize explicitly. The wire format is then something the tab can
  be typed against, the shape is pinned down by protocol.test.ts rather than by
  whatever JSCAD happens to hang off a geometry today, and copying defensively
  means the runner never hands the host a reference to a Shape a student can
  still reach.
*/

export type SerializedPolygon = {
  vertices: number[][];
  color?: number[];
};

export type SerializedSolid = {
  polygons: SerializedPolygon[];
  transforms: number[];
  color?: number[];
};

/** Bundle -> tab: draw these solids on a new canvas. */
export type CsgRenderMessage = {
  type: 'render';
  solids: SerializedSolid[];
  hasGrid: boolean;
  hasAxis: boolean;
};

/**
 * Bundle -> tab: save this file to the user's device. Triggering a download
 * needs an anchor element to click, which only exists on the browser main
 * thread, so the runner serializes the STL and the tab performs the save.
 */
export type CsgDownloadMessage = {
  type: 'download';
  filename: string;
  data: ArrayBuffer[];
};

export type CsgDisplayMessage = CsgRenderMessage | CsgDownloadMessage;

/**
 * The tab sends `request` once it has loaded; the bundle answers by replaying
 * everything it has displayed so far. Without this a program that renders
 * before the tab exists would draw into nothing.
 */
export type CsgChannelMessage = CsgDisplayMessage | {
  type: 'request';
};

function serializeColor(color: Color | AlphaColor | undefined): number[] | undefined {
  return color === undefined ? undefined : Array.from(color);
}

export function serializeSolid(solid: Solid): SerializedSolid {
  const serialized: SerializedSolid = {
    polygons: solid.polygons.map((polygon): SerializedPolygon => {
      const serializedPolygon: SerializedPolygon = {
        vertices: polygon.vertices.map(vertex => Array.from(vertex))
      };

      const color = serializeColor(polygon.color);
      if (color !== undefined) serializedPolygon.color = color;

      return serializedPolygon;
    }),
    transforms: Array.from(solid.transforms)
  };

  const color = serializeColor(solid.color);
  if (color !== undefined) serialized.color = color;

  return serialized;
}

export function deserializeSolid(serialized: SerializedSolid): Solid {
  const solid = {
    polygons: serialized.polygons.map(polygon => {
      const deserializedPolygon = {
        vertices: polygon.vertices.map(vertex => [...vertex])
      };

      if (polygon.color !== undefined) {
        Object.assign(deserializedPolygon, { color: [...polygon.color] });
      }

      return deserializedPolygon;
    }),
    transforms: [...serialized.transforms]
  };

  if (serialized.color !== undefined) {
    Object.assign(solid, { color: [...serialized.color] });
  }

  return solid as Solid;
}
