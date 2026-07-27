/**
 * File for providing the missing type information for @jscad/stl-serializer
 * Actual function signature can be found [here](https://github.com/jscad/OpenJSCAD.org/blob/master/packages/io/stl-serializer/index.js)
 */
declare module '@jscad/stl-serializer' {
  type SerializeOptions = {
    binary?: boolean
    statusCallback?: (progress: number) => void
  }

  // Binary serialization returns a "blobable array" of ArrayBuffers (the STL
  // header, the triangle count, then the triangle data); text serialization
  // returns the STL source in chunks.
  export function serialize(
    options: SerializeOptions & { binary: true },
    ...objects: any[]
  ): ArrayBuffer[];

  export function serialize(
    options: SerializeOptions,
    ...objects: any[]
  ): string[];
}
